
import { useToast } from '@/hooks/use-toast';
import { useRef, useCallback } from 'react';

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
  const isCountingDownRef = useRef(false);

  const handleCollision = () => {
    console.log('Collision handled, setting game over');
    setGameState('gameOver');
    handleGameOver(score);
  };

  const handleGameOver = (finalScore: number) => {
    console.log('Game over with score:', finalScore);
    setGameState('gameOver');
    setScore(finalScore);
    
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
  };

  const handleCoinEarned = (coinAmount: number) => {
    const newCoins = coins + coinAmount;
    setCoins(newCoins);
    localStorage.setItem('flappypi-coins', newCoins.toString());
  };

  const startContinueCountdown = useCallback(() => {
    if (isCountingDownRef.current) return; // Prevent multiple countdowns
    
    isCountingDownRef.current = true;
    let countdownValue = 3;

    const doCountdown = () => {
      if (countdownValue > 0) {
        console.log('Continue countdown:', countdownValue);
        toast({
          title: `Get Ready! ${countdownValue}`,
          description: "Prepare to continue flying!",
          duration: 1000
        });
        
        countdownValue--;
        countdownTimerRef.current = setTimeout(doCountdown, 1000);
      } else {
        // Countdown finished - continue the game
        console.log('Countdown finished, continuing game');
        isCountingDownRef.current = false;
        
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
          description: "Thanks for watching the Pi Ad! Keep flying!",
          duration: 2000
        });
      }
    };

    doCountdown();
  }, [continueGame, setLives, setGameState, toast]);

  const handleAdWatch = (adType: 'continue' | 'coins' | 'life') => {
    // Clear any existing countdown
    if (countdownTimerRef.current) {
      clearTimeout(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    isCountingDownRef.current = false;

    switch (adType) {
      case 'continue':
        console.log('Starting continue game process after ad watch');
        startContinueCountdown();
        break;
        
      case 'coins':
        const bonusCoins = 25;
        setCoins(coins + bonusCoins);
        localStorage.setItem('flappypi-coins', (coins + bonusCoins).toString());
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
  };

  return {
    handleCollision,
    handleGameOver,
    handleCoinEarned,
    handleAdWatch
  };
};
