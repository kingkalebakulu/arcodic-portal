-- ─────────────────────────────────────────────────────────
-- ARcodic Client Portal — Supabase Schema
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard → SQL Editor → New Query
-- ─────────────────────────────────────────────────────────

-- CLIENTS table (managed by admin)
CREATE TABLE IF NOT EXISTS clients (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  emplid      VARCHAR(8) UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  status      TEXT DEFAULT 'new' CHECK (status IN ('new', 'pending', 'complete')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- SUBMISSIONS table (filled by clients)
CREATE TABLE IF NOT EXISTS submissions (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  emplid          VARCHAR(8) REFERENCES clients(emplid) ON DELETE CASCADE,
  business_data   JSONB,
  project_data    JSONB,
  signatures      JSONB,
  submitted_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(emplid)
);

-- ─────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS) — important for production
-- ─────────────────────────────────────────────────────────

-- Enable RLS on both tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Allow clients to verify their own EMPLID (read only their own row)
CREATE POLICY "clients_read_own" ON clients
  FOR SELECT USING (true);  -- adjust to auth.uid() once you add auth

-- Allow clients to insert/update their own submission
CREATE POLICY "submissions_insert_own" ON submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "submissions_update_own" ON submissions
  FOR UPDATE USING (true);

-- ─────────────────────────────────────────────────────────
-- SEED DATA (optional — adds the two demo clients)
-- ─────────────────────────────────────────────────────────
INSERT INTO clients (emplid, name, email, status) VALUES
  ('24680135', 'Sunset Brands', 'client@sunsetbrands.co.za', 'complete'),
  ('87351249', 'Volta Studio', 'hello@voltastudio.io', 'pending')
ON CONFLICT (emplid) DO NOTHING;
