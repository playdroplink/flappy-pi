
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
  const processingRef = useRef(false);

  const handleCollision = useCallback(() => {
    const now = Date.now();
    
    // Prevent multiple collision triggers
    if (collisionLockRef.current || processingRef.current || (now - lastCollisionTimeRef.current) < 1000) {
      console.log('⚠️ Collision ignored - too recent or already processing');
      return;
    }

    collisionLockRef.current = true;
    processingRef.current = true;
    lastCollisionTimeRef.current = now;
    
    console.log('💥 Collision detected - processing game over');

    try {
      // Direct game over without ads or delays
      setTimeout(() => {
        try {
          onGameOver(score);
        } catch (error) {
          console.error('❌ Game over handler error:', error);
        } finally {
          processingRef.current = false;
        }
      }, 150);
    } catch (error) {
      console.error('❌ Collision handler error:', error);
      processingRef.current = false;
    }
  }, [score, onGameOver]);

  const resetCollisionLock = useCallback(() => {
    console.log('🔓 Resetting collision lock for fresh start');
    collisionLockRef.current = false;
    processingRef.current = false;
    lastCollisionTimeRef.current = 0;
  }, []);

  return {
    handleCollision,
    resetCollisionLock
  };
};
