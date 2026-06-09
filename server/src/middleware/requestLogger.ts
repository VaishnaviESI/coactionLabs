import type { Request, Response, NextFunction } from "express";

/**
 * Minimal structured request logger. Emits a `[REQ]` line per response with
 * method, path, status, and duration — matching the log marker the deployment
 * health/troubleshooting tooling greps for.
 */
export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
    console.info(
      `[REQ] ${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs.toFixed(1)}ms`,
    );
  });

  next();
}
