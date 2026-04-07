-- ============================================================
-- AI Web Generator — Remove Generations Schema
-- ============================================================

-- 1. Remove the index related to generations
DROP INDEX IF EXISTS idx_generations_user_id;

-- 2. Delete the generations table and any existing dependencies
DROP TABLE IF EXISTS generations CASCADE;

-- ============================================================
-- NOTE: We used CASCADE just to be safe, ensuring any potential
-- views or related objects dependent on this table drop as well.
-- No other tables (users, sessions, chats, messages) are modified.
-- ============================================================