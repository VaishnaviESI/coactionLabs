import { Router } from "express";
import { pingDatabase } from "../db.js";

export const healthRouter = Router();

// GET /api/health → used by the PM2 / deployment health probe.
healthRouter.get("/", async (_req, res) => {
  const dbOk = await pingDatabase();
  res.status(dbOk ? 200 : 503).json({
    status: dbOk ? "ok" : "degraded",
    db: dbOk ? "up" : "down",
    ts: new Date().toISOString(),
  });
});
