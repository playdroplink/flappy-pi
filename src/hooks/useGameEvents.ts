
import { useToast } from '@/hooks/use-toast';
import { useRef, useCallback, useState } from 'react';

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
  const { toast } = useToast();
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [showContinueOverlay, setShowContinueOverlay] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showContinueButton, setShowContinueButton] = useState(false);

  const handleCollision = useCallback(() => {
    console.log('Collision detected, setting game over state');
    setGameState('gameOver');
  }, [setGameState]);

  const handleGameOver = useCallback((finalScore: number) => {
    console.log('Game over with final score:', finalScore);
    
    // Add coins based on score and level
    const earnedCoins = Math.floor(finalScore / 3) + (level * 2);
    const newCoins = coins + earnedCoins;
    setCoins(newCoins);
    localStorage.setItem('flappypi-coins', newCoins.toString());
    
    // Update high score
    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('flappypi-highscore', finalScore.toString());
      toast({
        title: "🎉 New High Score!",
        description: `Amazing! You scored ${finalScore} points!`
      });
    }

    // Reset for next game
    setLives(1);
    setLevel(1);
  }, [coins, level, highScore, setCoins, setHighScore, setLives, setLevel, toast]);

  const handleCoinEarned = useCallback((coinAmount: number) => {
    const newCoins = coins + coinAmount;
    setCoins(newCoins);
    localStorage.setItem('flappypi-coins', newCoins.toString());
  }, [coins, setCoins]);

  const startContinueCountdown = useCallback(() => {
    console.log('Starting continue countdown');
    
    // Clear any existing timer
    if (countdownTimerRef.current) {
      clearTimeout(countdownTimerRef.current);
    }
    
    setShowContinueOverlay(true);
    setShowContinueButton(false);
    setCountdown(3);

    const doCountdown = () => {
      setCountdown(prev => {
        const newCount = prev - 1;
        if (newCount > 0) {
          countdownTimerRef.current = setTimeout(doCountdown, 1000);
          return newCount;
        } else {
          // Countdown finished - show continue button
          setShowContinueButton(true);
          return 0;
        }
      });
    };

    countdownTimerRef.current = setTimeout(doCountdown, 1000);
  }, []);

  const handleContinueClick = useCallback(() => {
    console.log('Continue button clicked, resuming game');
    
    // Clear any timers
    if (countdownTimerRef.current) {
      clearTimeout(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    
    // Hide overlay
    setShowContinueOverlay(false);
    setShowContinueButton(false);
    setCountdown(0);
    
    // Reset bird and continue with current score
    setLives(1);
    
    // Continue the game with preserved score
    if (continueGame) {
      continueGame();
    }
    
    // Set game state to playing
    setGameState('playing');
    
    toast({
      title: "Continue! 🚀",
      description: "Keep flying and reach new heights!",
      duration: 2000
    });
  }, [continueGame, setLives, setGameState, toast]);

  const handleAdWatch = useCallback((adType: 'continue' | 'coins' | 'life') => {
    console.log('Ad watch completed for:', adType);
    
    // Clear any existing countdown
    if (countdownTimerRef.current) {
      clearTimeout(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }

    switch (adType) {
      case 'continue':
        console.log('Starting continue game process after ad watch');
        startContinueCountdown();
        break;
        
      case 'coins':
        const bonusCoins = 25;
        const newCoins = coins + bonusCoins;
        setCoins(newCoins);
        localStorage.setItem('flappypi-coins', newCoins.toString());
        toast({
          title: "Bonus Pi Coins! 🪙",
          description: `You earned ${bonusCoins} Pi coins!`
        });
        break;
        
      case 'life':
        setLives(1);
        toast({
          title: "Extra Life! ❤️",
          description: "You earned an extra life!"
        });
        break;
    }
  }, [coins, setCoins, setLives, startContinueCountdown, toast]);

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    if (countdownTimerRef.current) {
      clearTimeout(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
  }, []);

  return {
    handleCollision,
    handleGameOver,
    handleCoinEarned,
    handleAdWatch,
    showContinueOverlay,
    countdown,
    showContinueButton,
    handleContinueClick,
    cleanup
  };
};
