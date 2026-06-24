-- Persistence fixes for generated results and Lead IQ

ALTER TABLE lead_ai_scores ADD COLUMN IF NOT EXISTS dm_template TEXT;
