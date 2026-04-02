-- ============================================================
-- AI SaaS Web Generator — PostgreSQL Database Schema
-- Compatible with: pgAdmin 4 / PostgreSQL 14+
-- Run this file once to set up your full database schema.
-- ============================================================

-- Enable UUID generation (required for gen_random_uuid())
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ============================================================
-- TABLE: users
-- Stores all registered users (local + Google OAuth)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100)  NOT NULL,
  email       VARCHAR(255)  NOT NULL UNIQUE,
  password    TEXT,                         -- NULL for Google OAuth users
  avatar_url  TEXT,
  provider    VARCHAR(20)   NOT NULL DEFAULT 'local' CHECK (provider IN ('local', 'google')),
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Index: speed up login lookups by email
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);


-- ============================================================
-- TABLE: sessions
-- Stores refresh tokens for JWT auth (one session per login)
-- ============================================================
CREATE TABLE IF NOT EXISTS sessions (
  id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID         NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  refresh_token  TEXT         NOT NULL UNIQUE,
  expires_at     TIMESTAMPTZ  NOT NULL,
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Index: fast session lookup by user
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions (user_id);

-- Index: fast token validation during refresh
CREATE INDEX IF NOT EXISTS idx_sessions_refresh_token ON sessions (refresh_token);


-- ============================================================
-- TABLE: projects
-- Each user can have multiple saved projects
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID          NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  title       VARCHAR(255)  NOT NULL DEFAULT 'Untitled Project',
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Index: fetch all projects for a user quickly
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects (user_id);


-- ============================================================
-- TABLE: prompts
-- Each project holds multiple prompts (chat history)
-- ============================================================
CREATE TABLE IF NOT EXISTS prompts (
  id          UUID   PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID   NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
  content     TEXT   NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index: fetch all prompts for a given project
CREATE INDEX IF NOT EXISTS idx_prompts_project_id ON prompts (project_id);


-- ============================================================
-- TABLE: generations
-- Stores AI-generated HTML output for each prompt
-- ============================================================
CREATE TABLE IF NOT EXISTS generations (
  id           UUID   PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id    UUID   NOT NULL REFERENCES prompts (id) ON DELETE CASCADE,
  output_code  TEXT   NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index: fetch generation for a specific prompt
CREATE INDEX IF NOT EXISTS idx_generations_prompt_id ON generations (prompt_id);


-- ============================================================
-- SUMMARY
-- Tables  : users, sessions, projects, prompts, generations
-- Cascade : user → sessions, projects → prompts → generations
-- Indexes : email, user_id (sessions, projects), project_id, prompt_id
-- ============================================================
