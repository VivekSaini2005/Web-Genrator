-- ============================================================
-- AI Web Generator — Full Database Schema
-- pgAdmin 4 / PostgreSQL 14+
-- ============================================================
-- Tables:
--   1. users       → registered accounts (local + Google OAuth)
--   2. sessions    → refresh tokens for JWT auth
-- ============================================================


-- Enable UUID support (needed for gen_random_uuid())
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ============================================================
-- TABLE 1: users
-- ============================================================
-- Stores everyone who registers or logs in via Google.
-- password is NULL for Google OAuth users (they have no password).
-- provider tells us how the account was created: 'local' or 'google'
-- ============================================================

CREATE TABLE users (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100)  NOT NULL,
  email       VARCHAR(255)  NOT NULL UNIQUE,
  password    TEXT,
  avatar_url  TEXT,
  provider    VARCHAR(20)   NOT NULL DEFAULT 'local'
                            CHECK (provider IN ('local', 'google')),
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Makes login lookups fast (we search by email every login)
CREATE INDEX idx_users_email ON users (email);


-- ============================================================
-- TABLE 2: sessions
-- ============================================================
-- Stores JWT refresh tokens so users stay logged in.
-- One row = one active login session.
-- When a user logs out, their row is deleted from here.
-- If a user is deleted, all their sessions are auto-deleted (CASCADE).
-- ============================================================

CREATE TABLE sessions (
  id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID         NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  refresh_token  TEXT         NOT NULL UNIQUE,
  expires_at     TIMESTAMPTZ  NOT NULL,
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Makes "find session by user" fast
CREATE INDEX idx_sessions_user_id ON sessions (user_id);

-- Makes "validate refresh token" fast
CREATE INDEX idx_sessions_refresh_token ON sessions (refresh_token);


-- ============================================================
-- DONE ✅
-- Run this entire file once in pgAdmin Query Tool (F5)
-- ============================================================
