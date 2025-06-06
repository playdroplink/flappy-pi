
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUserProfile } from '@/hooks/useUserProfile';

export const useGameData = () => {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(1);
  const [highScore, setHighScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const { toast } = useToast();
  const { profile } = useUserProfile();

  useEffect(() => {
    // Load saved data from localStorage (fallback)
    const savedHighScore = localStorage.getItem('flappypi-highscore');
    const savedCoins = localStorage.getItem('flappypi-coins');
    
    if (savedHighScore) setHighScore(parseInt(savedHighScore));
    if (savedCoins) setCoins(parseInt(savedCoins));
  }, []);

  // Sync with user profile when available
  useEffect(() => {
    if (profile) {
      setCoins(profile.total_coins);
      
      // Update localStorage to match profile
      localStorage.setItem('flappypi-coins', profile.total_coins.toString());
    }
  }, [profile]);

  const handleScoreUpdate = (newScore: number) => {
    console.log('Score updated to:', newScore);
    setScore(newScore);
    // Level up every 5 points for better progression
    const newLevel = Math.floor(newScore / 5) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      toast({
        title: `Level ${newLevel}! 🎯`,
        description: "Getting harder now!"
      });
    }
  };

  return {
    score,
    level,
    lives,
    highScore,
    coins,
    setScore,
    setLevel,
    setLives,
    setHighScore,
    setCoins,
    handleScoreUpdate
  };
};
