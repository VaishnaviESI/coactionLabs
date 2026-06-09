-- ============================================================================
-- Migration 001 — Create all tables for the CO/ACTION AI Hub (labs_platform)
-- ----------------------------------------------------------------------------
-- The 11 schemas already exist and are empty. This migration creates every
-- table, derived from the frontend TypeScript data shapes:
--   Agent, UserAgent (catalog.agents) · Video, ExternalCourse (knowledge.*)
--   DailyUsage, AnalyticsEvent (analytics.*) · User (iam.users)
--   ToolboxItem (integration.toolbox_items) · PolicyItem (governance.policies)
--   votes/bookmarks (engagement.*) · certifications (governance.*)
--
-- Conventions: uuid PKs (gen_random_uuid), timestamptz timestamps, TEXT over
-- VARCHAR, BOOLEAN flags, FK constraints with ON DELETE rules, CHECK on enums.
-- Idempotent: CREATE TABLE IF NOT EXISTS throughout.
-- ============================================================================

-- gen_random_uuid() lives in core on PG13+, but ensure availability regardless.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

SET search_path TO iam, catalog, runtime, engagement, analytics, governance,
                   knowledge, collaboration, integration, audit, ops;

-- >>> BLOCK: iam --------------------------------------------------------------
-- Identity & access: users (keyed by Okta sub), teams, roles.

CREATE TABLE IF NOT EXISTS iam.teams (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL UNIQUE,
  description text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS iam.users (
  okta_sub      text PRIMARY KEY,
  email         text NOT NULL UNIQUE,
  name          text,
  is_admin      boolean NOT NULL DEFAULT false,
  team_id       uuid REFERENCES iam.teams(id) ON DELETE SET NULL,
  last_login_at timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS iam.roles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL UNIQUE,
  description text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_iam_users_team_id    ON iam.users(team_id);
CREATE INDEX IF NOT EXISTS idx_iam_users_is_admin   ON iam.users(is_admin);
CREATE INDEX IF NOT EXISTS idx_iam_users_created_at ON iam.users(created_at);

-- >>> BLOCK: catalog ----------------------------------------------------------
-- Agent catalog: agents, free-form tags, and categories.

CREATE TABLE IF NOT EXISTS catalog.categories (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS catalog.agents (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  description text,
  status      text NOT NULL DEFAULT 'uncertified'
                CHECK (status IN ('certified', 'uncertified', 'pending')),
  owner_sub   text REFERENCES iam.users(okta_sub) ON DELETE SET NULL,
  team_id     uuid REFERENCES iam.teams(id) ON DELETE SET NULL,
  visibility  text NOT NULL DEFAULT 'private'
                CHECK (visibility IN ('private', 'team', 'org')),
  category    text,
  provider    text CHECK (provider IN ('copilot', 'bedrock')),
  prompt      text,
  author      text,
  version     text NOT NULL DEFAULT '0.0.1',
  is_shared   boolean NOT NULL DEFAULT false,
  usage_count integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS catalog.agent_tags (
  id       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL REFERENCES catalog.agents(id) ON DELETE CASCADE,
  tag      text NOT NULL,
  UNIQUE (agent_id, tag)
);

CREATE INDEX IF NOT EXISTS idx_catalog_agents_owner_sub  ON catalog.agents(owner_sub);
CREATE INDEX IF NOT EXISTS idx_catalog_agents_team_id    ON catalog.agents(team_id);
CREATE INDEX IF NOT EXISTS idx_catalog_agents_status     ON catalog.agents(status);
CREATE INDEX IF NOT EXISTS idx_catalog_agents_visibility ON catalog.agents(visibility);
CREATE INDEX IF NOT EXISTS idx_catalog_agents_created_at ON catalog.agents(created_at);
CREATE INDEX IF NOT EXISTS idx_catalog_agent_tags_agent_id ON catalog.agent_tags(agent_id);

-- >>> BLOCK: runtime ----------------------------------------------------------
-- Execution history: agent runs and their logs.

CREATE TABLE IF NOT EXISTS runtime.agent_runs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id      uuid NOT NULL REFERENCES catalog.agents(id) ON DELETE CASCADE,
  user_sub      text REFERENCES iam.users(okta_sub) ON DELETE SET NULL,
  status        text NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'running', 'succeeded', 'failed')),
  input_tokens  integer NOT NULL DEFAULT 0,
  output_tokens integer NOT NULL DEFAULT 0,
  started_at    timestamptz NOT NULL DEFAULT now(),
  finished_at   timestamptz
);

CREATE TABLE IF NOT EXISTS runtime.run_logs (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id    uuid NOT NULL REFERENCES runtime.agent_runs(id) ON DELETE CASCADE,
  level     text NOT NULL DEFAULT 'info'
              CHECK (level IN ('debug', 'info', 'warn', 'error')),
  message   text NOT NULL,
  logged_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_runtime_agent_runs_agent_id   ON runtime.agent_runs(agent_id);
CREATE INDEX IF NOT EXISTS idx_runtime_agent_runs_user_sub   ON runtime.agent_runs(user_sub);
CREATE INDEX IF NOT EXISTS idx_runtime_agent_runs_status     ON runtime.agent_runs(status);
CREATE INDEX IF NOT EXISTS idx_runtime_agent_runs_started_at ON runtime.agent_runs(started_at);
CREATE INDEX IF NOT EXISTS idx_runtime_run_logs_run_id       ON runtime.run_logs(run_id);

-- >>> BLOCK: engagement -------------------------------------------------------
-- User engagement with agents: ratings (votes), comments, bookmarks.

CREATE TABLE IF NOT EXISTS engagement.ratings (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id   uuid NOT NULL REFERENCES catalog.agents(id) ON DELETE CASCADE,
  user_sub   text REFERENCES iam.users(okta_sub) ON DELETE CASCADE,
  vote       text NOT NULL CHECK (vote IN ('up', 'down')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (agent_id, user_sub)
);

CREATE TABLE IF NOT EXISTS engagement.comments (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id   uuid NOT NULL REFERENCES catalog.agents(id) ON DELETE CASCADE,
  user_sub   text REFERENCES iam.users(okta_sub) ON DELETE SET NULL,
  body       text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS engagement.bookmarks (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id   uuid NOT NULL REFERENCES catalog.agents(id) ON DELETE CASCADE,
  user_sub   text NOT NULL REFERENCES iam.users(okta_sub) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (agent_id, user_sub)
);

CREATE INDEX IF NOT EXISTS idx_engagement_ratings_agent_id   ON engagement.ratings(agent_id);
CREATE INDEX IF NOT EXISTS idx_engagement_comments_agent_id  ON engagement.comments(agent_id);
CREATE INDEX IF NOT EXISTS idx_engagement_bookmarks_agent_id ON engagement.bookmarks(agent_id);
CREATE INDEX IF NOT EXISTS idx_engagement_bookmarks_user_sub ON engagement.bookmarks(user_sub);

-- >>> BLOCK: analytics --------------------------------------------------------
-- Product analytics: events buffer, sessions, and page views.

CREATE TABLE IF NOT EXISTS analytics.sessions (
  id               text PRIMARY KEY,
  user_sub         text REFERENCES iam.users(okta_sub) ON DELETE SET NULL,
  started_at       timestamptz NOT NULL DEFAULT now(),
  last_activity_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS analytics.events (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_sub    text REFERENCES iam.users(okta_sub) ON DELETE SET NULL,
  session_id  text,
  type        text NOT NULL,
  name        text NOT NULL,
  props       jsonb,
  occurred_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS analytics.page_views (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_sub   text REFERENCES iam.users(okta_sub) ON DELETE SET NULL,
  session_id text,
  path       text NOT NULL,
  title      text,
  viewed_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_user_sub    ON analytics.events(user_sub);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id  ON analytics.events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type        ON analytics.events(type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_occurred_at ON analytics.events(occurred_at);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_user_sub  ON analytics.sessions(user_sub);
CREATE INDEX IF NOT EXISTS idx_analytics_page_views_session_id ON analytics.page_views(session_id);

-- >>> BLOCK: governance -------------------------------------------------------
-- Governance: certification queue, review notes, and policies.

CREATE TABLE IF NOT EXISTS governance.certifications (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id     uuid NOT NULL REFERENCES catalog.agents(id) ON DELETE CASCADE,
  submitted_by text REFERENCES iam.users(okta_sub) ON DELETE SET NULL,
  status       text NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending', 'approved', 'rejected')),
  notes        text,
  reviewed_by  text REFERENCES iam.users(okta_sub) ON DELETE SET NULL,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at  timestamptz
);

CREATE TABLE IF NOT EXISTS governance.certification_notes (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  certification_id uuid NOT NULL REFERENCES governance.certifications(id) ON DELETE CASCADE,
  author_sub       text REFERENCES iam.users(okta_sub) ON DELETE SET NULL,
  body             text NOT NULL,
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS governance.policies (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title      text NOT NULL,
  body       text,
  category   text,
  pdf_url    text,
  pdf_page   integer,
  created_by text REFERENCES iam.users(okta_sub) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_governance_certifications_agent_id  ON governance.certifications(agent_id);
CREATE INDEX IF NOT EXISTS idx_governance_certifications_status    ON governance.certifications(status);
CREATE INDEX IF NOT EXISTS idx_governance_certifications_submitted_at ON governance.certifications(submitted_at);
CREATE INDEX IF NOT EXISTS idx_governance_cert_notes_cert_id       ON governance.certification_notes(certification_id);
CREATE INDEX IF NOT EXISTS idx_governance_policies_category        ON governance.policies(category);

-- >>> BLOCK: knowledge --------------------------------------------------------
-- Learning content: unified courses (video/external), plus videos & resources.

CREATE TABLE IF NOT EXISTS knowledge.courses (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  description text,
  type        text NOT NULL CHECK (type IN ('video', 'external')),
  duration    text,
  thumbnail   text,
  category    text,
  level       text CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  url         text,
  provider    text,
  video_path  text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS knowledge.videos (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  description text,
  duration    text,
  thumbnail   text,
  category    text,
  level       text CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  video_path  text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS knowledge.resources (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  description text,
  url         text NOT NULL,
  provider    text,
  level       text CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  thumbnail   text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_knowledge_courses_type     ON knowledge.courses(type);
CREATE INDEX IF NOT EXISTS idx_knowledge_courses_category ON knowledge.courses(category);
CREATE INDEX IF NOT EXISTS idx_knowledge_videos_category  ON knowledge.videos(category);

-- >>> BLOCK: collaboration ----------------------------------------------------
-- Sharing: team-owned agents and per-user shares.

CREATE TABLE IF NOT EXISTS collaboration.team_agents (
  id       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id  uuid NOT NULL REFERENCES iam.teams(id) ON DELETE CASCADE,
  agent_id uuid NOT NULL REFERENCES catalog.agents(id) ON DELETE CASCADE,
  added_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (team_id, agent_id)
);

CREATE TABLE IF NOT EXISTS collaboration.shared_agents (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id        uuid NOT NULL REFERENCES catalog.agents(id) ON DELETE CASCADE,
  shared_with_sub text NOT NULL REFERENCES iam.users(okta_sub) ON DELETE CASCADE,
  shared_by_sub   text REFERENCES iam.users(okta_sub) ON DELETE SET NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (agent_id, shared_with_sub)
);

CREATE INDEX IF NOT EXISTS idx_collab_team_agents_team_id    ON collaboration.team_agents(team_id);
CREATE INDEX IF NOT EXISTS idx_collab_team_agents_agent_id   ON collaboration.team_agents(agent_id);
CREATE INDEX IF NOT EXISTS idx_collab_shared_agents_agent_id ON collaboration.shared_agents(agent_id);
CREATE INDEX IF NOT EXISTS idx_collab_shared_agents_with_sub ON collaboration.shared_agents(shared_with_sub);

-- >>> BLOCK: integration ------------------------------------------------------
-- External tooling: approved tools and the toolbox catalogue.

CREATE TABLE IF NOT EXISTS integration.external_tools (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  description text,
  provider    text,
  url         text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS integration.toolbox_items (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sort_order  integer NOT NULL DEFAULT 0,
  name        text NOT NULL,
  type        text NOT NULL DEFAULT 'Tool'
                CHECK (type IN ('Tool', 'System', 'Technology')),
  description text,
  gov_status  text NOT NULL DEFAULT 'in progress'
                CHECK (gov_status IN ('approved', 'in progress')),
  audience    text,
  launch_url  text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_integration_toolbox_items_type       ON integration.toolbox_items(type);
CREATE INDEX IF NOT EXISTS idx_integration_toolbox_items_gov_status ON integration.toolbox_items(gov_status);
CREATE INDEX IF NOT EXISTS idx_integration_toolbox_items_sort_order ON integration.toolbox_items(sort_order);

-- >>> BLOCK: audit ------------------------------------------------------------
-- Audit trail: action logs and before/after change history.

CREATE TABLE IF NOT EXISTS audit.audit_logs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_sub   text REFERENCES iam.users(okta_sub) ON DELETE SET NULL,
  action      text NOT NULL,
  entity_type text,
  entity_id   text,
  metadata    jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit.change_history (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type  text NOT NULL,
  entity_id    text NOT NULL,
  changed_by   text REFERENCES iam.users(okta_sub) ON DELETE SET NULL,
  before_state jsonb,
  after_state  jsonb,
  changed_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_audit_logs_actor_sub   ON audit.audit_logs(actor_sub);
CREATE INDEX IF NOT EXISTS idx_audit_audit_logs_entity      ON audit.audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_audit_logs_created_at  ON audit.audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_change_history_entity  ON audit.change_history(entity_type, entity_id);

-- >>> BLOCK: ops --------------------------------------------------------------
-- Operations: health check history and deploy logs.

CREATE TABLE IF NOT EXISTS ops.health_checks (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service    text NOT NULL,
  status     text NOT NULL DEFAULT 'ok'
               CHECK (status IN ('ok', 'degraded', 'down')),
  detail     text,
  checked_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ops.deploy_logs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  environment text,
  version     text,
  status      text,
  notes       text,
  deployed_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ops_health_checks_service    ON ops.health_checks(service);
CREATE INDEX IF NOT EXISTS idx_ops_health_checks_checked_at ON ops.health_checks(checked_at);
CREATE INDEX IF NOT EXISTS idx_ops_deploy_logs_deployed_at  ON ops.deploy_logs(deployed_at);

-- ============================================================================
-- SUMMARY — tables created (28 across 11 schemas):
--   iam           : teams, users, roles
--   catalog       : categories, agents, agent_tags
--   runtime       : agent_runs, run_logs
--   engagement    : ratings, comments, bookmarks
--   analytics     : sessions, events, page_views
--   governance    : certifications, certification_notes, policies
--   knowledge     : courses, videos, resources
--   collaboration : team_agents, shared_agents
--   integration   : external_tools, toolbox_items
--   audit         : audit_logs, change_history
--   ops           : health_checks, deploy_logs
-- ============================================================================
