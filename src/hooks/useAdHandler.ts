
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { gameBackendService } from '@/services/gameBackendService';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAdSystem } from '@/hooks/useAdSystem';

interface UseAdHandlerProps {
  coins: number;
  adWatched: boolean;
  isPausedForRevive: boolean;
  setCoins: (coins: number) => void;
  setLives: (lives: number) => void;
  setShowContinueButton: (show: boolean) => void;
  setAdWatched: (watched: boolean) => void;
  setShowMandatoryAd: (show: boolean) => void;
  onGameOver: (score: number) => void;
  score: number;
}

export const useAdHandler = ({
  coins,
  adWatched,
  isPausedForRevive,
  setCoins,
  setLives,
  setShowContinueButton,
  setAdWatched,
  setShowMandatoryAd,
  onGameOver,
  score
}: UseAdHandlerProps) => {
  const { toast } = useToast();
  const { profile, refreshProfile } = useUserProfile();
  const adSystem = useAdSystem();

  const handleMandatoryAdWatch = useCallback(() => {
    console.log('Mandatory ad watched - resetting counter and ending game');
    adSystem.resetAdCounter();
    setShowMandatoryAd(false);
    onGameOver(score);
  }, [adSystem, setShowMandatoryAd, onGameOver, score]);

  const handleAdWatch = useCallback(async (adType: 'continue' | 'coins' | 'life') => {
    if (!profile) {
      console.warn('No user profile available for ad reward');
      return;
    }

    try {
      switch (adType) {
        case 'continue':
          if (!adWatched && isPausedForRevive) {
            console.log('Ad watched - showing continue button');
            setShowContinueButton(true);
            setAdWatched(true);
            
            await gameBackendService.watchAdReward(profile.pi_user_id, 'continue', 0);
          }
          break;
          
        case 'coins':
          const coinsResult = await gameBackendService.watchAdReward(profile.pi_user_id, 'coins', 25);
          if (coinsResult) {
            setCoins(coins + coinsResult.reward_amount);
            localStorage.setItem('flappypi-coins', (coins + coinsResult.reward_amount).toString());
            await refreshProfile();
            toast({
              title: "Bonus Pi Coins! 🪙",
              description: `You earned ${coinsResult.reward_amount} Pi coins!`
            });
          }
          break;
          
        case 'life':
          await gameBackendService.watchAdReward(profile.pi_user_id, 'life', 0);
          setLives(1);
          toast({
            title: "Extra Life! ❤️",
            description: "You earned an extra life!"
          });
          break;
      }
    } catch (error) {
      console.error('Error handling ad watch:', error);
      if (adType === 'coins') {
        const bonusCoins = 25;
        setCoins(coins + bonusCoins);
        localStorage.setItem('flappypi-coins', (coins + bonusCoins).toString());
        toast({
          title: "Bonus Pi Coins! 🪙",
          description: `You earned ${bonusCoins} Pi coins!`
        });
      }
    }
  }, [profile, adWatched, isPausedForRevive, setShowContinueButton, setAdWatched, coins, setCoins, refreshProfile, toast, setLives]);

  return {
    handleAdWatch,
    handleMandatoryAdWatch
  };
};
