
import { useToast } from '@/hooks/use-toast';

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
        // Start 3-second countdown and then continue
        let countdown = 3;
        
        const showCountdown = () => {
          if (countdown > 0) {
            toast({
              title: `Get Ready! ${countdown}`,
              description: "Prepare to continue flying!"
            });
            countdown--;
            setTimeout(showCountdown, 1000);
          } else {
            // Continue the game with current score preserved
            setLives(1);
            if (continueGame) {
              continueGame(); // Use the continue function instead of resetting
            }
            setGameState('playing');
            toast({
              title: "Continue! 🚀",
              description: "Thanks for watching the Pi Ad! Keep flying!"
            });
          }
        };
        
        // Start the countdown immediately
        showCountdown();
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
