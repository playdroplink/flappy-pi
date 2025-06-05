
import { supabase } from '@/integrations/supabase/client';

export interface LeaderboardEntry {
  id: string;
  pi_user_id: string;
  username: string;
  highest_score: number;
  total_games: number;
  created_at: string;
  updated_at: string;
}

export class LeaderboardService {
  /**
   * Fetch top players from the leaderboard
   */
  static async getLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
    const { data, error } = await supabase
      .from('user_scores')
      .select('*')
      .order('highest_score', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch leaderboard: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Submit or update a user's score
   */
  static async submitScore(piUserId: string, username: string, score: number): Promise<void> {
    const { error } = await supabase.rpc('update_user_score', {
      p_pi_user_id: piUserId,
      p_username: username,
      p_score: score
    });

    if (error) {
      throw new Error(`Failed to submit score: ${error.message}`);
    }
  }

  /**
   * Get a specific user's stats
   */
  static async getUserStats(piUserId: string): Promise<LeaderboardEntry | null> {
    const { data, error } = await supabase
      .from('user_scores')
      .select('*')
      .eq('pi_user_id', piUserId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw new Error(`Failed to fetch user stats: ${error.message}`);
    }

    return data;
  }

  /**
   * Get user's rank on the leaderboard
   */
  static async getUserRank(piUserId: string): Promise<number | null> {
    const userStats = await this.getUserStats(piUserId);
    if (!userStats) return null;

    const { count, error } = await supabase
      .from('user_scores')
      .select('*', { count: 'exact', head: true })
      .gt('highest_score', userStats.highest_score);

    if (error) {
      throw new Error(`Failed to calculate user rank: ${error.message}`);
    }

    return (count || 0) + 1;
  }
}
