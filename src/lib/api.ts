// API client for the CO/ACTION AI Hub frontend.
//
// BACKEND DISABLED: this deployment is a standalone, frontend-only SPA served
// as static files. There is NO Express `/api` backend to talk to, so this
// client makes no network requests and reads no bearer token — all page data
// comes from the bundled sample data under `src/data/`. The methods are kept
// as fail-fast stubs so any future caller gets a clear error instead of
// silently hitting a backend that isn't there.

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

const BACKEND_DISABLED_MESSAGE =
  "Backend API is disabled in this frontend-only build (no /api backend).";

const rejectDisabled = <T>(): Promise<T> =>
  Promise.reject(new ApiError(0, BACKEND_DISABLED_MESSAGE));

export const api = {
  get: <T>(_path: string) => rejectDisabled<T>(),
  post: <T>(_path: string, _body?: unknown) => rejectDisabled<T>(),
  put: <T>(_path: string, _body?: unknown) => rejectDisabled<T>(),
  delete: <T>(_path: string) => rejectDisabled<T>(),
};
