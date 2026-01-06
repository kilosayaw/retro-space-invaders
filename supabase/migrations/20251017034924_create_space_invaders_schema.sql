/*
  # Space Invaders Game Database Schema

  ## Overview
  Creates the complete database structure for the Space Invaders game including:
  - User authentication and profiles
  - High score leaderboard
  - Player statistics tracking

  ## New Tables
  
  ### 1. `profiles`
  - `id` (uuid, primary key) - Links to auth.users
  - `username` (text, unique) - Player's display name
  - `created_at` (timestamptz) - Account creation timestamp
  
  ### 2. `high_scores`
  - `id` (uuid, primary key) - Unique score entry ID
  - `user_id` (uuid, foreign key) - References profiles.id
  - `username` (text) - Denormalized for faster leaderboard queries
  - `score` (integer) - Final game score
  - `wave_reached` (integer) - Highest wave completed
  - `aliens_defeated` (integer) - Total aliens destroyed in game
  - `achieved_at` (timestamptz) - When the score was achieved
  
  ### 3. `player_stats`
  - `user_id` (uuid, primary key) - References profiles.id
  - `games_played` (integer) - Total games completed
  - `best_score` (integer) - Personal best score
  - `total_aliens_defeated` (integer) - Lifetime alien kills
  - `total_waves_completed` (integer) - Lifetime waves cleared
  - `last_played` (timestamptz) - Most recent game timestamp
  - `updated_at` (timestamptz) - Stats last updated

  ## Security
  
  ### Row Level Security (RLS)
  All tables have RLS enabled with the following policies:
  
  #### profiles table:
  - SELECT: Users can view all profiles (for leaderboard display)
  - INSERT: Users can create their own profile
  - UPDATE: Users can update only their own profile
  
  #### high_scores table:
  - SELECT: Anyone can view high scores (public leaderboard)
  - INSERT: Authenticated users can insert their own scores
  - UPDATE: Users can update only their own scores
  - DELETE: Users can delete only their own scores
  
  #### player_stats table:
  - SELECT: Users can view only their own stats
  - INSERT: Users can create their own stats record
  - UPDATE: Users can update only their own stats

  ## Notes
  - Uses gen_random_uuid() for primary keys
  - Timestamps use timestamptz for timezone awareness
  - Username is denormalized in high_scores for query performance
  - Indexes on user_id and score columns for fast leaderboard queries
  - Default values set for all statistics counters
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create high_scores table
CREATE TABLE IF NOT EXISTS high_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  username text NOT NULL,
  score integer NOT NULL DEFAULT 0,
  wave_reached integer NOT NULL DEFAULT 1,
  aliens_defeated integer NOT NULL DEFAULT 0,
  achieved_at timestamptz DEFAULT now()
);

ALTER TABLE high_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view high scores"
  ON high_scores FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own scores"
  ON high_scores FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scores"
  ON high_scores FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scores"
  ON high_scores FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create player_stats table
CREATE TABLE IF NOT EXISTS player_stats (
  user_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  games_played integer DEFAULT 0,
  best_score integer DEFAULT 0,
  total_aliens_defeated integer DEFAULT 0,
  total_waves_completed integer DEFAULT 0,
  last_played timestamptz,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE player_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own stats"
  ON player_stats FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own stats"
  ON player_stats FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats"
  ON player_stats FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_high_scores_user_id ON high_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_high_scores_score ON high_scores(score DESC);
CREATE INDEX IF NOT EXISTS idx_high_scores_achieved_at ON high_scores(achieved_at DESC);