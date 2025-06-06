
import { supabase } from '@/integrations/supabase/client';

class GameSessionService {
  // Complete a game session
  async completeGameSession(
    piUserId: string,
    gameMode: 'classic' | 'endless' | 'challenge',
    finalScore: number,
    levelReached: number,
    coinsEarned: number,
    sessionDuration?: number
  ): Promise<any> {
    try {
      const { data, error } = await supabase.rpc('complete_game_session', {
        p_pi_user_id: piUserId,
        p_game_mode: gameMode,
        p_final_score: finalScore,
        p_level_reached: levelReached,
        p_coins_earned: coinsEarned,
        p_session_duration: sessionDuration
      });

      if (error) {
        console.error('Error completing game session:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in completeGameSession:', error);
      return null;
    }
  }
}

export const gameSessionService = new GameSessionService();
