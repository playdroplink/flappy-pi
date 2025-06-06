
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { gameBackendService } from '@/services/gameBackendService';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@/hooks/useAuth';

interface UseAdRewardHandlerProps {
  coins: number;
  adWatched: boolean;
  isPausedForRevive: boolean;
  setShowContinueButton: (show: boolean) => void;
  setAdWatched: (watched: boolean) => void;
  setCoins: (coins: number) => void;
  setLives: (lives: number) => void;
}

export const useAdRewardHandler = ({
  coins,
  adWatched,
  isPausedForRevive,
  setShowContinueButton,
  setAdWatched,
  setCoins,
  setLives
}: UseAdRewardHandlerProps) => {
  const { toast } = useToast();
  const { refreshProfile } = useUserProfile();
  const { user } = useAuth();

  const handleAdWatch = useCallback(async (adType: 'continue' | 'coins' | 'life') => {
    if (!user) {
      console.warn('No authenticated user available for ad reward');
      return;
    }

    try {
      switch (adType) {
        case 'continue':
          if (!adWatched && isPausedForRevive) {
            console.log('Ad watched - showing continue button');
            setShowContinueButton(true);
            setAdWatched(true);
            
            // Record ad watch in backend
            await gameBackendService.watchAdReward('continue', 0);
          }
          break;
          
        case 'coins':
          const coinsResult = await gameBackendService.watchAdReward('coins', 25);
          if (coinsResult) {
            setCoins(coins + coinsResult.reward_amount);
            localStorage.setItem('flappypi-coins', (coins + coinsResult.reward_amount).toString());
            await refreshProfile();
            toast({
              title: "Bonus Flappy Coins! 🪙",
              description: `You earned ${coinsResult.reward_amount} Flappy coins!`
            });
          }
          break;
          
        case 'life':
          await gameBackendService.watchAdReward('life', 0);
          setLives(1);
          toast({
            title: "Extra Life! ❤️",
            description: "You earned an extra life!"
          });
          break;
      }
    } catch (error) {
      console.error('Error handling ad watch:', error);
      // Fallback to local handling for coins
      if (adType === 'coins') {
        const bonusCoins = 25;
        setCoins(coins + bonusCoins);
        localStorage.setItem('flappypi-coins', (coins + bonusCoins).toString());
        toast({
          title: "Bonus Flappy Coins! 🪙",
          description: `You earned ${bonusCoins} Flappy coins!`
        });
      }
    }
  }, [user, adWatched, isPausedForRevive, setShowContinueButton, setAdWatched, coins, setCoins, refreshProfile, toast, setLives]);

  return {
    handleAdWatch
  };
};
