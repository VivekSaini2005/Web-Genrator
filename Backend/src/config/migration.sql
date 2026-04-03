-- ============================================================
-- MIGRATION: Add generations table
-- AI SaaS Web Generator — pgAdmin 4 / PostgreSQL 14+
--
-- ✅ SAFE TO RUN on existing database
-- ✅ Will NOT affect your existing users or sessions tables
-- ✅ IF NOT EXISTS means it won't fail if already created
-- ============================================================


-- ──────────────────────────────────────────────────────────
-- STEP 1: Add the generations table
-- Stores every AI generation (prompt + output code).
-- user_id is NULLABLE so guests (not logged in) can also save.
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS generations (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID         REFERENCES users (id) ON DELETE SET NULL,
  prompt       TEXT         NOT NULL,
  current_code TEXT,
  output_code  TEXT         NOT NULL,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);


-- ──────────────────────────────────────────────────────────
-- STEP 2: Add index on user_id for fast history lookups
-- ──────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_generations_user_id ON generations (user_id);


-- ──────────────────────────────────────────────────────────
-- DONE ✅
-- Your database now has 3 tables:
--   users       → registered users
--   sessions    → refresh tokens (login sessions)
--   generations → AI-generated HTML (linked to user or guest)
-- ──────────────────────────────────────────────────────────
