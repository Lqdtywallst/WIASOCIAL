-- Instagram metrics integration — run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS instagram_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  ig_user_id TEXT NOT NULL,
  ig_username TEXT,
  page_id TEXT,
  access_token TEXT NOT NULL,
  token_expires_at TIMESTAMPTZ,
  followers_count INTEGER DEFAULT 0,
  media_count INTEGER DEFAULT 0,
  last_synced_at TIMESTAMPTZ,
  connected_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE post_performance
  ADD COLUMN IF NOT EXISTS instagram_media_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS post_performance_user_ig_media_idx
  ON post_performance(user_id, instagram_media_id)
  WHERE instagram_media_id IS NOT NULL;

ALTER TABLE instagram_connections ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "instagram_own" ON instagram_connections FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
