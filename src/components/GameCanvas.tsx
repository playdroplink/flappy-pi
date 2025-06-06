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
  const inputHandlersRef = useRef<{
    handleClick?: (e: MouseEvent) => void;
    handleKeyPress?: (e: KeyboardEvent) => void;
  }>({});

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

  // Enhanced input handlers with better cleanup
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
        jump();
      };
      
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.code === 'Space') {
          e.preventDefault();
          e.stopPropagation();
          jump();
        }
      };

      inputHandlersRef.current = { handleClick, handleKeyPress };
      
      // Add multiple event types for better mobile support
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
  }, [jump, gameState]);

  // Enhanced game state management with better cleanup
  useEffect(() => {
    // Force stop any existing game loop
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = undefined;
    }

    if (gameState === 'playing') {
      const canvas = canvasRef.current;
      if (canvas) {
        // Always reset the game when entering playing state
        console.log('Entering playing state - resetting game');
        resetGame(canvas.height);
        
        // Small delay before starting game loop
        setTimeout(() => {
          if (gameState === 'playing') { // Double check state hasn't changed
            gameLoopRef.current = requestAnimationFrame(gameLoop);
          }
        }, 100);
      }
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = undefined;
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
        WebkitUserSelect: 'none',
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1
      }}
    />
  );
};

export default GameCanvas;
