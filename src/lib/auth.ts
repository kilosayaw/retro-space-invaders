import { supabase } from './supabase';

export interface AuthUser {
  id: string;
  username: string;
}

export async function signUp(username: string, email: string, password: string) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error('Failed to create user');

  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: authData.user.id,
      username,
    });

  if (profileError) throw profileError;

  const { error: statsError } = await supabase
    .from('player_stats')
    .insert({
      user_id: authData.user.id,
    });

  if (statsError) throw statsError;

  return { user: authData.user, username };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', data.user.id)
    .maybeSingle();

  return {
    user: data.user,
    username: profile?.username || 'Player',
  };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .maybeSingle();

  return {
    id: user.id,
    username: profile?.username || 'Player',
  };
}
