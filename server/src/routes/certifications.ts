import { Router } from "express";
import { query } from "../db.js";
import { SCHEMAS } from "../constants/schemas.js";
import { requireAdmin } from "../middleware/roles.js";

export const certificationsRouter = Router();

// GET /api/certifications → review queue (admin only).
certificationsRouter.get("/", requireAdmin, async (_req, res) => {
  const result = await query(
    `SELECT * FROM ${SCHEMAS.governance}.certifications ORDER BY submitted_at DESC`,
  );
  res.json({ certifications: result.rows });
});

// POST /api/certifications → submit an agent for review (any authenticated user).
certificationsRouter.post("/", async (req, res) => {
  const { agentId, notes } = req.body ?? {};
  if (typeof agentId !== "string" || !agentId.trim()) {
    res.status(400).json({ error: "agentId is required" });
    return;
  }

  const result = await query(
    `INSERT INTO ${SCHEMAS.governance}.certifications
       (agent_id, submitted_by, notes, status, submitted_at)
     VALUES ($1, $2, $3, 'pending', NOW())
     RETURNING *`,
    [agentId.trim(), req.user!.sub, typeof notes === "string" ? notes : null],
  );
  res.status(201).json({ certification: result.rows[0] });
});

const VALID_STATUSES = new Set(["pending", "approved", "rejected"]);

// PUT /api/certifications/:id → update review status (admin only).
certificationsRouter.put("/:id", requireAdmin, async (req, res) => {
  const { status, notes } = req.body ?? {};
  if (typeof status !== "string" || !VALID_STATUSES.has(status)) {
    res.status(400).json({ error: "status must be one of pending, approved, rejected" });
    return;
  }

  const result = await query(
    `UPDATE ${SCHEMAS.governance}.certifications
        SET status = $2,
            notes = COALESCE($3, notes),
            reviewed_by = $4,
            reviewed_at = NOW()
      WHERE id = $1
      RETURNING *`,
    [req.params.id, status, typeof notes === "string" ? notes : null, req.user!.sub],
  );
  if (result.rowCount === 0) {
    res.status(404).json({ error: "Certification not found" });
    return;
  }
  res.json({ certification: result.rows[0] });
});
