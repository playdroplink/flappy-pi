
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
    
    // ENHANCED COLLISION PROTECTION - Prevent multiple triggers
    if (collisionLockRef.current || processingRef.current || (now - lastCollisionTimeRef.current) < 800) {
      console.log('⚠️ Collision ignored - protection active');
      return;
    }

    collisionLockRef.current = true;
    processingRef.current = true;
    lastCollisionTimeRef.current = now;
    
    console.log('💥 COLLISION DETECTED - Processing game over');

    try {
      // Direct game over (no ads, clean and fast)
      setTimeout(() => {
        try {
          console.log('🎮 Calling game over with score:', score);
          onGameOver(score);
        } catch (error) {
          console.error('❌ Game over error:', error);
        } finally {
          processingRef.current = false;
        }
      }, 100); // Reduced delay for faster response
      
    } catch (error) {
      console.error('❌ Collision handler error:', error);
      processingRef.current = false;
    }
  }, [score, onGameOver]);

  const resetCollisionLock = useCallback(() => {
    console.log('🔓 COLLISION LOCK RESET - Ready for new game');
    collisionLockRef.current = false;
    processingRef.current = false;
    lastCollisionTimeRef.current = 0;
  }, []);

  return {
    handleCollision,
    resetCollisionLock
  };
};
