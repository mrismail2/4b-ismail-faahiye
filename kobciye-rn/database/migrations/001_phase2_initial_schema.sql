-- =============================================================
-- Kobciye Migration 001 — Phase 2 Initial Schema
-- This file is the single-file migration equivalent of running:
--   schema.sql → functions.sql → policies.sql → seed.sql
-- in order. Use this file when applying via a migration tool
-- (e.g. supabase db push, flyway, liquibase).
-- =============================================================

-- ---- schema ----
\ir ../schema.sql

-- ---- functions ----
\ir ../functions.sql

-- ---- policies ----
\ir ../policies.sql

-- ---- seed ----
\ir ../seed.sql
