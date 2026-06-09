// Central registry of Postgres schema names.
//
// Routes and the db layer must import schema identifiers from here rather than
// hardcoding strings. Renaming a schema then touches exactly one file.
export const SCHEMAS = {
  iam: "iam",
  catalog: "catalog",
  runtime: "runtime",
  engagement: "engagement",
  analytics: "analytics",
  governance: "governance",
  knowledge: "knowledge",
  collaboration: "collaboration",
  integration: "integration",
  audit: "audit",
  ops: "ops",
} as const;

export type SchemaKey = keyof typeof SCHEMAS;

// Order used for the connection-level search_path. The first schema is the
// default target for unqualified writes; the rest are resolved in order.
export const SEARCH_PATH_ORDER: SchemaKey[] = [
  "iam",
  "catalog",
  "runtime",
  "engagement",
  "analytics",
  "governance",
  "knowledge",
  "collaboration",
  "integration",
  "audit",
  "ops",
];
