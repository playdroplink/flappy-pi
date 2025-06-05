
import { useState } from 'react';
import { useAdSystem } from '@/hooks/useAdSystem';
import { useCollisionHandler } from '@/hooks/useCollisionHandler';
import { useGameOverHandler } from '@/hooks/useGameOverHandler';
import { useAdHandler } from '@/hooks/useAdHandler';
import { useContinueGame } from '@/hooks/useContinueGame';

interface UseGameEventsProps {
  score: number;
  coins: number;
  highScore: number;
  level: number;
  setGameState: (state: 'menu' | 'playing' | 'gameOver' | 'paused') => void;
  setScore: (score: number) => void;
  setLives: (lives: number) => void;
  setLevel: (level: number) => void;
  setHighScore: (score: number) => void;
  setCoins: (coins: number) => void;
  continueGame?: () => void;
}

export const useGameEvents = ({
  score,
  coins,
  highScore,
  level,
  setGameState,
  setScore,
  setLives,
  setLevel,
  setHighScore,
  setCoins,
  continueGame
}: UseGameEventsProps) => {
  const adSystem = useAdSystem();
  
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [isPausedForRevive, setIsPausedForRevive] = useState(false);
  const [reviveUsed, setReviveUsed] = useState(false);
  const [adWatched, setAdWatched] = useState(false);
  const [showMandatoryAd, setShowMandatoryAd] = useState(false);
  const [showAdFreeModal, setShowAdFreeModal] = useState(false);

  const { handleGameOver } = useGameOverHandler({
    coins,
    highScore,
    level,
    setGameState,
    setScore,
    setLives,
    setLevel,
    setHighScore,
    setCoins,
    setIsPausedForRevive,
    setShowContinueButton,
    setAdWatched,
    setShowMandatoryAd,
    setReviveUsed
  });

  const { handleCollision } = useCollisionHandler({
    reviveUsed,
    score,
    setGameState,
    setIsPausedForRevive,
    setShowContinueButton,
    setAdWatched,
    setShowMandatoryAd,
    onGameOver: handleGameOver
  });

  const { handleAdWatch, handleMandatoryAdWatch } = useAdHandler({
    coins,
    adWatched,
    isPausedForRevive,
    setCoins,
    setLives,
    setShowContinueButton,
    setAdWatched,
    setShowMandatoryAd,
    onGameOver: handleGameOver,
    score
  });

  const { handleContinueClick, handleCoinEarned } = useContinueGame({
    continueGame,
    setGameState,
    setShowContinueButton,
    setReviveUsed,
    setIsPausedForRevive,
    setAdWatched
  });

  return {
    handleCollision,
    handleGameOver,
    handleCoinEarned: (coinAmount: number) => handleCoinEarned(coinAmount, coins, setCoins),
    handleAdWatch,
    showContinueButton,
    handleContinueClick,
    isPausedForRevive,
    reviveUsed,
    showMandatoryAd,
    showAdFreeModal,
    adSystem,
    handleMandatoryAdWatch,
    setShowAdFreeModal
  };
};
