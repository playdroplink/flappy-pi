
import { useCallback } from 'react';

interface UseAdHandlerProps {
  coins: number;
  setCoins: (coins: number) => void;
  setLives: (lives: number) => void;
}

export const useAdHandler = ({
  coins,
  setCoins,
  setLives
}: UseAdHandlerProps) => {

  const handleAdWatch = useCallback(async (adType: 'continue' | 'coins' | 'life') => {
    console.log(`🎬 Watching ${adType} ad`);
    
    // Simulate ad watching
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (adType === 'coins') {
      const bonusCoins = 50;
      const newCoins = coins + bonusCoins;
      setCoins(newCoins);
      localStorage.setItem('flappypi-coins', newCoins.toString());
    } else if (adType === 'life') {
      // Get current lives and add one
      const currentLives = parseInt(localStorage.getItem('flappypi-lives') || '3');
      const newLives = Math.min(currentLives + 1, 3);
      setLives(newLives);
      localStorage.setItem('flappypi-lives', newLives.toString());
    }
  }, [coins, setCoins, setLives]);

  return {
    handleAdWatch
  };
};
