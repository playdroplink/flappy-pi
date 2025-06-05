
import { useRef, useCallback } from 'react';
import { useAdSystem } from '@/hooks/useAdSystem';

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
  const adSystem = useAdSystem();
  const collisionHandledRef = useRef(false);

  const handleCollision = useCallback(() => {
    // Prevent multiple collision handling
    if (collisionHandledRef.current) {
      console.log('Collision already handled, ignoring...');
      return;
    }
    
    collisionHandledRef.current = true;
    console.log('Collision detected - checking ad system');
    
    // Check if user can continue without ad (Premium subscription)
    if (adSystem.canContinueWithoutAd && !reviveUsed) {
      console.log('User has Premium - allowing continue without ad');
      setIsPausedForRevive(true);
      setGameState('paused');
      setShowContinueButton(true);
      setAdWatched(false);
      return;
    }
    
    // Check if this is a mandatory ad game over
    if (adSystem.shouldShowMandatoryAd) {
      console.log('Showing mandatory ad');
      setShowMandatoryAd(true);
      setGameState('paused');
      return;
    }
    
    // Normal revive flow (optional ad)
    if (!reviveUsed) {
      setIsPausedForRevive(true);
      setGameState('paused');
      setAdWatched(false);
      setShowContinueButton(false);
    } else {
      onGameOver(score);
    }
  }, [adSystem.canContinueWithoutAd, adSystem.shouldShowMandatoryAd, reviveUsed, score, setGameState, setIsPausedForRevive, setShowContinueButton, setAdWatched, setShowMandatoryAd, onGameOver]);

  const resetCollisionLock = useCallback(() => {
    collisionHandledRef.current = false;
  }, []);

  return {
    handleCollision,
    resetCollisionLock
  };
};
