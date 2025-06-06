
import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id?: string;
  pi_user_id: string;
  username: string;
  total_coins: number;
  selected_bird_skin: string;
  music_enabled: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface GameSessionResult {
  session_id: string;
  is_high_score: boolean;
  total_coins: number;
  coins_earned: number;
}

export interface DailyRewardResult {
  success: boolean;
  reward_amount: number;
  current_day: number;
  error?: string;
}

export interface AdRewardResult {
  success: boolean;
  reward_amount: number;
  error?: string;
}

class GameBackendService {
  // User Profile Management
  async getUserProfile(): Promise<UserProfile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('pi_user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      return null;
    }
  }

  async upsertUserProfile(profile: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const profileData = {
        ...profile,
        pi_user_id: user.id,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('user_profiles')
        .upsert(profileData)
        .select()
        .single();

      if (error) {
        console.error('Error upserting user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in upsertUserProfile:', error);
      return null;
    }
  }

  // Game Session Management
  async completeGameSession(
    gameMode: string,
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

      return data;
    } catch (error) {
      console.error('Error in completeGameSession:', error);
      return null;
    }
  }

  // Daily Rewards
  async getDailyRewardStatus() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

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

  async claimDailyReward(): Promise<DailyRewardResult> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const today = new Date().toISOString().split('T')[0];
      
      // Check if already claimed today
      const { data: existingReward } = await supabase
        .from('daily_rewards')
        .select('*')
        .eq('pi_user_id', user.id)
        .single();

      if (existingReward && existingReward.last_claimed_date === today) {
        return {
          success: false,
          reward_amount: 0,
          current_day: existingReward.reward_day,
          error: 'Already claimed today'
        };
      }

      // Calculate reward day and amount
      const rewardDay = existingReward ? 
        (existingReward.reward_day % 7) + 1 : 1;
      const rewardAmount = rewardDay * 10; // 10, 20, 30, etc.

      // Update daily reward record
      const { error: rewardError } = await supabase
        .from('daily_rewards')
        .upsert({
          pi_user_id: user.id,
          reward_day: rewardDay,
          last_claimed_date: today,
          streak_count: existingReward ? existingReward.streak_count + 1 : 1,
          updated_at: new Date().toISOString()
        });

      if (rewardError) throw rewardError;

      // Update user coins
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({ 
          total_coins: supabase.raw(`total_coins + ${rewardAmount}`),
          updated_at: new Date().toISOString()
        })
        .eq('pi_user_id', user.id);

      if (profileError) throw profileError;

      return {
        success: true,
        reward_amount: rewardAmount,
        current_day: rewardDay
      };
    } catch (error) {
      console.error('Error in claimDailyReward:', error);
      return {
        success: false,
        reward_amount: 0,
        current_day: 1,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Ad Rewards
  async watchAdReward(adType: string, rewardAmount: number): Promise<AdRewardResult> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      // Record ad watch
      const { error: adError } = await supabase
        .from('ad_watches')
        .insert({
          pi_user_id: user.id,
          ad_type: adType,
          reward_given: rewardAmount.toString(),
          watched_at: new Date().toISOString()
        });

      if (adError) throw adError;

      // Update user coins if applicable
      if (rewardAmount > 0) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .update({ 
            total_coins: supabase.raw(`total_coins + ${rewardAmount}`),
            updated_at: new Date().toISOString()
          })
          .eq('pi_user_id', user.id);

        if (profileError) throw profileError;
      }

      return {
        success: true,
        reward_amount: rewardAmount
      };
    } catch (error) {
      console.error('Error in watchAdReward:', error);
      return {
        success: false,
        reward_amount: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const gameBackendService = new GameBackendService();
