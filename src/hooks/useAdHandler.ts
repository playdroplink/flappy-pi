
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
    
    // Enhanced messaging for mandatory ads
    toast({
      title: "🎉 Thanks for watching!",
      description: "Ads help us reward top players with real Pi weekly! Keep flying!"
    });
    
    onGameOver(score);
  }, [adSystem, setShowMandatoryAd, onGameOver, score, toast]);

  const handleAdWatch = useCallback(async (adType: 'continue' | 'coins' | 'life') => {
    if (!profile) {
      console.warn('No user profile available for ad reward');
      return;
    }

    try {
      switch (adType) {
        case 'continue':
          if (!adWatched && isPausedForRevive) {
            console.log('Revive ad watched - showing continue button');
            setShowContinueButton(true);
            setAdWatched(true);
            
            toast({
              title: "🔄 Revive Earned!",
              description: "You're back in the game! Keep flying high!"
            });
            
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
              title: "🎉 You've earned 25 Flappy Coins! 🪙",
              description: "Keep flying to convert them to Pi soon! Top players win real Pi weekly!"
            });
          }
          break;
          
        case 'life':
          await gameBackendService.watchAdReward(profile.pi_user_id, 'life', 0);
          setLives(1);
          toast({
            title: "❤️ Extra Life Earned!",
            description: "🔥 Watch ads to earn coins — top players win real Pi weekly!"
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
          title: "🎉 You've earned 25 Flappy Coins! 🪙",
          description: "Keep flying to convert them to Pi soon! Top players win real Pi weekly!"
        });
      }
    }
  }, [profile, adWatched, isPausedForRevive, setShowContinueButton, setAdWatched, coins, setCoins, refreshProfile, toast, setLives]);

  return {
    handleAdWatch,
    handleMandatoryAdWatch
  };
};
