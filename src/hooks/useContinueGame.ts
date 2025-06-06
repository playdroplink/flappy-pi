
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseContinueGameProps {
  continueGame?: () => void;
  setGameState: (state: 'menu' | 'playing' | 'gameOver' | 'paused') => void;
  setShowContinueButton: (show: boolean) => void;
  setReviveUsed: (used: boolean) => void;
  setIsPausedForRevive: (paused: boolean) => void;
  setAdWatched: (watched: boolean) => void;
}

export const useContinueGame = ({
  continueGame,
  setGameState,
  setShowContinueButton,
  setReviveUsed,
  setIsPausedForRevive,
  setAdWatched
}: UseContinueGameProps) => {
  const { toast } = useToast();

  const handleContinueClick = useCallback(() => {
    console.log('Continue button clicked - preparing bird for safe respawn after Pi Ad');
    
    // Hide continue UI
    setShowContinueButton(false);
    setIsPausedForRevive(false);
    setAdWatched(false);
    
    // Mark revive as used for this game session
    setReviveUsed(true);
    
    // Call the game's continue function to respawn bird safely
    if (continueGame) {
      console.log('Calling game continue function to respawn bird in safe area');
      continueGame();
    }
    
    // Set game to playing state - the bird will be in "tap to continue" mode
    setGameState('playing');
    
    toast({
      title: "🚀 Bird Revived!",
      description: "Your bird is ready! Tap or click to continue flying from a safe position.",
      duration: 3000
    });
  }, [continueGame, setGameState, setShowContinueButton, setReviveUsed, setIsPausedForRevive, setAdWatched, toast]);

  const handleCoinEarned = useCallback((coinAmount: number, coins: number, setCoins: (coins: number) => void) => {
    const newCoins = coins + coinAmount;
    setCoins(newCoins);
    localStorage.setItem('flappypi-coins', newCoins.toString());
  }, []);

  return {
    handleContinueClick,
    handleCoinEarned
  };
};
