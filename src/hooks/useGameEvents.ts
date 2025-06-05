
import { useCallback, useState, useRef } from 'react';
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
  
  // Use refs to prevent React state queue issues
  const stateRef = useRef({
    showContinueButton: false,
    isPausedForRevive: false,
    reviveUsed: false,
    adWatched: false,
    showMandatoryAd: false,
    showAdFreeModal: false
  });

  // State getters
  const getState = useCallback(() => stateRef.current, []);
  const setState = useCallback((updates: Partial<typeof stateRef.current>) => {
    stateRef.current = { ...stateRef.current, ...updates };
  }, []);

  const { handleGameOver } = useGameOverHandler({
    level,
    coins,
    highScore,
    setGameState,
    setScore,
    setIsPausedForRevive: (paused) => setState({ isPausedForRevive: paused }),
    setShowContinueButton: (show) => setState({ showContinueButton: show }),
    setAdWatched: (watched) => setState({ adWatched: watched }),
    setShowMandatoryAd: (show) => setState({ showMandatoryAd: show }),
    setCoins,
    setHighScore,
    setLives,
    setLevel,
    setReviveUsed: (used) => setState({ reviveUsed: used })
  });

  const { handleCollision, resetCollisionLock } = useCollisionHandler({
    reviveUsed: getState().reviveUsed,
    score,
    setGameState,
    setIsPausedForRevive: (paused) => setState({ isPausedForRevive: paused }),
    setShowContinueButton: (show) => setState({ showContinueButton: show }),
    setAdWatched: (watched) => setState({ adWatched: watched }),
    setShowMandatoryAd: (show) => setState({ showMandatoryAd: show }),
    onGameOver: handleGameOver
  });

  const { handleAdWatch } = useAdRewardHandler({
    coins,
    adWatched: getState().adWatched,
    isPausedForRevive: getState().isPausedForRevive,
    setShowContinueButton: (show) => setState({ showContinueButton: show }),
    setAdWatched: (watched) => setState({ adWatched: watched }),
    setCoins,
    setLives
  });

  const { handleContinueClick } = useContinueGame({
    continueGame,
    setShowContinueButton: (show) => setState({ showContinueButton: show }),
    setReviveUsed: (used) => setState({ reviveUsed: used }),
    setIsPausedForRevive: (paused) => setState({ isPausedForRevive: paused }),
    setAdWatched: (watched) => setState({ adWatched: watched }),
    setGameState,
    resetCollisionLock
  });

  const handleCoinEarned = useCallback((coinAmount: number) => {
    const newCoins = coins + coinAmount;
    setCoins(newCoins);
    localStorage.setItem('flappypi-coins', newCoins.toString());
  }, [coins, setCoins]);

  const handleMandatoryAdWatch = useCallback(() => {
    console.log('Skipping mandatory ad - going straight to game over');
    resetCollisionLock();
    setState({ showMandatoryAd: false });
    handleGameOver(score);
  }, [handleGameOver, score, resetCollisionLock, setState]);

  // Complete reset for new game start
  const resetGameEventStates = useCallback(() => {
    console.log('🔄 Complete reset of all game event states for fresh start');
    resetCollisionLock();
    stateRef.current = {
      showContinueButton: false,
      isPausedForRevive: false,
      reviveUsed: false,
      adWatched: false,
      showMandatoryAd: false,
      showAdFreeModal: false
    };
  }, [resetCollisionLock]);

  return {
    handleCollision,
    handleGameOver,
    handleCoinEarned,
    handleAdWatch,
    showContinueButton: getState().showContinueButton,
    handleContinueClick,
    isPausedForRevive: getState().isPausedForRevive,
    reviveUsed: getState().reviveUsed,
    showMandatoryAd: false, // Always disabled
    showAdFreeModal: getState().showAdFreeModal,
    adSystem: { 
      isAdFree: true,
      purchaseAdFree: () => Promise.resolve(true),
      adFreeTimeRemaining: null,
      resetAdCounter: () => {},
      incrementGameCount: () => {}
    },
    handleMandatoryAdWatch,
    setShowAdFreeModal: (show: boolean) => setState({ showAdFreeModal: show }),
    resetGameEventStates
  };
};
