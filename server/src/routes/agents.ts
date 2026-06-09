import { Router } from "express";
import { query } from "../db.js";
import { SCHEMAS } from "../constants/schemas.js";

export const agentsRouter = Router();

// GET /api/agents → list agents; optional filters: visibility, team, owner.
agentsRouter.get("/", async (req, res) => {
  const { visibility, team, owner } = req.query;

  const conditions: string[] = [];
  const params: unknown[] = [];

  if (typeof visibility === "string") {
    params.push(visibility);
    conditions.push(`visibility = $${params.length}`);
  }
  if (typeof team === "string") {
    params.push(team);
    conditions.push(`team_id = $${params.length}`);
  }
  if (typeof owner === "string") {
    params.push(owner);
    conditions.push(`owner_sub = $${params.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const result = await query(
    `SELECT * FROM ${SCHEMAS.catalog}.agents ${where} ORDER BY updated_at DESC`,
    params,
  );
  res.json({ agents: result.rows });
});

// POST /api/agents → create an agent owned by the caller.
agentsRouter.post("/", async (req, res) => {
  const { name, description, visibility, teamId } = req.body ?? {};
  if (typeof name !== "string" || !name.trim()) {
    res.status(400).json({ error: "name is required" });
    return;
  }

  const result = await query(
    `INSERT INTO ${SCHEMAS.catalog}.agents
       (name, description, visibility, team_id, owner_sub, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
     RETURNING *`,
    [
      name.trim(),
      typeof description === "string" ? description : null,
      typeof visibility === "string" ? visibility : "private",
      typeof teamId === "string" ? teamId : null,
      req.user!.sub,
    ],
  );
  res.status(201).json({ agent: result.rows[0] });
});

/** Fetch the owner_sub for an agent, or null if it does not exist. */
async function getAgentOwner(id: string): Promise<string | null> {
  const result = await query<{ owner_sub: string }>(
    `SELECT owner_sub FROM ${SCHEMAS.catalog}.agents WHERE id = $1 LIMIT 1`,
    [id],
  );
  return result.rows[0]?.owner_sub ?? null;
}

// PUT /api/agents/:id → update (owner or admin only).
agentsRouter.put("/:id", async (req, res) => {
  const owner = await getAgentOwner(req.params.id);
  if (owner === null) {
    res.status(404).json({ error: "Agent not found" });
    return;
  }
  if (owner !== req.user!.sub && !req.user!.isAdmin) {
    res.status(403).json({ error: "Only the owner or an admin can update this agent" });
    return;
  }

  const { name, description, visibility, teamId } = req.body ?? {};
  const result = await query(
    `UPDATE ${SCHEMAS.catalog}.agents
        SET name = COALESCE($2, name),
            description = COALESCE($3, description),
            visibility = COALESCE($4, visibility),
            team_id = COALESCE($5, team_id),
            updated_at = NOW()
      WHERE id = $1
      RETURNING *`,
    [
      req.params.id,
      typeof name === "string" ? name : null,
      typeof description === "string" ? description : null,
      typeof visibility === "string" ? visibility : null,
      typeof teamId === "string" ? teamId : null,
    ],
  );
  res.json({ agent: result.rows[0] });
});

// DELETE /api/agents/:id → delete (owner or admin only).
agentsRouter.delete("/:id", async (req, res) => {
  const owner = await getAgentOwner(req.params.id);
  if (owner === null) {
    res.status(404).json({ error: "Agent not found" });
    return;
  }
  if (owner !== req.user!.sub && !req.user!.isAdmin) {
    res.status(403).json({ error: "Only the owner or an admin can delete this agent" });
    return;
  }

  await query(`DELETE FROM ${SCHEMAS.catalog}.agents WHERE id = $1`, [req.params.id]);
  res.status(204).end();
});
