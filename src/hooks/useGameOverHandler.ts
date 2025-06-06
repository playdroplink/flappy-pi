
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { gameBackendService } from '@/services/gameBackendService';
import { useUserProfile } from '@/hooks/useUserProfile';
import { usePiAuth } from '@/hooks/usePiAuth';

interface UseGameOverHandlerProps {
  level: number;
  coins: number;
  highScore: number;
  setGameState: (state: 'menu' | 'playing' | 'gameOver' | 'paused') => void;
  setScore: (score: number) => void;
  setIsPausedForRevive: (paused: boolean) => void;
  setShowContinueButton: (show: boolean) => void;
  setAdWatched: (watched: boolean) => void;
  setShowMandatoryAd: (show: boolean) => void;
  setCoins: (coins: number) => void;
  setHighScore: (score: number) => void;
  setLives: (lives: number) => void;
  setLevel: (level: number) => void;
  setReviveUsed: (used: boolean) => void;
}

export const useGameOverHandler = ({
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
}: UseGameOverHandlerProps) => {
  const { toast } = useToast();
  const { submitScore } = useLeaderboard();
  const { profile, refreshProfile } = useUserProfile();
  const { user } = usePiAuth();

  const handleGameOver = useCallback(async (finalScore: number) => {
    console.log('Game over with final score:', finalScore);
    
    setGameState('gameOver');
    setScore(finalScore);
    setIsPausedForRevive(false);
    setShowContinueButton(false);
    setAdWatched(false);
    setShowMandatoryAd(false);
    
    if (!user || !profile) {
      console.warn('No authenticated Pi user or profile available for game over handling');
      return;
    }
    
    try {
      // Calculate session duration (estimate based on score)
      const estimatedDuration = Math.max(finalScore * 2, 30); // 2 seconds per point minimum 30 seconds
      
      // Complete game session in backend
      const sessionResult = await gameBackendService.completeGameSession(
        'classic',
        finalScore,
        level,
        Math.floor(finalScore / 3) + (level * 2),
        estimatedDuration
      );
      
      if (sessionResult) {
        // Update local state with backend results
        setCoins(sessionResult.total_coins);
        localStorage.setItem('flappypi-coins', sessionResult.total_coins.toString());
        
        if (sessionResult.is_high_score) {
          setHighScore(finalScore);
          localStorage.setItem('flappypi-highscore', finalScore.toString());
          toast({
            title: "🎉 New High Score!",
            description: `Amazing! You scored ${finalScore} points and earned ${sessionResult.coins_earned} coins!`
          });
        } else {
          toast({
            title: "Game Over! 🎮",
            description: `You scored ${finalScore} points and earned ${sessionResult.coins_earned} coins!`
          });
        }
        
        // Refresh user profile to get updated data
        await refreshProfile();
      }
    } catch (error) {
      console.error('Error handling game over:', error);
      // Fallback to local handling
      const earnedCoins = Math.floor(finalScore / 3) + (level * 2);
      const newCoins = coins + earnedCoins;
      setCoins(newCoins);
      localStorage.setItem('flappypi-coins', newCoins.toString());
      
      if (finalScore > highScore) {
        setHighScore(finalScore);
        localStorage.setItem('flappypi-highscore', finalScore.toString());
        toast({
          title: "🎉 New High Score!",
          description: `Amazing! You scored ${finalScore} points!`
        });
      }
    }

    // Submit score to leaderboard if it's a decent score (> 0)
    if (finalScore > 0 && user && profile) {
      try {
        await submitScore(user.uid, profile.username, finalScore);
      } catch (error) {
        console.error('Failed to submit score:', error);
      }
    }

    // Reset for next game
    setLives(1);
    setLevel(1);
    setReviveUsed(false);
  }, [setGameState, setScore, setIsPausedForRevive, setShowContinueButton, setAdWatched, setShowMandatoryAd, user, profile, level, setCoins, setHighScore, toast, refreshProfile, coins, highScore, submitScore, setLives, setLevel, setReviveUsed]);

  return {
    handleGameOver
  };
};
