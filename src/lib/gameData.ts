import { supabase, HighScore } from './supabase';

export async function submitScoreAnonymous(
  playerName: string,
  score: number,
  waveReached: number,
  aliensDefeated: number
) {
  const { error } = await supabase.from('high_scores').insert({
    username: playerName,
    score,
    wave_reached: waveReached,
    aliens_defeated: aliensDefeated,
  });
  
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
