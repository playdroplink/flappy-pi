import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useIsMobile } from '@/hooks/use-mobile';
import { useGameSettings } from '@/hooks/useGameSettings';
import { useFullscreen } from '@/hooks/useFullscreen';
import { useGameData } from '@/hooks/useGameData';

type GameMode = 'classic' | 'endless' | 'challenge';
type GameStateType = 'menu' | 'playing' | 'gameOver' | 'paused';

export const useGameState = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [gameState, setGameState] = useState<GameStateType>('menu');
  const [gameMode, setGameMode] = useState<GameMode>('classic');
  const { toast } = useToast();
  const { profile } = useUserProfile();
  const isMobile = useIsMobile();
  
  // Use the smaller hooks
  const gameSettings = useGameSettings();
  const fullscreen = useFullscreen();
  const gameData = useGameData();

  useEffect(() => {
    // Hide splash screen after 1 second and show welcome
    const timer = setTimeout(() => {
      setShowSplash(false);
      setShowWelcome(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const startGame = (mode: GameMode) => {
    console.log('Starting game with mode:', mode);
    
    // Set the game mode first
    setGameMode(mode);
    
    // Complete state reset for new game
    gameData.setScore(0);
    gameData.setLevel(1);
    gameData.setLives(1);
    setGameState('menu'); // Set to menu first for clean transition
    setShowWelcome(false);
    
    // Show mode-specific toast
    const modeMessages = {
      classic: "🎯 Classic Mode: Standard difficulty progression!",
      endless: "🚀 Endless Mode: Continuous challenge awaits!",
      challenge: "⚡ Challenge Mode: Maximum difficulty from start!"
    };
    
    toast({
      title: `${mode.charAt(0).toUpperCase() + mode.slice(1)} Mode Started!`,
      description: modeMessages[mode]
    });
    
    // Delay transition to playing state
    setTimeout(() => {
      setGameState('playing');
      console.log(`${mode} mode game state set to playing`);
    }, 200);
  };

  const backToMenu = () => {
    console.log('Returning to menu - complete game reset');
    
    // Exit fullscreen when returning to menu (only if currently in fullscreen)
    if (fullscreen.isFullscreen) {
      fullscreen.exitFullscreen();
    }
    
    // Complete state reset
    setGameState('menu');
    setGameMode('classic'); // Reset to default mode
    gameData.setScore(0);
    gameData.setLevel(1);
    gameData.setLives(1);
    setShowWelcome(true);
  };

  return {
    showSplash,
    showWelcome,
    gameState,
    gameMode,
    profile,
    setGameState,
    startGame,
    backToMenu,
    toast,
    // Expose all the properties from the smaller hooks
    ...gameData,
    ...gameSettings,
    ...fullscreen
  };
};
