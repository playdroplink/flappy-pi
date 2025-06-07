
import { useEffect, useRef, useCallback } from 'react';

interface UseGameLoopManagerProps {
  gameState: 'menu' | 'playing' | 'gameOver' | 'paused';
  gameStateRef: React.MutableRefObject<any>;
  updateGame: () => void;
  draw: () => void;
  resetGame: (canvasHeight: number) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  resetVisuals?: () => void;
}

export const useGameLoopManager = ({
  gameState,
  gameStateRef,
  updateGame,
  draw,
  resetGame,
  canvasRef,
  resetVisuals
}: UseGameLoopManagerProps) => {
  const animationFrameRef = useRef<number>();
  const lastResetState = useRef<string>('');

  const gameLoop = useCallback(() => {
    if (gameState === 'playing') {
      updateGame();
    }
    draw();
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, updateGame, draw]);

  // Handle game state transitions
  useEffect(() => {
    const currentState = gameState;
    const lastState = lastResetState.current;
    
    if (currentState === 'playing' && lastState !== 'playing') {
      const canvas = canvasRef.current;
      if (canvas) {
        resetGame(canvas.height);
        if (resetVisuals) resetVisuals();
      }
    }
    
    lastResetState.current = currentState;
  }, [gameState, resetGame, resetVisuals, canvasRef]);

  // Main animation loop
  useEffect(() => {
    if (gameStateRef.current?.initialized) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameLoop, gameStateRef]);

  // Initialize game state
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && gameStateRef.current) {
      gameStateRef.current.initialized = true;
    }
  }, [canvasRef, gameStateRef]);
};
