
import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id?: string;
  pi_user_id: string;
  username: string;
  total_coins: number;
  selected_bird_skin: string;
  music_enabled: boolean;
  premium_expires_at?: string;
  ad_free_permanent?: boolean;
  owned_skins?: string[];
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
  // New subscription fields
  subscription_status?: string;
  subscription_start?: string;
  subscription_end?: string;
  subscription_plan?: string;
}

export interface GameSession {
  pi_user_id: string;
  game_mode: 'classic' | 'endless' | 'challenge';
  final_score: number;
  level_reached: number;
  coins_earned: number;
  session_duration?: number;
}

export interface PurchaseItem {
  pi_user_id: string;
  item_type: 'bird_skin' | 'power_up' | 'life' | 'coins';
  item_id: string;
  cost_coins: number;
  pi_transaction_id?: string;
}

export interface DailyRewardResult {
  success: boolean;
  reward_amount?: number;
  current_day?: number;
  streak?: number;
  error?: string;
}

export interface DailyRewardStatus {
  reward_day: number;
  last_claimed_date: string | null;
  streak_count: number;
}

export interface AdRewardResult {
  success: boolean;
  reward_amount: number;
  description: string;
}

class GameBackendService {
  // Get user profile by Pi user ID
  async getUserProfile(piUserId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('pi_user_id', piUserId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned - user doesn't exist yet
          return null;
        }
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      return null;
    }
  }

  // Create or update user profile
  async upsertUserProfile(profile: UserProfile): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert(profile as any, {
          onConflict: 'pi_user_id'
        })
        .select()
        .single();

      if (error) {
        console.error('Error upserting user profile:', error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Error in upsertUserProfile:', error);
      return null;
    }
  }

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

  // Make a purchase
  async makePurchase(
    piUserId: string,
    itemType: 'bird_skin' | 'power_up' | 'life' | 'coins',
    itemId: string,
    costCoins: number,
    piTransactionId?: string
  ): Promise<any> {
    try {
      const { data, error } = await supabase.rpc('make_purchase', {
        p_pi_user_id: piUserId,
        p_item_type: itemType,
        p_item_id: itemId,
        p_cost_coins: costCoins,
        p_pi_transaction_id: piTransactionId
      });

      if (error) {
        console.error('Error making purchase:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in makePurchase:', error);
      return null;
    }
  }

  // Get user inventory
  async getUserInventory(piUserId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('user_inventory')
        .select('*')
        .eq('pi_user_id', piUserId);

      if (error) {
        console.error('Error fetching user inventory:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserInventory:', error);
      return [];
    }
  }

  // Get user purchases
  async getUserPurchases(piUserId: string, limit: number = 50): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .eq('pi_user_id', piUserId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching user purchases:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserPurchases:', error);
      return [];
    }
  }

  // Get leaderboard
  async getLeaderboard(limit: number = 10): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('user_scores')
        .select('username, highest_score, total_games, updated_at')
        .order('highest_score', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching leaderboard:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getLeaderboard:', error);
      return [];
    }
  }

  // Get daily reward status
  async getDailyRewardStatus(piUserId: string): Promise<DailyRewardStatus | null> {
    try {
      const { data, error } = await supabase
        .from('daily_rewards')
        .select('*')
        .eq('pi_user_id', piUserId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // No record exists yet
        }
        console.error('Error fetching daily reward status:', error);
        return null;
      }

      return data as DailyRewardStatus;
    } catch (error) {
      console.error('Error in getDailyRewardStatus:', error);
      return null;
    }
  }

  // Claim daily reward
  async claimDailyReward(piUserId: string): Promise<DailyRewardResult> {
    try {
      const { data, error } = await supabase.rpc('claim_daily_reward', {
        p_pi_user_id: piUserId
      });

      if (error) {
        console.error('Error claiming daily reward:', error);
        return { success: false, error: error.message };
      }

      return data as DailyRewardResult;
    } catch (error) {
      console.error('Error in claimDailyReward:', error);
      return { success: false, error: 'Failed to claim daily reward' };
    }
  }

  // Watch ad for reward
  async watchAdReward(
    piUserId: string,
    adType: string,
    rewardAmount: number = 25
  ): Promise<AdRewardResult | null> {
    try {
      const { data, error } = await supabase.rpc('watch_ad_reward', {
        p_pi_user_id: piUserId,
        p_ad_type: adType,
        p_reward_amount: rewardAmount
      });

      if (error) {
        console.error('Error recording ad watch:', error);
        return null;
      }

      return data as AdRewardResult;
    } catch (error) {
      console.error('Error in watchAdReward:', error);
      return null;
    }
  }
}

export const gameBackendService = new GameBackendService();
