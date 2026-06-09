// Migration runner — applies server/migrations/001_create_all_tables.sql to
// Aurora using the shared db.ts pool (no separate pg connection).
//
// Run via: cd server && npm run build && npm run migrate
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import type { DatabaseError } from "pg";
import { pool, closePool } from "./db.js";
import { SEARCH_PATH_ORDER, SCHEMAS } from "./constants/schemas.js";

const here = dirname(fileURLToPath(import.meta.url));
// dist/migrate.js → ../migrations/001_create_all_tables.sql
const MIGRATION_FILE = join(here, "..", "migrations", "001_create_all_tables.sql");
const BLOCK_MARKER = "-- >>> BLOCK:";

interface SqlBlock {
  name: string;
  body: string;
}

/** Split the SQL file into a preamble + labelled schema blocks for logging. */
function parseBlocks(sql: string): { preamble: string; blocks: SqlBlock[] } {
  const segments = sql.split(BLOCK_MARKER);
  const preamble = segments[0];
  const blocks = segments.slice(1).map((seg) => {
    const firstNewline = seg.indexOf("\n");
    const headerLine = seg.slice(0, firstNewline);
    const name = headerLine.replace(/-/g, "").trim();
    const body = seg.slice(firstNewline + 1);
    return { name, body };
  });
  return { preamble, blocks };
}

async function countTables(): Promise<number> {
  const schemaNames = SEARCH_PATH_ORDER.map((key) => SCHEMAS[key]);
  const result = await pool.query<{ n: number }>(
    `SELECT count(*)::int AS n
       FROM information_schema.tables
      WHERE table_type = 'BASE TABLE'
        AND table_schema = ANY($1)`,
    [schemaNames],
  );
  return result.rows[0]?.n ?? 0;
}

async function run(): Promise<void> {
  console.log(`[MIGRATE] Reading ${MIGRATION_FILE}`);
  const sql = await readFile(MIGRATION_FILE, "utf8");
  const { preamble, blocks } = parseBlocks(sql);

  const client = await pool.connect();
  let currentBlock = "preamble (extensions + search_path)";
  try {
    await client.query("BEGIN");

    if (preamble.trim()) {
      console.log(`[MIGRATE] Running ${currentBlock}`);
      await client.query(preamble);
    }

    for (const block of blocks) {
      currentBlock = block.name;
      process.stdout.write(`[MIGRATE]   → schema "${block.name}" ... `);
      await client.query(block.body);
      console.log("ok");
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    const dbErr = err as DatabaseError;
    console.error("\n[MIGRATE] FAILED in block:", currentBlock);
    console.error("[MIGRATE] Error:", dbErr.message);
    if (dbErr.detail) console.error("[MIGRATE] Detail:", dbErr.detail);
    if (dbErr.hint) console.error("[MIGRATE] Hint:", dbErr.hint);
    if (dbErr.position) console.error("[MIGRATE] Position:", dbErr.position);
    throw err;
  } finally {
    client.release();
  }

  const tableCount = await countTables();
  console.log(`\n[MIGRATE] Migration complete — ${tableCount} tables created`);
}

run()
  .then(() => closePool())
  .then(() => process.exit(0))
  .catch(async (err) => {
    const e = err as NodeJS.ErrnoException;
    console.error("\n[MIGRATE] Aborted:", e.code ?? "", e.message);
    await closePool().catch(() => undefined);
    process.exit(1);
  });
