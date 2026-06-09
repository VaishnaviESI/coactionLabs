import { Router } from "express";
import { query } from "../db.js";
import { SCHEMAS } from "../constants/schemas.js";

export const toolboxRouter = Router();

// GET /api/toolbox/tools → list toolbox items.
toolboxRouter.get("/tools", async (_req, res) => {
  const result = await query(
    `SELECT * FROM ${SCHEMAS.integration}.toolbox_items ORDER BY sort_order ASC, name ASC`,
  );
  res.json({ tools: result.rows });
});
