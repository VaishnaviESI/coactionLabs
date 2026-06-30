 

import { OktaAuth, type OktaAuthOptions } from "@okta/okta-auth-js";
const rawIssuer = (import.meta.env.VITE_OKTA_ISSUER ?? "")
  .replace(/\/+$/, "")
  .replace(/\/oauth2\/[^/]+$/i, "");
const clientId = import.meta.env.VITE_OKTA_CLIENT_ID ?? "";

if (!rawIssuer || !clientId) {
  // Surface misconfiguration loudly in the console rather than silently
  // failing at sign-in time.
  console.error(
    "[OKTA] Missing VITE_OKTA_ISSUER or VITE_OKTA_CLIENT_ID in environment.",
  );
}

const origin = typeof window !== "undefined" ? window.location.origin : "";

export const oktaAuthOptions: OktaAuthOptions = {
  issuer: rawIssuer,
  clientId,
  redirectUri: `${origin}/login/callback`,
  postLogoutRedirectUri: `${origin}/`,
  scopes: ["openid", "profile", "email"],
  pkce: true,
  responseType: ["code"],
  tokenManager: {
    storage: "localStorage",
  },
};

// --- Debug logging -------------------------------------------------------
// Log the resolved Okta endpoints once at startup so it's easy to verify
// that the SPA is talking to the correct authorization server.
console.info("[OKTA] Configured issuer:", rawIssuer);
console.info(
  "[OKTA] OIDC discovery URL:",
  `${rawIssuer}/.well-known/openid-configuration`,
);
// Org authorization server endpoints live under /oauth2/v1/* (NOT /v1/*).
console.info("[OKTA] Authorize URL:", `${rawIssuer}/oauth2/v1/authorize`);
console.info("[OKTA] Token URL:", `${rawIssuer}/oauth2/v1/token`);
console.info("[OKTA] Redirect URI:", `${origin}/login/callback`);
console.info("[OKTA] Client ID:", clientId);

// Wrap window.fetch so every outbound Okta request (and its status) is
// printed to the console. This is invaluable for diagnosing 400s from
// /authorize, /token, or /.well-known/openid-configuration.
if (typeof window !== "undefined" && !(window as unknown as { __oktaFetchPatched?: boolean }).__oktaFetchPatched) {
  const originalFetch = window.fetch.bind(window);
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url;

    const isOkta = rawIssuer && url.startsWith(rawIssuer);
    if (isOkta) {
      console.info(
        `[OKTA fetch] ${(init?.method ?? "GET").toUpperCase()} ${url}`,
      );
    }
    try {
      const res = await originalFetch(input, init);
      if (isOkta) {
        console.info(
          `[OKTA fetch] ← ${res.status} ${res.statusText} ${url}`,
        );
        if (!res.ok) {
          // Clone so we don't consume the body the caller needs.
          try {
            const body = await res.clone().text();
            console.error(`[OKTA fetch] error body for ${url}:`, body);
          } catch {
            /* ignore */
          }
        }
      }
      return res;
    } catch (err) {
      if (isOkta) {
        console.error(`[OKTA fetch] network error for ${url}:`, err);
      }
      throw err;
    }
  };
  (window as unknown as { __oktaFetchPatched?: boolean }).__oktaFetchPatched = true;
}

// okta-auth-js performs sign-in via a full-page navigation, so the
// /authorize response (and any 400 from it) never appears in the Network
// "fetch" view and cannot be intercepted (Chrome locks window.location).
// Instead we expose a manual probe you can run from the DevTools console:
//
//   await window.__debugOktaAuthorize()
//
// It reads the real discovery document, builds a representative /authorize
// request, and fetches it with redirect:"manual" so we can print Okta's
// exact error body (CORS is already enabled for this origin — that's why we
// were able to read the E0000015 body above).
if (typeof window !== "undefined") {
  (window as unknown as { __debugOktaAuthorize?: () => Promise<void> }).__debugOktaAuthorize =
    async () => {
      const discoveryUrl = `${rawIssuer}/.well-known/openid-configuration`;
      console.info("[OKTA debug] fetching discovery:", discoveryUrl);
      const meta = await fetch(discoveryUrl).then((r) => r.json());
      const authorizeEndpoint: string = meta.authorization_endpoint;
      console.info("[OKTA debug] authorization_endpoint:", authorizeEndpoint);

      const params = new URLSearchParams({
        client_id: clientId,
        response_type: "code",
        scope: "openid profile email",
        redirect_uri: `${origin}/login/callback`,
        state: "debug-state",
        nonce: "debug-nonce",
        // A valid sample S256 challenge so PKCE validation passes; a 400 here
        // therefore points at client_id / redirect_uri / app assignment.
        code_challenge: "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM",
        code_challenge_method: "S256",
      });
      const url = `${authorizeEndpoint}?${params.toString()}`;
      console.info("[OKTA debug] probing authorize URL:", url);

      const res = await fetch(url, { redirect: "manual" });
      console.info(
        "[OKTA debug] response:",
        res.status,
        res.statusText,
        "type=",
        res.type,
      );
      if (res.type === "opaqueredirect") {
        console.info(
          "[OKTA debug] ✅ authorize accepted the request (it issued a redirect). " +
            "Params/client/redirect_uri are valid; any failure is later in the flow.",
        );
        return;
      }
      const body = await res.text().catch(() => "");
      console.error("[OKTA debug] ❌ authorize error body:", body);
    };
  console.info(
    "[OKTA] Run  await window.__debugOktaAuthorize()  in the console to print the exact /authorize error.",
  );
}
// -------------------------------------------------------------------------

export const oktaAuth = new OktaAuth(oktaAuthOptions);

// --- Stale-build / client_id sanity check --------------------------------
// Vite bakes VITE_* vars into the bundle at dev-server START. If you edit
// .env but only hot-reload (instead of fully restarting `npm run dev`), the
// OLD client_id stays compiled in — which is exactly how the /authorize URL
// can show a client_id that no longer matches .env.
//
// We read the value straight off the constructed OktaAuth instance
// (oktaAuth.options.clientId) — this is the EXACT client_id that will be put
// into the real /authorize request. Compare the log below against your .env.
if (typeof window !== "undefined") {
  const liveClientId =
    (oktaAuth.options as { clientId?: string }).clientId ?? "(unset)";
  const liveRedirectUri =
    (oktaAuth.options as { redirectUri?: string }).redirectUri ?? "(unset)";

  console.info(
    "%c[OKTA] BUNDLE IS SENDING → client_id=%s  redirect_uri=%s",
    "font-weight:bold;color:#0a7",
    liveClientId,
    liveRedirectUri,
  );
  console.info(
    "[OKTA] Compare client_id above with VITE_OKTA_CLIENT_ID in .env. " +
      "If they differ, the dev server is serving a STALE build — fully stop " +
      "and restart `npm run dev` (HMR does not re-read .env).",
  );

  // The failing /authorize URL used this id; it is NOT in the source, so if
  // we see it here the running bundle is definitively stale.
  const KNOWN_STALE_CLIENT_ID = "0oa26wej3p4cdssJe0h8";
  if (liveClientId === KNOWN_STALE_CLIENT_ID) {
    console.error(
      "[OKTA] ⛔ STALE BUILD CONFIRMED: bundle compiled the old client_id " +
        `${KNOWN_STALE_CLIENT_ID}. Stop the dev server (Ctrl+C) and run ` +
        "`npm run dev` again, then hard-reload the browser (Cmd+Shift+R).",
    );
  }

  // A previously-started sign-in can leave a transaction (with the old
  // client_id) in localStorage and get replayed on the next attempt. Clear
  // any stale okta-auth-js transaction so the next sign-in is built fresh.
  try {
    const txn = window.localStorage.getItem("okta-shared-transaction-storage");
    if (txn && !txn.includes(liveClientId)) {
      console.warn(
        "[OKTA] Clearing stale okta transaction in localStorage (client_id mismatch).",
      );
      window.localStorage.removeItem("okta-shared-transaction-storage");
    }
  } catch {
    /* ignore storage access errors */
  }
}
// -------------------------------------------------------------------------
