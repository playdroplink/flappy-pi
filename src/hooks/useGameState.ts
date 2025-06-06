import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const [coins, setCoins] = useState(0);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { toast } = useToast();
  const { profile, updateProfile } = useUserProfile();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Load saved data from localStorage (fallback)
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

  // Sync with user profile when available
  useEffect(() => {
    if (profile) {
      setCoins(profile.total_coins);
      setSelectedBirdSkin(profile.selected_bird_skin);
      setMusicEnabled(profile.music_enabled);
      
      // Update localStorage to match profile
      localStorage.setItem('flappypi-coins', profile.total_coins.toString());
      localStorage.setItem('flappypi-skin', profile.selected_bird_skin);
      localStorage.setItem('flappypi-music', profile.music_enabled.toString());
    }
  }, [profile]);

  const enterFullscreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
        toast({
          title: "Fullscreen Mode Activated! 🎮",
          description: "Enjoy the immersive gaming experience!"
        });
      }
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
      toast({
        title: "Fullscreen Failed",
        description: "Your browser doesn't support fullscreen mode",
        variant: "destructive"
      });
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Failed to exit fullscreen:', error);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const startGame = (mode: GameMode) => {
    console.log('Starting completely new game with mode:', mode);
    
    // Force complete state reset
    setGameMode(mode);
    setScore(0);
    setLevel(1);
    setLives(1);
    setGameState('menu'); // Set to menu first
    setShowWelcome(false);
    
    // Auto-enter fullscreen only on mobile devices
    if (!isFullscreen && isMobile) {
      enterFullscreen();
    }
    
    // Use a longer delay to ensure complete state reset
    setTimeout(() => {
      setGameState('playing');
      console.log('Game state set to playing after reset');
    }, 200);
  };

  const backToMenu = () => {
    console.log('Returning to menu - complete game reset');
    
    // Exit fullscreen when returning to menu (only if currently in fullscreen)
    if (isFullscreen) {
      exitFullscreen();
    }
    
    // Complete state reset
    setGameState('menu');
    setScore(0);
    setLevel(1);
    setLives(1);
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

  // Update bird skin and sync with backend
  const updateBirdSkin = async (skin: string) => {
    setSelectedBirdSkin(skin);
    localStorage.setItem('flappypi-skin', skin);
    
    // Update in backend if profile exists
    if (profile) {
      await updateProfile({ selected_bird_skin: skin });
    }
  };

  // Update music setting and sync with backend
  const updateMusicEnabled = async (enabled: boolean) => {
    setMusicEnabled(enabled);
    localStorage.setItem('flappypi-music', enabled.toString());
    
    // Update in backend if profile exists
    if (profile) {
      await updateProfile({ music_enabled: enabled });
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
    isFullscreen,
    profile,
    setGameState,
    setScore,
    setLevel,
    setLives,
    setHighScore,
    setSelectedBirdSkin: updateBirdSkin,
    setCoins,
    setMusicEnabled: updateMusicEnabled,
    startGame,
    backToMenu,
    handleScoreUpdate,
    enterFullscreen,
    exitFullscreen,
    toast
  };
};
