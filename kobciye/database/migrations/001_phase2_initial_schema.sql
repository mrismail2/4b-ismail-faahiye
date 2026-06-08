-- =====================================================================
-- Kobciye — Migration 001: Phase 2 initial schema
-- =====================================================================
-- This migration captures the full Phase 2 database foundation in one
-- file for environments that apply migrations sequentially (e.g. the
-- Supabase CLI's `supabase migration up` / `db push` workflow).
--
-- It is composed of the same three building blocks documented and
-- maintained individually under database/:
--   1. schema.sql    — tables, constraints, indexes
--   2. functions.sql — helper functions, triggers, handle_new_user()
--   3. policies.sql  — Row Level Security policies
--
-- For a fresh Supabase project you may either:
--   (a) run schema.sql -> functions.sql -> policies.sql -> seed.sql
--       directly in the SQL editor (recommended for first setup), or
--   (b) apply this single migration file via the Supabase CLI, then
--       run seed.sql separately for demo data.
--
-- This migration is purely additive — it uses `create table if not
-- exists`, `create or replace function`, and `drop policy if exists`
-- before each `create policy`, so it is safe to re-run and never drops
-- or resets existing data.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Step 1 of 3: schema
-- ---------------------------------------------------------------------
\i ../schema.sql

-- ---------------------------------------------------------------------
-- Step 2 of 3: functions & triggers
-- ---------------------------------------------------------------------
\i ../functions.sql

-- ---------------------------------------------------------------------
-- Step 3 of 3: Row Level Security policies
-- ---------------------------------------------------------------------
\i ../policies.sql

-- =====================================================================
-- NOTE: \i directives only work when run via psql with relative paths
-- resolved from this file's location. If your migration runner does
-- not support \i (e.g. it executes this file's contents verbatim
-- through an HTTP API), instead run the three files directly in this
-- order from the Supabase SQL editor:
--
--   1. database/schema.sql
--   2. database/functions.sql
--   3. database/policies.sql
--   4. database/seed.sql   (optional demo data)
--
-- Both paths produce an identical result — this file exists only to
-- give CLI-based migration workflows a single entry point.
-- =====================================================================
