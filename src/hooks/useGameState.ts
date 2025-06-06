
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
    // Hide splash screen after 3 seconds and show welcome
    const timer = setTimeout(() => {
      setShowSplash(false);
      setShowWelcome(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const startGame = (mode: GameMode) => {
    console.log('Starting completely new game with mode:', mode);
    
    // Force complete state reset
    setGameMode(mode);
    gameData.setScore(0);
    gameData.setLevel(1);
    gameData.setLives(1);
    setGameState('menu'); // Set to menu first
    setShowWelcome(false);
    
    // No auto-fullscreen for mobile games - let users play in browser
    
    // Use a longer delay to ensure complete state reset
    setTimeout(() => {
      setGameState('playing');
      console.log('Game state set to playing after reset');
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
