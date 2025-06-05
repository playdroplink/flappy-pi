
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
  const gameStartedRef = useRef(false);
  const inputHandlersRef = useRef<{
    handleClick?: () => void;
    handleKeyPress?: (e: KeyboardEvent) => void;
  }>({});

  // Add background music
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

  const gameLoop = useCallback(() => {
    if (gameState === 'playing' && !gameStateRef.current.gameOver) {
      updateGame();
    }
    draw();
    
    if (gameState === 'playing') {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
  }, [updateGame, draw, gameState]);

  // Expose continueGame function to parent
  useEffect(() => {
    if (onContinueGameRef) {
      onContinueGameRef(continueGame);
    }
  }, [continueGame, onContinueGameRef]);

  // Clean up and set up input handlers
  useEffect(() => {
    // Clean up existing handlers
    if (inputHandlersRef.current.handleClick) {
      window.removeEventListener('click', inputHandlersRef.current.handleClick);
    }
    if (inputHandlersRef.current.handleKeyPress) {
      window.removeEventListener('keydown', inputHandlersRef.current.handleKeyPress);
    }

    if (gameState === 'playing') {
      // Create new handlers
      const handleClick = (e: MouseEvent) => {
        e.preventDefault();
        jump();
      };
      
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.code === 'Space') {
          e.preventDefault();
          jump();
        }
      };

      // Store handlers in ref for cleanup
      inputHandlersRef.current = { handleClick, handleKeyPress };

      // Add event listeners
      window.addEventListener('click', handleClick);
      window.addEventListener('keydown', handleKeyPress);
    } else {
      inputHandlersRef.current = {};
    }

    // Cleanup function
    return () => {
      if (inputHandlersRef.current.handleClick) {
        window.removeEventListener('click', inputHandlersRef.current.handleClick);
      }
      if (inputHandlersRef.current.handleKeyPress) {
        window.removeEventListener('keydown', inputHandlersRef.current.handleKeyPress);
      }
    };
  }, [jump, gameState]);

  // Game loop management
  useEffect(() => {
    if (gameState === 'playing') {
      const canvas = canvasRef.current;
      if (canvas) {
        // Only reset if this is truly a new game
        if (!gameStartedRef.current || gameStateRef.current.frameCount === 0) {
          console.log('Starting new game, resetting state');
          resetGame(canvas.height);
          gameStartedRef.current = true;
        }
      }
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (gameState === 'gameOver' || gameState === 'menu') {
        gameStartedRef.current = false;
      }
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, gameLoop, resetGame]);

  // Canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      console.log('Canvas resized to:', canvas.width, 'x', canvas.height);
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
      className="fixed inset-0 w-full h-full bg-gradient-to-b from-sky-400 to-sky-600 touch-none"
      style={{ 
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none'
      }}
    />
  );
};

export default GameCanvas;
