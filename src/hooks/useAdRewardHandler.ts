
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

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

  const handleAdWatch = useCallback(async (adType: 'continue' | 'coins' | 'life') => {
    console.log(`📺 Watching ${adType} ad`);
    
    // Simulate ad watching
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    switch (adType) {
      case 'continue':
        if (isPausedForRevive && !adWatched) {
          console.log('✅ Continue ad watched - showing continue button');
          setAdWatched(true);
          setShowContinueButton(true);
          toast({
            title: "Ad Watched! 🎉",
            description: "You can now continue your game!"
          });
        }
        break;
        
      case 'coins':
        const coinReward = 50;
        const newCoins = coins + coinReward;
        setCoins(newCoins);
        localStorage.setItem('flappypi-coins', newCoins.toString());
        toast({
          title: "Coins Earned! 💰",
          description: `You earned ${coinReward} coins!`
        });
        break;
        
      case 'life':
        setLives(1);
        toast({
          title: "Extra Life! ❤️",
          description: "You gained an extra life!"
        });
        break;
    }
  }, [coins, adWatched, isPausedForRevive, setShowContinueButton, setAdWatched, setCoins, setLives, toast]);

  return {
    handleAdWatch
  };
};
