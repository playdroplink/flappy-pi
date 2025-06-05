
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
    if (canvasReady && gameState === 'playing' && !gameStateRef.current?.gameOver) {
      updateGame();
    }
    draw();
    
    if (gameState === 'playing') {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
  }, [updateGame, draw, gameState, canvasReady]);

  // Expose continueGame function
  useEffect(() => {
    if (onContinueGameRef) {
      onContinueGameRef(continueGame);
    }
  }, [continueGame, onContinueGameRef]);

  // Input handling
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      if (gameState === 'playing') {
        jump();
      }
    };
    
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (gameState === 'playing') {
          jump();
        }
      }
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [jump, gameState]);

  // Canvas initialization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const initializeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      console.log('🖥️ Canvas initialized:', canvas.width, 'x', canvas.height);
      setCanvasReady(true);
    };

    initializeCanvas();
    window.addEventListener('resize', initializeCanvas);

    return () => {
      window.removeEventListener('resize', initializeCanvas);
    };
  }, []);

  // Game state management with better restart handling
  useEffect(() => {
    const prevState = previousGameStateRef.current;
    previousGameStateRef.current = gameState;

    if (gameState === 'playing' && canvasReady) {
      // Fresh start when transitioning to playing
      if (prevState !== 'playing') {
        console.log('🎮 Starting fresh game session');
        
        // Stop any existing game loop
        if (gameLoopRef.current) {
          cancelAnimationFrame(gameLoopRef.current);
          gameLoopRef.current = undefined;
        }
        
        // Reset game state and start fresh
        setTimeout(() => {
          resetGame();
          // Start new game loop
          gameLoopRef.current = requestAnimationFrame(gameLoop);
        }, 100);
      } else if (!gameLoopRef.current) {
        // Resume if needed
        gameLoopRef.current = requestAnimationFrame(gameLoop);
      }
    } else {
      // Stop game loop when not playing
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = undefined;
      }
    }

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
        WebkitUserSelect: 'none'
      }}
    />
  );
};

export default GameCanvas;
