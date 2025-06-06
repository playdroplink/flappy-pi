
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type GameMode = Database['public']['Enums']['game_mode'];
type ItemType = Database['public']['Enums']['item_type'];

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

export interface DailyRewardResult {
  success: boolean;
  reward_amount?: number;
  current_day?: number;
  streak?: number;
  error?: string;
}

export interface AdRewardResult {
  success: boolean;
  reward_amount: number;
  description: string;
}

export interface UserProfile {
  id: string;
  pi_user_id: string;
  username: string;
  avatar_url?: string;
  total_coins: number;
  selected_bird_skin: string;
  music_enabled: boolean;
  created_at: string;
  updated_at: string;
}

class GameBackendService {
  // Complete a game session and update all related data
  async completeGameSession(
    gameMode: GameMode,
    finalScore: number,
    levelReached: number,
    coinsEarned: number,
    sessionDuration?: number
  ): Promise<GameSessionResult | null> {
    try {
      const { data, error } = await supabase.rpc('complete_game_session', {
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

      return data as any as GameSessionResult;
    } catch (error) {
      console.error('Error in completeGameSession:', error);
      return null;
    }
  }

  // Make a purchase using coins
  async makePurchase(
    itemType: ItemType,
    itemId: string,
    costCoins: number,
    piTransactionId?: string
  ): Promise<PurchaseResult> {
    try {
      const { data, error } = await supabase.rpc('make_purchase', {
        p_item_type: itemType,
        p_item_id: itemId,
        p_cost_coins: costCoins,
        p_pi_transaction_id: piTransactionId
      });

      if (error) {
        console.error('Error making purchase:', error);
        return { success: false, error: error.message };
      }

      return data as any as PurchaseResult;
    } catch (error) {
      console.error('Error in makePurchase:', error);
      return { success: false, error: 'Failed to process purchase' };
    }
  }

  // Claim daily reward
  async claimDailyReward(): Promise<DailyRewardResult> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { data, error } = await supabase.rpc('claim_daily_reward', {
        p_pi_user_id: user.id
      });

      if (error) {
        console.error('Error claiming daily reward:', error);
        return { success: false, error: error.message };
      }

      return data as any as DailyRewardResult;
    } catch (error) {
      console.error('Error in claimDailyReward:', error);
      return { success: false, error: 'Failed to claim daily reward' };
    }
  }

  // Record ad watch and give reward
  async watchAdReward(
    adType: string,
    rewardAmount: number = 25
  ): Promise<AdRewardResult | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('User not authenticated for ad reward');
        return null;
      }

      const { data, error } = await supabase.rpc('watch_ad_reward', {
        p_pi_user_id: user.id,
        p_ad_type: adType,
        p_reward_amount: rewardAmount
      });

      if (error) {
        console.error('Error recording ad reward:', error);
        return null;
      }

      return data as any as AdRewardResult;
    } catch (error) {
      console.error('Error in watchAdReward:', error);
      return null;
    }
  }

  // Get user profile
  async getUserProfile(piUserId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('pi_user_id', piUserId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
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
  async upsertUserProfile(profile: Partial<UserProfile> & { pi_user_id: string; username: string }): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert(profile, { onConflict: 'pi_user_id' })
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

  // Get user inventory
  async getUserInventory(): Promise<any[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_inventory')
        .select('*')
        .eq('pi_user_id', user.id);

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

  // Get user's game sessions
  async getUserGameSessions(limit: number = 10): Promise<any[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('pi_user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching game sessions:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserGameSessions:', error);
      return [];
    }
  }

  // Get daily reward status
  async getDailyRewardStatus(): Promise<any> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('daily_rewards')
        .select('*')
        .eq('pi_user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching daily reward status:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getDailyRewardStatus:', error);
      return null;
    }
  }
}

export const gameBackendService = new GameBackendService();
