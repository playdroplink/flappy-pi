
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

type GameMode = 'menu' | 'classic' | 'endless' | 'challenge';
type GameStateType = 'menu' | 'playing' | 'gameOver' | 'paused';

export const useGameState = () => {
  // Core game state
  const [gameMode, setGameMode] = useState<GameMode>('menu');
  const [gameState, setGameState] = useState<GameStateType>('menu');
  const [showSplash, setShowSplash] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  
  // Game data
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(1);
  const [highScore, setHighScore] = useState(0);
  const [coins, setCoins] = useState(() => {
    const saved = localStorage.getItem('flappypi-coins');
    return saved ? parseInt(saved) : 0;
  });
  
  // Settings
  const [musicEnabled, setMusicEnabled] = useState(() => {
    const saved = localStorage.getItem('flappypi-music-enabled');
    return saved ? JSON.parse(saved) : true;
  });
  const [selectedBirdSkin, setSelectedBirdSkin] = useState(() => {
    const saved = localStorage.getItem('flappypi-skin');
    return saved || 'default';
  });

  const { toast } = useToast();

  // Initialize splash screen behavior
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      setShowWelcome(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Load saved high score
  useEffect(() => {
    const savedHighScore = localStorage.getItem('flappypi-highscore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  // Save settings to localStorage
  const onToggleMusic = useCallback((enabled: boolean) => {
    setMusicEnabled(enabled);
    localStorage.setItem('flappypi-music-enabled', JSON.stringify(enabled));
  }, []);

  const handleScoreUpdate = useCallback((newScore: number) => {
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
  }, [level, toast]);

  const onStartGame = useCallback((mode: 'classic' | 'endless' | 'challenge') => {
    console.log('🎮 Starting game mode:', mode);
    setGameMode(mode);
    setGameState('playing');
    setShowWelcome(false);
    setScore(0);
    setLevel(1);
    setLives(1);
  }, []);

  const startGame = onStartGame; // Alias for compatibility

  const backToMenu = useCallback(() => {
    setGameState('menu');
    setGameMode('menu');
    setShowWelcome(true);
    setScore(0);
    setLevel(1);
    setLives(1);
  }, []);

  const onOpenShop = useCallback(() => {
    console.log('🛍️ Opening shop');
    // Shop modal logic would be handled by the parent component
  }, []);

  const onOpenLeaderboard = useCallback(() => {
    console.log('🏆 Opening leaderboard');
    // Leaderboard modal logic would be handled by the parent component
  }, []);

  const onOpenPrivacy = useCallback(() => {
    console.log('📄 Opening privacy policy');
    window.open('/privacy', '_blank');
  }, []);

  const onOpenTerms = useCallback(() => {
    console.log('📜 Opening terms of service');
    window.open('/terms', '_blank');
  }, []);

  const onOpenContact = useCallback(() => {
    console.log('📧 Opening contact');
    window.open('mailto:support@flappypi.com', '_blank');
  }, []);

  const onOpenHelp = useCallback(() => {
    console.log('❓ Opening help');
    // Help modal logic would be handled by the parent component
  }, []);

  const onOpenTutorial = useCallback(() => {
    console.log('📚 Opening tutorial');
    // Tutorial modal logic would be handled by the parent component
  }, []);

  return {
    // Game state
    gameMode,
    gameState,
    showSplash,
    showWelcome,
    
    // Game data
    score,
    level,
    lives,
    highScore,
    coins,
    
    // Settings
    musicEnabled,
    selectedBirdSkin,
    
    // Setters
    setGameState,
    setScore,
    setLevel,
    setLives,
    setHighScore,
    setCoins,
    setMusicEnabled,
    setSelectedBirdSkin,
    
    // Handlers
    handleScoreUpdate,
    onToggleMusic,
    onStartGame,
    startGame, // Alias for compatibility
    backToMenu,
    onOpenShop,
    onOpenLeaderboard,
    onOpenPrivacy,
    onOpenTerms,
    onOpenContact,
    onOpenHelp,
    onOpenTutorial
  };
};
