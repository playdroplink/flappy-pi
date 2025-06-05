
import { useCallback, useRef } from 'react';

interface UseCollisionHandlerProps {
  reviveUsed: boolean;
  score: number;
  setGameState: (state: 'menu' | 'playing' | 'gameOver' | 'paused') => void;
  setIsPausedForRevive: (paused: boolean) => void;
  setShowContinueButton: (show: boolean) => void;
  setAdWatched: (watched: boolean) => void;
  setShowMandatoryAd: (show: boolean) => void;
  onGameOver: (score: number) => void;
}

export const useCollisionHandler = ({
  reviveUsed,
  score,
  setGameState,
  setIsPausedForRevive,
  setShowContinueButton,
  setAdWatched,
  setShowMandatoryAd,
  onGameOver
}: UseCollisionHandlerProps) => {
  const collisionLockRef = useRef(false);

  const handleCollision = useCallback(() => {
    // Prevent multiple collision triggers
    if (collisionLockRef.current) {
      console.log('⚠️ Collision ignored - already processing');
      return;
    }

    collisionLockRef.current = true;
    console.log('Collision detected - processing game over immediately');

    // Directly go to game over without any ad checks
    onGameOver(score);
  }, [score, onGameOver]);

  const resetCollisionLock = useCallback(() => {
    console.log('🔓 Resetting collision lock');
    collisionLockRef.current = false;
  }, []);

  return {
    handleCollision,
    resetCollisionLock
  };
};
