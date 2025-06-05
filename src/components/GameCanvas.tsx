
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useGameLoop } from '../hooks/useGameLoop';
import { useGamePhysics } from '../hooks/useGamePhysics';
import { useGameRenderer } from '../hooks/useGameRenderer';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';

interface GameCanvasProps {
  gameState: 'menu' | 'playing' | 'gameOver' | 'paused';
  gameMode: 'classic' | 'endless' | 'challenge';
  level: number;
  onCollision: () => void;
  onGameOver: (score: number) => void;
  onScoreUpdate: (score: number) => void;
  onCoinEarned: (coins: number) => void;
  birdSkin: string;
  musicEnabled: boolean;
  onContinueGameRef?: (fn: () => void) => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({
  gameState,
  gameMode,
  level,
  onCollision,
  onGameOver,
  onScoreUpdate,
  onCoinEarned,
  birdSkin,
  musicEnabled,
  onContinueGameRef
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number>();
  const [canvasReady, setCanvasReady] = useState(false);
  const previousGameStateRef = useRef(gameState);
  const inputHandlersAttachedRef = useRef(false);

  useBackgroundMusic({ musicEnabled, gameState });

  const { gameStateRef, resetGame, continueGame, jump, checkCollisions } = useGameLoop({
    gameState,
    onCollision,
    onScoreUpdate
  });

  const { updateGame } = useGamePhysics({
    gameStateRef,
    onScoreUpdate,
    onCoinEarned,
    checkCollisions,
    onCollision,
    gameMode
  });

  const { draw } = useGameRenderer({ 
    canvasRef, 
    gameStateRef, 
    birdSkin,
    gameMode 
  });

  // IMPROVED GAME LOOP - Better performance and error handling
  const gameLoop = useCallback(() => {
    try {
      // Always render to prevent blank screen
      draw();
      
      // Run physics only when playing and ready
      if (gameState === 'playing' && 
          canvasReady && 
          gameStateRef.current?.canvasReady && 
          gameStateRef.current?.isInitialized &&
          !gameStateRef.current?.gameOver) {
        updateGame();
      }
      
      // Continue loop if playing
      if (gameState === 'playing') {
        gameLoopRef.current = requestAnimationFrame(gameLoop);
      }
      
    } catch (error) {
      console.error('❌ Game loop error:', error);
      // Stop loop on critical error
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = undefined;
      }
    }
  }, [updateGame, draw, gameState, canvasReady, gameStateRef]);

  // Expose continue function for ads/revive
  useEffect(() => {
    if (onContinueGameRef) {
      onContinueGameRef(continueGame);
    }
  }, [continueGame, onContinueGameRef]);

  // FIXED INPUT HANDLING - Proper cleanup and attachment
  useEffect(() => {
    const handleInput = (e: MouseEvent | TouchEvent | KeyboardEvent) => {
      e.preventDefault();
      if (gameState === 'playing' && gameStateRef.current?.isInitialized) {
        console.log('🎯 Input detected - attempting jump');
        jump();
      }
    };
    
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        handleInput(e);
      }
    };

    // Clean up existing listeners first
    if (inputHandlersAttachedRef.current) {
      document.removeEventListener('click', handleInput);
      document.removeEventListener('touchstart', handleInput);
      document.removeEventListener('keydown', handleKeyPress);
      inputHandlersAttachedRef.current = false;
    }

    // Add new listeners
    document.addEventListener('click', handleInput, { passive: false });
    document.addEventListener('touchstart', handleInput, { passive: false });
    document.addEventListener('keydown', handleKeyPress);
    inputHandlersAttachedRef.current = true;

    console.log('🎮 Input handlers attached for game state:', gameState);

    return () => {
      // CRITICAL: Always cleanup listeners
      document.removeEventListener('click', handleInput);
      document.removeEventListener('touchstart', handleInput);
      document.removeEventListener('keydown', handleKeyPress);
      inputHandlersAttachedRef.current = false;
    };
  }, [jump, gameState, gameStateRef]);

  // CANVAS INITIALIZATION - Improved reliability
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const initializeCanvas = () => {
      try {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        console.log('🖥️ Canvas initialized:', canvas.width, 'x', canvas.height);
        setCanvasReady(true);
      } catch (error) {
        console.error('❌ Canvas init error:', error);
        setTimeout(initializeCanvas, 100);
      }
    };

    initializeCanvas();
    window.addEventListener('resize', initializeCanvas);

    return () => {
      window.removeEventListener('resize', initializeCanvas);
    };
  }, []);

  // MASTER STATE MANAGEMENT - Fixed for all modes
  useEffect(() => {
    const prevState = previousGameStateRef.current;
    previousGameStateRef.current = gameState;

    const handleStateChange = async () => {
      // Stop any existing game loop
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = undefined;
      }

      if (gameState === 'playing' && canvasReady) {
        if (prevState !== 'playing') {
          // FRESH START - Complete reset
          console.log('🎮 FRESH START - Resetting everything');
          
          try {
            await resetGame();
            
            // Start game loop after reset with delay
            setTimeout(() => {
              if (gameState === 'playing' && canvasReady) {
                console.log('🚀 Starting game loop after reset');
                gameLoopRef.current = requestAnimationFrame(gameLoop);
              }
            }, 150);
            
          } catch (error) {
            console.error('❌ Game start error:', error);
          }
          
        } else {
          // RESUME - Just restart loop
          console.log('▶️ Resuming game loop');
          gameLoopRef.current = requestAnimationFrame(gameLoop);
        }
      }
    };

    handleStateChange();

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = undefined;
      }
    };
  }, [gameState, canvasReady, gameLoop, resetGame]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full bg-gradient-to-b from-sky-400 to-sky-600 touch-none cursor-pointer"
      style={{ 
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        zIndex: 10
      }}
    />
  );
};

export default GameCanvas;
