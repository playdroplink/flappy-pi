
import { useCallback } from 'react';

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

  const handleContinueClick = useCallback(() => {
    console.log('🔄 Continuing game after ad watch');
    resetCollisionLock();
    setShowContinueButton(false);
    setReviveUsed(true);
    setIsPausedForRevive(false);
    setAdWatched(false);
    setGameState('playing');
    
    if (continueGame) {
      continueGame();
    }
  }, [continueGame, setShowContinueButton, setReviveUsed, setIsPausedForRevive, setAdWatched, setGameState, resetCollisionLock]);

  return {
    handleContinueClick
  };
};
