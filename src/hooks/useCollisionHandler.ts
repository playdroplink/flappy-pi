
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
  const lastCollisionTimeRef = useRef(0);

  const handleCollision = useCallback(() => {
    const now = Date.now();
    
    // Prevent multiple collision triggers within 500ms
    if (collisionLockRef.current || (now - lastCollisionTimeRef.current) < 500) {
      console.log('⚠️ Collision ignored - too recent or already processing');
      return;
    }

    collisionLockRef.current = true;
    lastCollisionTimeRef.current = now;
    
    console.log('💥 Collision detected - processing game over');

    // Direct game over without ads
    setTimeout(() => {
      onGameOver(score);
    }, 100);
  }, [score, onGameOver]);

  const resetCollisionLock = useCallback(() => {
    console.log('🔓 Resetting collision lock for fresh start');
    collisionLockRef.current = false;
    lastCollisionTimeRef.current = 0;
  }, []);

  return {
    handleCollision,
    resetCollisionLock
  };
};
