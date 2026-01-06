-- Make user_id optional for anonymous scores
ALTER TABLE high_scores 
ALTER COLUMN user_id DROP NOT NULL;

-- Update RLS policies to allow anonymous inserts
DROP POLICY IF EXISTS "Users can insert own scores" ON high_scores;
DROP POLICY IF EXISTS "Users can view all scores" ON high_scores;

-- Allow anyone to insert high scores (anonymous)
CREATE POLICY "Anyone can insert high scores"
  ON high_scores FOR INSERT
  WITH CHECK (true);

-- Allow anyone to view high scores
CREATE POLICY "Anyone can view high scores"
  ON high_scores FOR SELECT
  USING (true);
