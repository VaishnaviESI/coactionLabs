import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { query } from "../db.js";
import { SCHEMAS } from "../constants/schemas.js";

// Shape attached to every authenticated request.
export interface AuthUser {
  sub: string; // Okta `sub` — the canonical user ID.
  email: string;
  name: string;
  isAdmin: boolean;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

const isOktaDisabled = () =>
  (process.env.DISABLE_OKTA ?? "false").toLowerCase() === "true";

// Local-dev mock user used when DISABLE_OKTA=true.
const MOCK_USER: AuthUser = {
  sub: "local-dev-user",
  email: "dev@coactionspecialty.com",
  name: "Local Dev",
  isAdmin: true,
};

interface LabsJwtClaims {
  sub: string;
  email?: string;
  name?: string;
}

/**
 * Resolve a user's admin flag from the iam schema. Kept here (not in the token)
 * so role changes take effect on the next request without re-issuing a JWT.
 */
async function resolveIsAdmin(sub: string): Promise<boolean> {
  const result = await query<{ is_admin: boolean }>(
    `SELECT is_admin FROM ${SCHEMAS.iam}.users WHERE okta_sub = $1 LIMIT 1`,
    [sub],
  );
  return result.rows[0]?.is_admin ?? false;
}

/**
 * Validate `Authorization: Bearer <token>` on every request and attach req.user.
 * When DISABLE_OKTA=true the middleware short-circuits to a mock user.
 */
export async function jwtVerify(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  if (isOktaDisabled()) {
    req.user = MOCK_USER;
    next();
    return;
  }

  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or malformed Authorization header" });
    return;
  }

  const token = header.slice(7);
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500).json({ error: "Server auth is not configured" });
    return;
  }

  try {
    const claims = jwt.verify(token, secret) as LabsJwtClaims;
    if (!claims.sub) {
      res.status(401).json({ error: "Token is missing subject claim" });
      return;
    }

    const isAdmin = await resolveIsAdmin(claims.sub);
    req.user = {
      sub: claims.sub,
      email: claims.email ?? "",
      name: claims.name ?? "",
      isAdmin,
    };
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
