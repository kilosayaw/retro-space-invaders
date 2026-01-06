import { supabase, HighScore, PlayerStats } from './supabase';

export async function submitScore(
  userId: string,
  username: string,
  score: number,
  waveReached: number,
  aliensDefeated: number
) {
  const { error } = await supabase.from('high_scores').insert({
    user_id: userId,
    username,
    score,
    wave_reached: waveReached,
    aliens_defeated: aliensDefeated,
  });

  if (error) throw error;
}

export async function updatePlayerStats(
  userId: string,
  score: number,
  aliensDefeated: number,
  wavesCompleted: number
) {
  const { data: currentStats } = await supabase
    .from('player_stats')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  const newStats = {
    user_id: userId,
    games_played: (currentStats?.games_played || 0) + 1,
    best_score: Math.max(currentStats?.best_score || 0, score),
    total_aliens_defeated: (currentStats?.total_aliens_defeated || 0) + aliensDefeated,
    total_waves_completed: (currentStats?.total_waves_completed || 0) + wavesCompleted,
    last_played: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('player_stats')
    .upsert(newStats);

  if (error) throw error;
}

export async function getTopScores(limit: number = 10): Promise<HighScore[]> {
  const { data, error } = await supabase
    .from('high_scores')
    .select('*')
    .order('score', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export async function getPlayerStats(userId: string): Promise<PlayerStats | null> {
  const { data, error } = await supabase
    .from('player_stats')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}
