
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
  const lastGameStateRef = useRef(gameState);

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
    if (!gameStateRef.current) return;
    
    // Only update game if actually playing and not in game over state
    if (gameState === 'playing' && !gameStateRef.current.gameOver) {
      updateGame();
    }
    
    // Always draw the current state
    draw();
    
    // Continue loop if playing
    if (gameState === 'playing') {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
  }, [updateGame, draw, gameState, gameStateRef]);

  // Expose continueGame function to parent through callback
  useEffect(() => {
    if (onContinueGameRef) {
      onContinueGameRef(continueGame);
    }
  }, [continueGame, onContinueGameRef]);

  // Handle input
  useEffect(() => {
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

    if (gameState === 'playing') {
      window.addEventListener('click', handleClick);
      window.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [jump, gameState]);

  // Game loop management
  useEffect(() => {
    console.log('GameCanvas effect: gameState changed to:', gameState);
    
    if (gameState === 'playing') {
      const canvas = canvasRef.current;
      if (canvas) {
        // Only reset if this is a new game (not continue)
        if (!gameStartedRef.current || lastGameStateRef.current === 'menu') {
          console.log('Starting new game, resetting state');
          resetGame(canvas.height);
          gameStartedRef.current = true;
        } else if (lastGameStateRef.current === 'gameOver') {
          console.log('Continuing from game over - not resetting');
        }
      }
      
      // Start the game loop
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    } else {
      // Stop the game loop
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = undefined;
      }
      
      if (gameState === 'menu') {
        gameStartedRef.current = false;
      }
    }
    
    lastGameStateRef.current = gameState;

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
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
      
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
