
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type GameMode = Database['public']['Enums']['game_mode'];
type ItemType = Database['public']['Enums']['item_type'];

// Secure version with proper error handling and validation
export interface GameSessionResult {
  session_id: string;
  is_high_score: boolean;
  total_coins: number;
  coins_earned: number;
}

export interface PurchaseResult {
  success: boolean;
  purchase_id?: string;
  remaining_coins?: number;
  error?: string;
}

class SecureGameBackendService {
  // Complete a game session with server-side validation
  async completeGameSession(
    gameMode: GameMode,
    finalScore: number,
    levelReached: number,
    coinsEarned: number,
    sessionDuration?: number
  ): Promise<GameSessionResult | null> {
    try {
      // Client-side pre-validation
      if (finalScore < 0 || finalScore > 1000) {
        throw new Error('Invalid score range');
      }

      if (levelReached < 1 || levelReached > 200) {
        throw new Error('Invalid level range');
      }

      if (coinsEarned < 0 || coinsEarned > 100) {
        throw new Error('Invalid coins earned');
      }

      const { data, error } = await supabase.rpc('complete_game_session_secure', {
        p_game_mode: gameMode,
        p_final_score: finalScore,
        p_level_reached: levelReached,
        p_coins_earned: coinsEarned,
        p_session_duration: sessionDuration
      });

      if (error) {
        console.error('Game session error:', error.message);
        return null;
      }

      return data as GameSessionResult;
    } catch (error) {
      console.error('Error in completeGameSession:', error);
      return null;
    }
  }

  // Make a purchase with enhanced validation
  async makePurchase(
    itemType: ItemType,
    itemId: string,
    costCoins: number,
    piTransactionId?: string
  ): Promise<PurchaseResult> {
    try {
      // Client-side validation
      if (costCoins < 0 || costCoins > 10000) {
        return { success: false, error: 'Invalid purchase amount' };
      }

      if (!itemId || itemId.trim().length === 0) {
        return { success: false, error: 'Invalid item ID' };
      }

      const { data, error } = await supabase.rpc('make_purchase_secure', {
        p_item_type: itemType,
        p_item_id: itemId,
        p_cost_coins: costCoins,
        p_pi_transaction_id: piTransactionId
      });

      if (error) {
        console.error('Purchase error:', error.message);
        return { success: false, error: error.message };
      }

      return data as PurchaseResult;
    } catch (error) {
      console.error('Error in makePurchase:', error);
      return { success: false, error: 'Failed to process purchase' };
    }
  }

  // Get user profile securely
  async getUserProfile(): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error.message);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      return null;
    }
  }

  // Get leaderboard with proper filtering
  async getLeaderboard(limit: number = 10): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('user_scores')
        .select('pi_user_id, username, highest_score, total_games, updated_at')
        .order('highest_score', { ascending: false })
        .limit(Math.min(limit, 50)); // Cap at 50 entries max

      if (error) {
        console.error('Error fetching leaderboard:', error.message);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getLeaderboard:', error);
      return [];
    }
  }
}

export const secureGameBackendService = new SecureGameBackendService();
