// Single API client for the CO/ACTION AI Hub frontend.
//
// All network calls to the backend go through here — never inline `fetch` in
// components. The base URL is `/api`, which IIS proxies to the Express server
// (localhost:5100) in deployed environments and Vite proxies in dev.
//
// Every request automatically attaches the bearer token persisted by
// AuthContext under the `auth_token` localStorage key.

const BASE_URL = "/api";
const TOKEN_KEY = "auth_token";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const authHeaders = (): Record<string, string> => {
  const token =
    typeof window !== "undefined" ? window.localStorage.getItem(TOKEN_KEY) : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const headers: Record<string, string> = { ...authHeaders() };
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // 204 No Content (e.g. DELETE) — nothing to parse.
  if (res.status === 204) {
    return undefined as T;
  }

  const text = await res.text();
  const parsed = text ? safeJsonParse(text) : undefined;

  if (!res.ok) {
    const message =
      (parsed as { error?: string })?.error ?? `Request failed (${res.status})`;
    throw new ApiError(res.status, message, parsed);
  }

  return parsed as T;
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export const api = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
  put: <T>(path: string, body?: unknown) => request<T>("PUT", path, body),
  delete: <T>(path: string) => request<T>("DELETE", path),
};
