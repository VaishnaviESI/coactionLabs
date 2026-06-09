import { Router } from "express";
import jwt from "jsonwebtoken";
import { query } from "../db.js";
import { SCHEMAS } from "../constants/schemas.js";
import { jwtVerify } from "../middleware/auth.js";

export const authRouter = Router();

const isOktaDisabled = () =>
  (process.env.DISABLE_OKTA ?? "false").toLowerCase() === "true";

const JWT_TTL_SECONDS = 60 * 60 * 8; // 8 hours.

// GET /api/auth/config → public PKCE config the SPA needs to start the flow.
authRouter.get("/config", (_req, res) => {
  if (isOktaDisabled()) {
    res.json({ disabled: true, useLocalAuth: true });
    return;
  }

  res.json({
    issuer: process.env.OKTA_ISSUER ?? null,
    clientId: process.env.OKTA_CLIENT_ID ?? null,
    redirectUri: process.env.OKTA_REDIRECT_URI ?? null,
    disabled: false,
  });
});

interface OktaTokenResponse {
  id_token?: string;
  access_token?: string;
  error?: string;
  error_description?: string;
}

interface OktaIdClaims {
  sub?: string;
  email?: string;
  name?: string;
  preferred_username?: string;
}

/** Persist (or refresh) the user record keyed by Okta `sub` in the iam schema. */
async function upsertUser(claims: OktaIdClaims): Promise<void> {
  if (!claims.sub) return;
  const email = claims.email ?? claims.preferred_username ?? "";
  const name = claims.name ?? "";

  await query(
    `INSERT INTO ${SCHEMAS.iam}.users (okta_sub, email, name, last_login_at)
     VALUES ($1, $2, $3, NOW())
     ON CONFLICT (okta_sub)
     DO UPDATE SET email = EXCLUDED.email,
                   name = EXCLUDED.name,
                   last_login_at = NOW()`,
    [claims.sub, email, name],
  );
}

function signSessionToken(claims: OktaIdClaims): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return jwt.sign(
    {
      sub: claims.sub,
      email: claims.email ?? claims.preferred_username ?? "",
      name: claims.name ?? "",
    },
    secret,
    { expiresIn: JWT_TTL_SECONDS },
  );
}

// GET /api/auth/callback → exchange the auth code for tokens, return our JWT.
authRouter.get("/callback", async (req, res) => {
  if (isOktaDisabled()) {
    const token = signSessionToken({
      sub: "local-dev-user",
      email: "dev@coactionspecialty.com",
      name: "Local Dev",
    });
    res.json({ token });
    return;
  }

  const code = typeof req.query.code === "string" ? req.query.code : null;
  if (!code) {
    res.status(400).json({ error: "Missing authorization code" });
    return;
  }

  const issuer = process.env.OKTA_ISSUER;
  const clientId = process.env.OKTA_CLIENT_ID;
  const clientSecret = process.env.OKTA_CLIENT_SECRET;
  const redirectUri = process.env.OKTA_REDIRECT_URI;
  if (!issuer || !clientId || !clientSecret || !redirectUri) {
    res.status(500).json({ error: "Okta is not fully configured" });
    return;
  }

  try {
    const tokenResponse = await fetch(`${issuer}/v1/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    const payload = (await tokenResponse.json()) as OktaTokenResponse;
    if (!tokenResponse.ok || !payload.id_token) {
      res.status(401).json({
        error: payload.error_description || payload.error || "Token exchange failed",
      });
      return;
    }

    // The id_token is freshly issued by Okta over TLS in this exchange; decode
    // its claims to establish identity, then mint our own session JWT.
    const claims = jwt.decode(payload.id_token) as OktaIdClaims | null;
    if (!claims?.sub) {
      res.status(401).json({ error: "id_token missing subject" });
      return;
    }

    await upsertUser(claims);
    res.json({ token: signSessionToken(claims) });
  } catch (err) {
    console.error("[AUTH] callback error:", err);
    res.status(500).json({ error: "Authentication failed" });
  }
});

// GET /api/auth/me → the decoded, role-resolved user (requires a token).
authRouter.get("/me", jwtVerify, (req, res) => {
  res.json({ user: req.user });
});
