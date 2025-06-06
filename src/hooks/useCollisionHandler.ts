
import { useCallback } from 'react';

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

  const handleCollision = useCallback(() => {
    console.log('Collision detected! Revive used:', reviveUsed, 'Score:', score);
    
    // If revive hasn't been used and player has a decent score, offer ad to continue
    if (!reviveUsed && score >= 5) {
      console.log('Offering ad to continue game');
      setGameState('paused');
      setIsPausedForRevive(true);
      setShowContinueButton(false);
      setAdWatched(false);
      setShowMandatoryAd(false);
    } else {
      // Game over - no revive available
      console.log('No revive available - game over');
      onGameOver(score);
    }
  }, [reviveUsed, score, setGameState, setIsPausedForRevive, setShowContinueButton, setAdWatched, setShowMandatoryAd, onGameOver]);

  return { handleCollision };
};
