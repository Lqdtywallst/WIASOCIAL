-- Growth Radar AI reports — run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS growth_radar_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  report_week DATE NOT NULL,
  opportunity_score INTEGER NOT NULL CHECK (opportunity_score BETWEEN 0 AND 100),
  report JSONB NOT NULL,
  context_snapshot JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, report_week)
);

CREATE INDEX IF NOT EXISTS growth_radar_reports_user_week_idx
  ON growth_radar_reports(user_id, report_week DESC);

ALTER TABLE growth_radar_reports ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "growth_radar_own" ON growth_radar_reports
    FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
