
import { useCallback } from 'react';

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

  const handleAdWatch = useCallback(async (adType: 'continue' | 'coins' | 'life') => {
    console.log(`🎬 Watching ${adType} ad`);
    
    // Simulate ad watching
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (adType === 'continue' && isPausedForRevive) {
      setAdWatched(true);
      setShowContinueButton(true);
    } else if (adType === 'coins') {
      const bonusCoins = 50;
      const newCoins = coins + bonusCoins;
      setCoins(newCoins);
      localStorage.setItem('flappypi-coins', newCoins.toString());
    } else if (adType === 'life') {
      setLives(prevLives => {
        const newLives = Math.min(prevLives + 1, 3);
        localStorage.setItem('flappypi-lives', newLives.toString());
        return newLives;
      });
    }
  }, [coins, adWatched, isPausedForRevive, setShowContinueButton, setAdWatched, setCoins, setLives]);

  return {
    handleAdWatch
  };
};
