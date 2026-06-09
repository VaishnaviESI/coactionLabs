import express from "express";
import cors from "cors";
import helmet from "helmet";

import { requestLogger } from "./middleware/requestLogger.js";
import { jwtVerify } from "./middleware/auth.js";
import { closePool } from "./db.js";

import { healthRouter } from "./routes/health.js";
import { authRouter } from "./routes/auth.js";
import { agentsRouter } from "./routes/agents.js";
import { certificationsRouter } from "./routes/certifications.js";
import { policiesRouter } from "./routes/policies.js";
import { analyticsRouter } from "./routes/analytics.js";
import { academyRouter } from "./routes/academy.js";
import { toolboxRouter } from "./routes/toolbox.js";

// Internal-only port. Matches the IIS reverse-proxy rewrite rule and should
// only change if IIS is reconfigured too — hence it is not a required env var.
const PORT = process.env.API_PORT ?? 5100;

const app = express();
app.disable("x-powered-by");

// Middleware stack: cors → helmet → json → requestLogger → (jwtVerify) → router
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(requestLogger);

// Public routes (no token): PM2 health probe + pre-login Okta endpoints.
// The auth router applies jwtVerify itself on /auth/me only.
app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);

// Everything below requires a valid bearer token.
app.use("/api", jwtVerify);
app.use("/api/agents", agentsRouter);
app.use("/api/certifications", certificationsRouter);
app.use("/api/policies", policiesRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/academy", academyRouter);
app.use("/api/toolbox", toolboxRouter);

// 404 for unmatched API routes.
app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Centralised error handler.
app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: express.NextFunction,
  ) => {
    console.error("[ERR]", err);
    res.status(500).json({ error: "Internal server error" });
  },
);

const server = app.listen(PORT, () => {
  console.info(`[BOOT] coaction-labs-hub API listening on port ${PORT}`);
});

const shutdown = (signal: string) => {
  console.info(`[SHUTDOWN] received ${signal}, closing server`);
  server.close(() => {
    closePool().finally(() => process.exit(0));
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

export { app };
