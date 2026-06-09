import { Router } from "express";
import { query } from "../db.js";
import { SCHEMAS } from "../constants/schemas.js";
import { requireAdmin } from "../middleware/roles.js";

export const policiesRouter = Router();

// GET /api/policies → list all policies (any authenticated user).
policiesRouter.get("/", async (_req, res) => {
  const result = await query(
    `SELECT * FROM ${SCHEMAS.governance}.policies ORDER BY updated_at DESC`,
  );
  res.json({ policies: result.rows });
});

// POST /api/policies → create a policy (admin only).
policiesRouter.post("/", requireAdmin, async (req, res) => {
  const { title, body, category } = req.body ?? {};
  if (typeof title !== "string" || !title.trim()) {
    res.status(400).json({ error: "title is required" });
    return;
  }

  const result = await query(
    `INSERT INTO ${SCHEMAS.governance}.policies
       (title, body, category, created_by, created_at, updated_at)
     VALUES ($1, $2, $3, $4, NOW(), NOW())
     RETURNING *`,
    [
      title.trim(),
      typeof body === "string" ? body : null,
      typeof category === "string" ? category : null,
      req.user!.sub,
    ],
  );
  res.status(201).json({ policy: result.rows[0] });
});
