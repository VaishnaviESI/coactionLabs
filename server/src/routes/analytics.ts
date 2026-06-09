import { Router } from "express";
import { query, transaction } from "../db.js";
import { SCHEMAS } from "../constants/schemas.js";
import { requireAdmin } from "../middleware/roles.js";

export const analyticsRouter = Router();

interface IncomingEvent {
  type?: string;
  name?: string;
  props?: unknown;
  sessionId?: string;
  ts?: string;
}

const MAX_BATCH = 500;

// POST /api/analytics/events → ingest a batch from the frontend buffer.
analyticsRouter.post("/events", async (req, res) => {
  const events = req.body?.events;
  if (!Array.isArray(events)) {
    res.status(400).json({ error: "events must be an array" });
    return;
  }
  if (events.length === 0) {
    res.json({ ingested: 0 });
    return;
  }
  if (events.length > MAX_BATCH) {
    res.status(413).json({ error: `Batch exceeds ${MAX_BATCH} events` });
    return;
  }

  const ingested = await transaction(async (tx) => {
    let count = 0;
    for (const raw of events as IncomingEvent[]) {
      if (!raw || typeof raw.type !== "string" || typeof raw.name !== "string") {
        continue;
      }
      await tx.query(
        `INSERT INTO ${SCHEMAS.analytics}.events
           (user_sub, session_id, type, name, props, occurred_at)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          req.user!.sub,
          typeof raw.sessionId === "string" ? raw.sessionId : null,
          raw.type,
          raw.name,
          raw.props != null ? JSON.stringify(raw.props) : null,
          typeof raw.ts === "string" ? raw.ts : new Date().toISOString(),
        ],
      );
      count += 1;
    }
    return count;
  });

  res.status(202).json({ ingested });
});

// GET /api/analytics/summary → aggregated stats (admin only).
analyticsRouter.get("/summary", requireAdmin, async (_req, res) => {
  const byType = await query(
    `SELECT type, COUNT(*)::int AS count
       FROM ${SCHEMAS.analytics}.events
      GROUP BY type
      ORDER BY count DESC`,
  );
  const topPages = await query(
    `SELECT name AS path, COUNT(*)::int AS views
       FROM ${SCHEMAS.analytics}.events
      WHERE type = 'page_view'
      GROUP BY name
      ORDER BY views DESC
      LIMIT 10`,
  );
  const totals = await query<{ total: number; users: number; sessions: number }>(
    `SELECT COUNT(*)::int AS total,
            COUNT(DISTINCT user_sub)::int AS users,
            COUNT(DISTINCT session_id)::int AS sessions
       FROM ${SCHEMAS.analytics}.events`,
  );

  res.json({
    totals: totals.rows[0] ?? { total: 0, users: 0, sessions: 0 },
    byType: byType.rows,
    topPages: topPages.rows,
  });
});
