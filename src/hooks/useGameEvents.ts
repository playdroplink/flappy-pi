
import { useToast } from '@/hooks/use-toast';
import { useRef, useCallback, useState } from 'react';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { gameBackendService } from '@/services/gameBackendService';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAdSystem } from '@/hooks/useAdSystem';

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
  const { submitScore } = useLeaderboard();
  const { profile, refreshProfile } = useUserProfile();
  const adSystem = useAdSystem();
  
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [isPausedForRevive, setIsPausedForRevive] = useState(false);
  const [reviveUsed, setReviveUsed] = useState(false);
  const [adWatched, setAdWatched] = useState(false);
  const [showMandatoryAd, setShowMandatoryAd] = useState(false);
  const [showAdFreeModal, setShowAdFreeModal] = useState(false);
  
  // Prevent multiple collision calls
  const collisionHandledRef = useRef(false);

  const handleCollision = useCallback(() => {
    // Prevent multiple collision handling
    if (collisionHandledRef.current) {
      console.log('Collision already handled, ignoring');
      return;
    }
    
    collisionHandledRef.current = true;
    console.log('Collision detected - checking ad system');
    
    // Reset collision flag after delay to allow new games
    setTimeout(() => {
      collisionHandledRef.current = false;
    }, 1000);
    
    // Check if user can continue without ad (Premium subscription)
    if (adSystem.canContinueWithoutAd && !reviveUsed) {
      console.log('User has Premium - allowing continue without ad');
      setIsPausedForRevive(true);
      setGameState('paused');
      setShowContinueButton(true);
      setAdWatched(false);
      return;
    }
    
    // Check if this is a mandatory ad game over
    if (adSystem.shouldShowMandatoryAd) {
      console.log('Showing mandatory ad');
      setShowMandatoryAd(true);
      setGameState('paused');
      return;
    }
    
    // Normal revive flow (optional ad)
    if (!reviveUsed) {
      setIsPausedForRevive(true);
      setGameState('paused');
      setAdWatched(false);
      setShowContinueButton(false);
    } else {
      handleGameOver(score);
    }
  }, [adSystem.canContinueWithoutAd, adSystem.shouldShowMandatoryAd, reviveUsed, score, setGameState]);

  const handleGameOver = useCallback(async (finalScore: number) => {
    console.log('Game over with final score:', finalScore);
    
    // Reset collision flag
    collisionHandledRef.current = false;
    
    // Increment game count for ad system
    adSystem.incrementGameCount();
    
    setGameState('gameOver');
    setScore(finalScore);
    setIsPausedForRevive(false);
    setShowContinueButton(false);
    setAdWatched(false);
    setShowMandatoryAd(false);
    
    if (!profile) {
      console.warn('No user profile available for game over handling');
      return;
    }
    
    try {
      // Complete game session in backend
      const sessionResult = await gameBackendService.completeGameSession(
        profile.pi_user_id,
        'classic',
        finalScore,
        level,
        Math.floor(finalScore / 3) + (level * 2)
      );
      
      if (sessionResult) {
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

    // Submit score to leaderboard
    if (finalScore > 0 && profile) {
      try {
        await submitScore(profile.pi_user_id, profile.username, finalScore);
      } catch (error) {
        console.error('Failed to submit score:', error);
      }
    }

    // Reset for next game
    setLives(1);
    setLevel(1);
    setReviveUsed(false);
  }, [adSystem, setGameState, setScore, setIsPausedForRevive, setShowContinueButton, setAdWatched, setShowMandatoryAd, profile, level, setCoins, coins, setHighScore, highScore, toast, refreshProfile, submitScore, setLives, setLevel]);

  const handleCoinEarned = useCallback((coinAmount: number) => {
    const newCoins = coins + coinAmount;
    setCoins(newCoins);
    localStorage.setItem('flappypi-coins', newCoins.toString());
  }, [coins, setCoins]);

  const handleContinueClick = useCallback(() => {
    console.log('Continue button clicked - resuming game');
    setShowContinueButton(false);
    setReviveUsed(true);
    setIsPausedForRevive(false);
    setAdWatched(false);
    
    if (continueGame) {
      continueGame();
    }
    
    setGameState('playing');
    
    toast({
      title: "Welcome Back! 🚀",
      description: "Continue your flight and reach new heights!",
      duration: 2000
    });
  }, [continueGame, setGameState, toast]);

  const handleMandatoryAdWatch = useCallback(() => {
    console.log('Mandatory ad watched - resetting counter and ending game');
    adSystem.resetAdCounter();
    setShowMandatoryAd(false);
    handleGameOver(score);
  }, [adSystem, setShowMandatoryAd, handleGameOver, score]);

  const handleAdWatch = useCallback(async (adType: 'continue' | 'coins' | 'life') => {
    if (!profile) {
      console.warn('No user profile available for ad reward');
      return;
    }

    try {
      switch (adType) {
        case 'continue':
          if (!adWatched && isPausedForRevive) {
            console.log('Ad watched - showing continue button');
            setShowContinueButton(true);
            setAdWatched(true);
            
            await gameBackendService.watchAdReward(profile.pi_user_id, 'continue', 0);
          }
          break;
          
        case 'coins':
          const coinsResult = await gameBackendService.watchAdReward(profile.pi_user_id, 'coins', 25);
          if (coinsResult) {
            setCoins(coins + coinsResult.reward_amount);
            localStorage.setItem('flappypi-coins', (coins + coinsResult.reward_amount).toString());
            await refreshProfile();
            toast({
              title: "Bonus Pi Coins! 🪙",
              description: `You earned ${coinsResult.reward_amount} Pi coins!`
            });
          }
          break;
          
        case 'life':
          await gameBackendService.watchAdReward(profile.pi_user_id, 'life', 0);
          setLives(1);
          toast({
            title: "Extra Life! ❤️",
            description: "You earned an extra life!"
          });
          break;
      }
    } catch (error) {
      console.error('Error handling ad watch:', error);
      if (adType === 'coins') {
        const bonusCoins = 25;
        setCoins(coins + bonusCoins);
        localStorage.setItem('flappypi-coins', (coins + bonusCoins).toString());
        toast({
          title: "Bonus Pi Coins! 🪙",
          description: `You earned ${bonusCoins} Pi coins!`
        });
      }
    }
  }, [profile, adWatched, isPausedForRevive, setShowContinueButton, setAdWatched, coins, setCoins, refreshProfile, toast, setLives]);

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
    adSystem,
    handleMandatoryAdWatch,
    setShowAdFreeModal
  };
};
