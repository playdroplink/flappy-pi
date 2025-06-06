
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
  
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [isPausedForRevive, setIsPausedForRevive] = useState(false);
  const [reviveUsed, setReviveUsed] = useState(false);
  const [adWatched, setAdWatched] = useState(false);
  const [showMandatoryAd, setShowMandatoryAd] = useState(false);
  const [showAdFreeModal, setShowAdFreeModal] = useState(false);

  // Create a simple collision lock mechanism
  const collisionLockRef = useRef(false);
  
  const resetCollisionLock = useCallback(() => {
    collisionLockRef.current = false;
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

  const handleCollision = useCallback(() => {
    if (collisionLockRef.current) return;
    collisionLockRef.current = true;
    
    console.log('💥 Collision detected - processing');
    
    if (!reviveUsed) {
      console.log('🎯 First collision - offering revive');
      setIsPausedForRevive(true);
      setShowContinueButton(false);
      setAdWatched(false);
      setShowMandatoryAd(false);
      setGameState('paused');
    } else {
      console.log('🔚 Second collision - game over');
      handleGameOver(score);
    }
  }, [reviveUsed, score, handleGameOver, setGameState]);

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
    console.log('Mandatory ad watched - going to game over');
    resetCollisionLock();
    setShowMandatoryAd(false);
    setIsPausedForRevive(false);
    handleGameOver(score);
  }, [handleGameOver, score, resetCollisionLock]);

  const resetGameEventStates = useCallback(() => {
    console.log('🔄 Complete reset of all game event states for fresh start');
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
    showMandatoryAd,
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
