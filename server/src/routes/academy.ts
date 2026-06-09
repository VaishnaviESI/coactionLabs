import { Router } from "express";
import { query } from "../db.js";
import { SCHEMAS } from "../constants/schemas.js";

export const academyRouter = Router();

// GET /api/academy/courses → list courses.
academyRouter.get("/courses", async (_req, res) => {
  const result = await query(
    `SELECT * FROM ${SCHEMAS.knowledge}.courses ORDER BY title ASC`,
  );
  res.json({ courses: result.rows });
});
