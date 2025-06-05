
import { useCallback, useRef } from 'react';
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
  
  // FIXED: Use refs instead of useState to prevent React queue errors
  const showContinueButtonRef = useRef(false);
  const isPausedForReviveRef = useRef(false);
  const reviveUsedRef = useRef(false);
  const adWatchedRef = useRef(false);
  const showMandatoryAdRef = useRef(false);
  const showAdFreeModalRef = useRef(false);

  // Getters for current values
  const showContinueButton = showContinueButtonRef.current;
  const isPausedForRevive = isPausedForReviveRef.current;
  const reviveUsed = reviveUsedRef.current;
  const adWatched = adWatchedRef.current;
  const showMandatoryAd = showMandatoryAdRef.current;
  const showAdFreeModal = showAdFreeModalRef.current;

  // Setters that update refs
  const setShowContinueButton = useCallback((show: boolean) => {
    showContinueButtonRef.current = show;
  }, []);

  const setIsPausedForRevive = useCallback((paused: boolean) => {
    isPausedForReviveRef.current = paused;
  }, []);

  const setReviveUsed = useCallback((used: boolean) => {
    reviveUsedRef.current = used;
  }, []);

  const setAdWatched = useCallback((watched: boolean) => {
    adWatchedRef.current = watched;
  }, []);

  const setShowMandatoryAd = useCallback((show: boolean) => {
    showMandatoryAdRef.current = show;
  }, []);

  const setShowAdFreeModal = useCallback((show: boolean) => {
    showAdFreeModalRef.current = show;
  }, []);

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

  const handleMandatoryAdWatch = useCallback(() => {
    console.log('Skipping mandatory ad - direct to game over');
    resetCollisionLock();
    setShowMandatoryAd(false);
    handleGameOver(score);
  }, [handleGameOver, score, resetCollisionLock, setShowMandatoryAd]);

  // MASTER RESET - Fixes all restart issues
  const resetGameEventStates = useCallback(() => {
    console.log('🔄 MASTER RESET - Clearing all game event states');
    
    // Reset collision system
    resetCollisionLock();
    
    // Reset ALL UI states using refs
    showContinueButtonRef.current = false;
    isPausedForReviveRef.current = false;
    reviveUsedRef.current = false;
    adWatchedRef.current = false;
    showMandatoryAdRef.current = false;
    showAdFreeModalRef.current = false;
    
    console.log('✅ All game event states cleared for fresh start');
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
    showMandatoryAd: false, // Always disabled
    showAdFreeModal,
    adSystem: { 
      isAdFree: true,
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
