
import { useState, useEffect } from 'react';
import { gameBackendService, DailyRewardResult } from '@/services/gameBackendService';
import { useToast } from '@/hooks/use-toast';

interface DailyRewardStatus {
  reward_day: number;
  last_claimed_date: string | null;
  streak_count: number;
  can_claim: boolean;
}

interface UseDailyRewardsReturn {
  rewardStatus: DailyRewardStatus | null;
  loading: boolean;
  claimReward: () => Promise<DailyRewardResult | null>;
  refreshStatus: () => Promise<void>;
}

export const useDailyRewards = (piUserId?: string): UseDailyRewardsReturn => {
  const [rewardStatus, setRewardStatus] = useState<DailyRewardStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const refreshStatus = async () => {
    if (!piUserId) return;
    
    setLoading(true);
    try {
      const status = await gameBackendService.getDailyRewardStatus(piUserId);
      
      if (status) {
        const today = new Date().toISOString().split('T')[0];
        const canClaim = !status.last_claimed_date || status.last_claimed_date !== today;
        
        setRewardStatus({
          ...status,
          can_claim: canClaim
        });
      } else {
        // No reward record exists, user can claim day 1
        setRewardStatus({
          reward_day: 1,
          last_claimed_date: null,
          streak_count: 0,
          can_claim: true
        });
      }
    } catch (error) {
      console.error('Error fetching daily reward status:', error);
    } finally {
      setLoading(false);
    }
  };

  const claimReward = async (): Promise<DailyRewardResult | null> => {
    if (!piUserId || !rewardStatus?.can_claim) return null;
    
    setLoading(true);
    try {
      const result = await gameBackendService.claimDailyReward(piUserId);
      
      if (result.success) {
        toast({
          title: "Daily Reward Claimed! 🎁",
          description: `You earned ${result.reward_amount} coins! Day ${result.current_day} of 7`,
        });
        
        // Refresh status after claiming
        await refreshStatus();
      } else {
        toast({
          title: "Claim Failed",
          description: result.error || "Could not claim daily reward",
          variant: "destructive"
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error claiming daily reward:', error);
      toast({
        title: "Error",
        description: "Failed to claim daily reward",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (piUserId) {
      refreshStatus();
    }
  }, [piUserId]);

  return {
    rewardStatus,
    loading,
    claimReward,
    refreshStatus
  };
};
