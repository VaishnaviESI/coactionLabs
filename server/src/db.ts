// Single source of truth for database access.
//
// Routes never import `pg` directly — all SQL flows through `query` and
// `transaction` here. Swapping the pool (e.g. to RDS Proxy or a read replica)
// is therefore a change confined to this file.
import pg from "pg";
import { SEARCH_PATH_ORDER, SCHEMAS } from "./constants/schemas.js";

const { Pool } = pg;

const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

// Connection-level search_path built from the central schema registry so no
// schema name is ever hardcoded outside constants/schemas.ts.
const SEARCH_PATH = SEARCH_PATH_ORDER.map((key) => SCHEMAS[key]).join(", ");

const useSsl = (process.env.DB_SSL ?? "true").toLowerCase() === "true";

export const pool = new Pool({
  host: requireEnv("DB_HOST"),
  database: requireEnv("DB_NAME"),
  user: requireEnv("DB_USER"),
  password: requireEnv("DB_PASSWORD"),
  port: Number(process.env.DB_PORT ?? 5432),
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
  ssl: useSsl ? { rejectUnauthorized: true } : undefined,
});

// Apply the search_path to every new physical connection in the pool.
pool.on("connect", (client) => {
  client.query(`SET search_path TO ${SEARCH_PATH}`).catch((err) => {
    console.error("[DB] Failed to set search_path:", err);
  });
});

pool.on("error", (err) => {
  console.error("[DB] Unexpected idle client error:", err);
});

export type QueryParams = ReadonlyArray<unknown>;

/**
 * Run a parameterised query against the pool.
 * Always pass values via `params` — never interpolate into the SQL string.
 */
export async function query<T extends pg.QueryResultRow = pg.QueryResultRow>(
  text: string,
  params?: QueryParams,
): Promise<pg.QueryResult<T>> {
  return pool.query<T>(text, params as unknown[] | undefined);
}

/**
 * Run a set of statements inside a single transaction on one connection.
 * The callback receives a scoped `query` bound to that connection, which is
 * useful for multi-schema writes that must commit or roll back together.
 */
export async function transaction<T>(
  callback: (tx: {
    query: <R extends pg.QueryResultRow = pg.QueryResultRow>(
      text: string,
      params?: QueryParams,
    ) => Promise<pg.QueryResult<R>>;
  }) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await callback({
      query: (text, params) => client.query(text, params as unknown[] | undefined),
    });
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

/** Lightweight connectivity probe used by the health route. */
export async function pingDatabase(): Promise<boolean> {
  try {
    await query("SELECT 1");
    return true;
  } catch (err) {
    console.error("[DB] Ping failed:", err);
    return false;
  }
}

export async function closePool(): Promise<void> {
  await pool.end();
}
