import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useGameLoop } from '../hooks/useGameLoop';
import { useGamePhysics } from '../hooks/useGamePhysics';
import { useGameRenderer } from '../hooks/useGameRenderer';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';
import { useSoundEffects } from '../hooks/useSoundEffects';

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
  userDifficulty?: 'easy' | 'medium' | 'hard';
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
  onContinueGameRef,
  userDifficulty = 'medium'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number>();
  const inputHandlersRef = useRef<{
    handleClick?: (e: MouseEvent) => void;
    handleKeyPress?: (e: KeyboardEvent) => void;
  }>({});
  const gameInitializedRef = useRef(false); // Track initialization state

  useBackgroundMusic({ musicEnabled, gameState });
  
  const { initializeGameSounds, playWingFlap, playPoint, playHit, playDie } = useSoundEffects();

  const { gameStateRef, resetGame, continueGame, jump, checkCollisions } = useGameLoop({
    gameState,
    onCollision: () => {
      playHit();
      onCollision();
    },
    onScoreUpdate
  });

  const { updateGame } = useGamePhysics({
    gameStateRef,
    onScoreUpdate: (score) => {
      playPoint();
      onScoreUpdate(score);
    },
    onCoinEarned,
    checkCollisions,
    onCollision: () => {
      playDie();
      onCollision();
    },
    gameMode,
    userDifficulty
  });

  const { draw } = useGameRenderer({ 
    canvasRef, 
    gameStateRef, 
    birdSkin,
    gameMode,
    userDifficulty
  });

  useEffect(() => {
    initializeGameSounds();
  }, [initializeGameSounds]);

  const gameLoop = useCallback(() => {
    if (gameState === 'playing' && !gameStateRef.current.gameOver) {
      updateGame();
    }
    draw();
    
    if (gameState === 'playing') {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
  }, [updateGame, draw, gameState]);

  useEffect(() => {
    if (onContinueGameRef) {
      onContinueGameRef(continueGame);
    }
  }, [continueGame, onContinueGameRef]);

  // Enhanced input handlers with sound effects
  useEffect(() => {
    // Force cleanup of any existing handlers
    if (inputHandlersRef.current.handleClick) {
      window.removeEventListener('click', inputHandlersRef.current.handleClick);
      window.removeEventListener('mousedown', inputHandlersRef.current.handleClick);
      window.removeEventListener('touchstart', inputHandlersRef.current.handleClick);
    }
    if (inputHandlersRef.current.handleKeyPress) {
      window.removeEventListener('keydown', inputHandlersRef.current.handleKeyPress);
    }

    if (gameState === 'playing') {
      const handleClick = (e: MouseEvent | TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        playWingFlap();
        jump();
      };
      
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.code === 'Space') {
          e.preventDefault();
          e.stopPropagation();
          playWingFlap();
          jump();
        }
      };

      inputHandlersRef.current = { handleClick, handleKeyPress };
      
      window.addEventListener('click', handleClick);
      window.addEventListener('mousedown', handleClick);
      window.addEventListener('touchstart', handleClick);
      window.addEventListener('keydown', handleKeyPress);
    } else {
      inputHandlersRef.current = {};
    }

    return () => {
      if (inputHandlersRef.current.handleClick) {
        window.removeEventListener('click', inputHandlersRef.current.handleClick);
        window.removeEventListener('mousedown', inputHandlersRef.current.handleClick);
        window.removeEventListener('touchstart', inputHandlersRef.current.handleClick);
      }
      if (inputHandlersRef.current.handleKeyPress) {
        window.removeEventListener('keydown', inputHandlersRef.current.handleKeyPress);
      }
    };
  }, [jump, gameState, playWingFlap]);

  // Enhanced game state management with better cleanup and initialization tracking
  useEffect(() => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = undefined;
    }

    if (gameState === 'playing') {
      const canvas = canvasRef.current;
      if (canvas && !gameInitializedRef.current) {
        console.log('Entering playing state - initializing game for first time');
        gameInitializedRef.current = true;
        resetGame(canvas.height);
        
        setTimeout(() => {
          if (gameState === 'playing') {
            gameLoopRef.current = requestAnimationFrame(gameLoop);
          }
        }, 100);
      } else if (canvas && gameInitializedRef.current) {
        console.log('Game already initialized, starting game loop');
        gameLoopRef.current = requestAnimationFrame(gameLoop);
      }
    } else {
      // Reset initialization flag when leaving playing state
      gameInitializedRef.current = false;
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = undefined;
      }
    };
  }, [gameState, gameLoop, resetGame]);

  // Optimal Flappy Bird canvas dimensions - 9:16 aspect ratio
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      // Optimal Flappy Bird dimensions
      const gameWidth = 360;
      const gameHeight = 640;
      const aspectRatio = gameWidth / gameHeight;
      
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const windowAspectRatio = windowWidth / windowHeight;
      
      let canvasWidth, canvasHeight;
      
      if (windowAspectRatio > aspectRatio) {
        // Window is wider than game aspect ratio
        canvasHeight = windowHeight;
        canvasWidth = canvasHeight * aspectRatio;
      } else {
        // Window is taller than game aspect ratio
        canvasWidth = windowWidth;
        canvasHeight = canvasWidth / aspectRatio;
      }
      
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      
      // Center the canvas
      canvas.style.left = `${(windowWidth - canvasWidth) / 2}px`;
      canvas.style.top = `${(windowHeight - canvasHeight) / 2}px`;
      
      console.log('Canvas resized to optimal Flappy Bird dimensions:', canvasWidth, 'x', canvasHeight);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed bg-gradient-to-b from-sky-400 to-sky-600 touch-none"
      style={{ 
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        position: 'fixed',
        zIndex: 1
      }}
    />
  );
};

export default GameCanvas;
