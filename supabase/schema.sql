-- ============================================================
-- AI Spend Audit — Supabase Database Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- Audits table: stores audit results
CREATE TABLE IF NOT EXISTS audits (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  team_size INTEGER NOT NULL,
  use_case TEXT NOT NULL,
  tools_json JSONB NOT NULL,
  recommendations_json JSONB,
  total_spend DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_savings DECIMAL(10,2) NOT NULL DEFAULT 0,
  ai_summary TEXT
);

-- Leads table: captured leads with optional audit association
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  audit_id TEXT REFERENCES audits(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  company_name TEXT,
  role TEXT,
  team_size INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Audits: publicly readable (for shareable URLs)
CREATE POLICY "audits_public_read"
  ON audits FOR SELECT
  USING (true);

-- Audits: insertable via service role only (API routes)
CREATE POLICY "audits_service_insert"
  ON audits FOR INSERT
  WITH CHECK (true);

-- Audits: updatable via service role (for AI summary updates)
CREATE POLICY "audits_service_update"
  ON audits FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Leads: insertable via service role only
CREATE POLICY "leads_service_insert"
  ON leads FOR INSERT
  WITH CHECK (true);

-- ============================================================
-- Indexes for performance
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_audits_created_at ON audits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_audit_id ON leads(audit_id);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
