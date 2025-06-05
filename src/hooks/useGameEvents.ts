
import { useCallback, useState } from 'react';
import { useCollisionHandler } from '@/hooks/useCollisionHandler';
import { useGameOverHandler } from '@/hooks/useGameOverHandler';
import { useAdRewardHandler } from '@/hooks/useAdRewardHandler';
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
  
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [isPausedForRevive, setIsPausedForRevive] = useState(false);
  const [reviveUsed, setReviveUsed] = useState(false);
  const [adWatched, setAdWatched] = useState(false);
  const [showMandatoryAd, setShowMandatoryAd] = useState(false);
  const [showAdFreeModal, setShowAdFreeModal] = useState(false);

  const { handleGameOver } = useGameOverHandler({
    level,
    coins,
    highScore,
    setGameState,
    setScore,
    setIsPausedForRevive,
    setShowContinueButton,
    setAdWatched,
    setShowMandatoryAd,
    setCoins,
    setHighScore,
    setLives,
    setLevel,
    setReviveUsed
  });

  const { handleCollision, resetCollisionLock } = useCollisionHandler({
    reviveUsed,
    score,
    setGameState,
    setIsPausedForRevive,
    setShowContinueButton,
    setAdWatched,
    setShowMandatoryAd,
    onGameOver: handleGameOver
  });

  const { handleAdWatch } = useAdRewardHandler({
    coins,
    adWatched,
    isPausedForRevive,
    setShowContinueButton,
    setAdWatched,
    setCoins,
    setLives
  });

  const { handleContinueClick } = useContinueGame({
    continueGame,
    setShowContinueButton,
    setReviveUsed,
    setIsPausedForRevive,
    setAdWatched,
    setGameState,
    resetCollisionLock
  });

  const handleCoinEarned = useCallback((coinAmount: number) => {
    const newCoins = coins + coinAmount;
    setCoins(newCoins);
    localStorage.setItem('flappypi-coins', newCoins.toString());
  }, [coins, setCoins]);

  // Remove automatic mandatory ad handling
  const handleMandatoryAdWatch = useCallback(() => {
    console.log('Skipping mandatory ad - going straight to game over');
    resetCollisionLock();
    setShowMandatoryAd(false);
    handleGameOver(score);
  }, [setShowMandatoryAd, handleGameOver, score, resetCollisionLock]);

  // Reset all game event states for new game
  const resetGameEventStates = useCallback(() => {
    console.log('🔄 Resetting all game event states for new game');
    resetCollisionLock();
    setShowContinueButton(false);
    setIsPausedForRevive(false);
    setReviveUsed(false);
    setAdWatched(false);
    setShowMandatoryAd(false);
    setShowAdFreeModal(false);
  }, [resetCollisionLock]);

  return {
    handleCollision,
    handleGameOver,
    handleCoinEarned,
    handleAdWatch,
    showContinueButton,
    handleContinueClick,
    isPausedForRevive,
    reviveUsed,
    showMandatoryAd: false, // Disable mandatory ads
    showAdFreeModal,
    adSystem: { 
      isAdFree: true, // Always ad-free to prevent issues
      purchaseAdFree: () => Promise.resolve(true),
      adFreeTimeRemaining: null,
      resetAdCounter: () => {},
      incrementGameCount: () => {}
    },
    handleMandatoryAdWatch,
    setShowAdFreeModal,
    resetGameEventStates
  };
};
