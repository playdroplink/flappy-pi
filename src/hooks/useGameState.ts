
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

type GameMode = 'classic' | 'endless' | 'challenge';
type GameStateType = 'menu' | 'playing' | 'gameOver' | 'paused';

export const useGameState = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [gameState, setGameState] = useState<GameStateType>('menu');
  const [gameMode, setGameMode] = useState<GameMode>('classic');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(1);
  const [highScore, setHighScore] = useState(0);
  const [selectedBirdSkin, setSelectedBirdSkin] = useState('default');
  const [coins, setCoins] = useState(0); // Changed from 100 to 0
  const [musicEnabled, setMusicEnabled] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved data from localStorage
    const savedHighScore = localStorage.getItem('flappypi-highscore');
    const savedCoins = localStorage.getItem('flappypi-coins');
    const savedSkin = localStorage.getItem('flappypi-skin');
    const savedMusic = localStorage.getItem('flappypi-music');
    
    if (savedHighScore) setHighScore(parseInt(savedHighScore));
    if (savedCoins) setCoins(parseInt(savedCoins));
    if (savedSkin) setSelectedBirdSkin(savedSkin);
    if (savedMusic) setMusicEnabled(savedMusic === 'true');

    // Hide splash screen after 3 seconds and show welcome
    const timer = setTimeout(() => {
      setShowSplash(false);
      setShowWelcome(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const startGame = (mode: GameMode) => {
    console.log('Starting game with mode:', mode);
    setGameMode(mode);
    setGameState('playing');
    setScore(0);
    setLevel(1);
    setLives(1);
    setShowWelcome(false);
  };

  const backToMenu = () => {
    setGameState('menu');
    setShowWelcome(true);
  };

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
    showSplash,
    showWelcome,
    gameState,
    gameMode,
    score,
    level,
    lives,
    highScore,
    selectedBirdSkin,
    coins,
    musicEnabled,
    setGameState,
    setScore,
    setLevel,
    setLives,
    setHighScore,
    setSelectedBirdSkin,
    setCoins,
    setMusicEnabled,
    startGame,
    backToMenu,
    handleScoreUpdate,
    toast
  };
};
