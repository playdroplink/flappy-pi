
import { useToast } from '@/hooks/use-toast';
import { useRef } from 'react';

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
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const handleCollision = () => {
    console.log('Collision handled, setting game over');
    setGameState('gameOver');
    handleGameOver(score);
  };

  const handleGameOver = (finalScore: number) => {
    console.log('Game over with score:', finalScore);
    setGameState('gameOver');
    setScore(finalScore);
    
    // Add coins based on score and level (already earned during gameplay)
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

  const handleAdWatch = (adType: 'continue' | 'coins' | 'life') => {
    switch (adType) {
      case 'continue':
        // Clear any existing countdown
        if (countdownRef.current) {
          clearTimeout(countdownRef.current);
        }

        // Start the countdown with proper state management
        let countdown = 3;
        
        const runCountdown = () => {
          if (countdown > 0) {
            console.log('Countdown:', countdown);
            toast({
              title: `Get Ready! ${countdown}`,
              description: "Prepare to continue flying!"
            });
            countdown--;
            
            // Schedule next countdown or continue game
            countdownRef.current = setTimeout(() => {
              if (countdown === 0) {
                // Countdown finished, continue the game
                setLives(1);
                if (continueGame) {
                  console.log('Countdown finished, continuing game');
                  continueGame();
                }
                setGameState('playing');
                toast({
                  title: "Continue! 🚀",
                  description: "Thanks for watching the Pi Ad! Keep flying!"
                });
              } else {
                runCountdown();
              }
            }, 1000);
          }
        };
        
        // Start the countdown
        runCountdown();
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
    }
  };

  return {
    handleCollision,
    handleGameOver,
    handleCoinEarned,
    handleAdWatch
  };
};
