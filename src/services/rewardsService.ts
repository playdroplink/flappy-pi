
import { supabase } from '@/integrations/supabase/client';
import { DailyRewardResult, DailyRewardStatus, AdRewardResult } from '@/types/gameTypes';

class RewardsService {
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

      // Fix TypeScript error by safely casting the result
      if (data && typeof data === 'object' && 'success' in data) {
        return data as unknown as DailyRewardResult;
      }

      return { success: false, error: 'Invalid response format' };
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

      // Fix TypeScript error by safely casting the result
      if (data && typeof data === 'object' && 'success' in data) {
        return data as unknown as AdRewardResult;
      }

      return null;
    } catch (error) {
      console.error('Error in watchAdReward:', error);
      return null;
    }
  }
}

export const rewardsService = new RewardsService();
