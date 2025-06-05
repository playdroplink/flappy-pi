
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseContinueGameProps {
  continueGame?: () => void;
  setShowContinueButton: (show: boolean) => void;
  setReviveUsed: (used: boolean) => void;
  setIsPausedForRevive: (paused: boolean) => void;
  setAdWatched: (watched: boolean) => void;
  setGameState: (state: 'menu' | 'playing' | 'gameOver' | 'paused') => void;
  resetCollisionLock: () => void;
}

export const useContinueGame = ({
  continueGame,
  setShowContinueButton,
  setReviveUsed,
  setIsPausedForRevive,
  setAdWatched,
  setGameState,
  resetCollisionLock
}: UseContinueGameProps) => {
  const { toast } = useToast();

  const handleContinueClick = useCallback(() => {
    console.log('Continue button clicked - resuming game');
    
    // Reset collision lock to allow new collisions
    resetCollisionLock();
    
    setShowContinueButton(false);
    setReviveUsed(true);
    setIsPausedForRevive(false);
    setAdWatched(false);
    
    if (continueGame) {
      continueGame();
    }
    
    setGameState('playing');
    
    toast({
      title: "Welcome Back! 🚀",
      description: "Continue your flight and reach new heights!",
      duration: 2000
    });
  }, [continueGame, setGameState, toast, setShowContinueButton, setReviveUsed, setIsPausedForRevive, setAdWatched, resetCollisionLock]);

  return {
    handleContinueClick
  };
};
