
import { userProfileService } from './userProfileService';
import { gameSessionService } from './gameSessionService';
import { purchaseService } from './purchaseService';
import { rewardsService } from './rewardsService';
import { leaderboardDataService } from './leaderboardDataService';
import type { 
  UserProfile, 
  GameSession, 
  PurchaseItem, 
  DailyRewardResult, 
  DailyRewardStatus, 
  AdRewardResult 
} from '@/types/gameTypes';

// Legacy GameBackendService that delegates to specialized services
class GameBackendService {
  // User Profile methods
  async getUserProfile(piUserId: string): Promise<UserProfile | null> {
    return userProfileService.getUserProfile(piUserId);
  }

  async upsertUserProfile(profile: UserProfile): Promise<UserProfile | null> {
    return userProfileService.upsertUserProfile(profile);
  }

  // Game Session methods
  async completeGameSession(
    piUserId: string,
    gameMode: 'classic' | 'endless' | 'challenge',
    finalScore: number,
    levelReached: number,
    coinsEarned: number,
    sessionDuration?: number
  ): Promise<any> {
    return gameSessionService.completeGameSession(
      piUserId,
      gameMode,
      finalScore,
      levelReached,
      coinsEarned,
      sessionDuration
    );
  }

  // Purchase methods
  async makePurchase(
    piUserId: string,
    itemType: 'bird_skin' | 'power_up' | 'life' | 'coins',
    itemId: string,
    costCoins: number,
    piTransactionId?: string
  ): Promise<any> {
    return purchaseService.makePurchase(piUserId, itemType, itemId, costCoins, piTransactionId);
  }

  async getUserInventory(piUserId: string): Promise<any[]> {
    return purchaseService.getUserInventory(piUserId);
  }

  async getUserPurchases(piUserId: string, limit: number = 50): Promise<any[]> {
    return purchaseService.getUserPurchases(piUserId, limit);
  }

  // Rewards methods
  async getDailyRewardStatus(piUserId: string): Promise<DailyRewardStatus | null> {
    return rewardsService.getDailyRewardStatus(piUserId);
  }

  async claimDailyReward(piUserId: string): Promise<DailyRewardResult> {
    return rewardsService.claimDailyReward(piUserId);
  }

  async watchAdReward(
    piUserId: string,
    adType: string,
    rewardAmount: number = 25
  ): Promise<AdRewardResult | null> {
    return rewardsService.watchAdReward(piUserId, adType, rewardAmount);
  }

  // Leaderboard methods
  async getLeaderboard(limit: number = 10): Promise<any[]> {
    return leaderboardDataService.getLeaderboard(limit);
  }
}

export const gameBackendService = new GameBackendService();

// Export types for backward compatibility
export type { 
  UserProfile, 
  GameSession, 
  PurchaseItem, 
  DailyRewardResult, 
  DailyRewardStatus, 
  AdRewardResult 
};
