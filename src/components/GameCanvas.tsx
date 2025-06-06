
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
  const initializationRef = useRef(false);

  useBackgroundMusic(musicEnabled);

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

  // Improved game loop with error handling
  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvasReady || !gameStateRef.current || !canvas) {
      // Still render even if not ready to avoid blank screen
      draw();
      if (gameState === 'playing') {
        gameLoopRef.current = requestAnimationFrame(gameLoop);
      }
      return;
    }

    try {
      if (gameState === 'playing' && !gameStateRef.current?.gameOver) {
        updateGame();
      }
      draw();
      
      if (gameState === 'playing') {
        gameLoopRef.current = requestAnimationFrame(gameLoop);
      }
    } catch (error) {
      console.error('❌ Game loop error:', error);
      // Stop the loop on error to prevent cascading issues
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = undefined;
      }
    }
  }, [updateGame, draw, gameState, canvasReady, gameStateRef]);

  // Expose continueGame function
  useEffect(() => {
    if (onContinueGameRef) {
      onContinueGameRef(continueGame);
    }
  }, [continueGame, onContinueGameRef]);

  // Input handling with improved error handling
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      if (gameState === 'playing') {
        try {
          jump();
        } catch (error) {
          console.error('❌ Jump error:', error);
        }
      }
    };
    
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (gameState === 'playing') {
          try {
            jump();
          } catch (error) {
            console.error('❌ Jump error:', error);
          }
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

  // Canvas initialization with better error handling
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
        console.error('❌ Canvas initialization error:', error);
        // Retry after a short delay
        setTimeout(initializeCanvas, 100);
      }
    };

    initializeCanvas();
    window.addEventListener('resize', initializeCanvas);

    return () => {
      window.removeEventListener('resize', initializeCanvas);
    };
  }, []);

  // Enhanced game state management
  useEffect(() => {
    const prevState = previousGameStateRef.current;
    previousGameStateRef.current = gameState;

    const handleStateChange = async () => {
      if (gameState === 'playing' && canvasReady) {
        // Stop any existing loop
        if (gameLoopRef.current) {
          cancelAnimationFrame(gameLoopRef.current);
          gameLoopRef.current = undefined;
        }
        
        if (prevState !== 'playing') {
          console.log('🎮 Starting fresh game session');
          initializationRef.current = true;
          
          try {
            await resetGame(level);
            // Small delay to ensure state is ready
            setTimeout(() => {
              if (gameState === 'playing') {
                gameLoopRef.current = requestAnimationFrame(gameLoop);
              }
              initializationRef.current = false;
            }, 150);
          } catch (error) {
            console.error('❌ Game reset error:', error);
            initializationRef.current = false;
          }
        } else if (!gameLoopRef.current && !initializationRef.current) {
          // Resume if paused
          gameLoopRef.current = requestAnimationFrame(gameLoop);
        }
      } else {
        // Stop game loop when not playing
        if (gameLoopRef.current) {
          cancelAnimationFrame(gameLoopRef.current);
          gameLoopRef.current = undefined;
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
  }, [gameState, canvasReady, gameLoop, resetGame, level]);

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
