
import React, { useRef, useEffect, useCallback } from 'react';
import { useNewGameEngine } from '../hooks/useNewGameEngine';
import { useNewGameRenderer } from '../hooks/useNewGameRenderer';

interface NewGameCanvasProps {
  gameState: 'menu' | 'playing' | 'gameOver' | 'paused';
  gameMode: 'classic' | 'endless' | 'challenge';
  onCollision: () => void;
  onScoreUpdate: (score: number) => void;
  birdSkin: string;
}

const NewGameCanvas: React.FC<NewGameCanvasProps> = ({
  gameState,
  gameMode,
  onCollision,
  onScoreUpdate,
  birdSkin
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const lastScoreRef = useRef<number>(0);
  const gameOverHandledRef = useRef<boolean>(false);

  const { 
    gameState: engineState, 
    resetGame, 
    jump, 
    updateGame, 
    setCanvas 
  } = useNewGameEngine(gameMode);

  const { render } = useNewGameRenderer();

  // Set canvas reference
  useEffect(() => {
    setCanvas(canvasRef.current);
  }, [setCanvas]);

  // Handle score updates
  useEffect(() => {
    if (engineState.score !== lastScoreRef.current) {
      lastScoreRef.current = engineState.score;
      onScoreUpdate(engineState.score);
    }
  }, [engineState.score, onScoreUpdate]);

  // Handle game over with proper reset
  useEffect(() => {
    if (engineState.gameOver && !gameOverHandledRef.current) {
      gameOverHandledRef.current = true;
      console.log('Game over detected - calling collision handler');
      onCollision();
    }
    
    // Reset the game over flag when game is not over
    if (!engineState.gameOver) {
      gameOverHandledRef.current = false;
    }
  }, [engineState.gameOver, onCollision]);

  // Game loop
  const gameLoop = useCallback(() => {
    if (!canvasRef.current) return;

    if (engineState.isPlaying && !engineState.gameOver) {
      updateGame();
    }

    // Always render the current state
    render({
      canvas: canvasRef.current,
      bird: engineState.bird,
      pipes: engineState.pipes,
      score: engineState.score,
      gameMode,
      birdSkin
    });

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [engineState, updateGame, render, gameMode, birdSkin]);

  // Start/stop game loop based on state
  useEffect(() => {
    if (gameState === 'playing') {
      // Only reset if not already playing
      if (!engineState.isPlaying) {
        console.log('Starting new game - resetting engine');
        resetGame();
      }
      
      // Start the game loop
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      animationRef.current = requestAnimationFrame(gameLoop);
    } else {
      // Stop the game loop when not playing
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, gameLoop, resetGame, engineState.isPlaying]);

  // Input handling
  useEffect(() => {
    if (gameState !== 'playing') return;

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

    window.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [jump, gameState]);

  // Canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
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

export default NewGameCanvas;
