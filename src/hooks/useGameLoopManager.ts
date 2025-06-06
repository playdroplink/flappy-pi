
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

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [canvasRef]);

  useEffect(() => {
    const cleanup = setupCanvas();
    return cleanup;
  }, [setupCanvas]);

  useEffect(() => {
    if (gameState === 'playing' && lastResetState.current !== 'playing') {
      const canvas = canvasRef.current;
      if (canvas) {
        resetGame(canvas.height);
        if (resetVisuals) {
          resetVisuals();
        }
      }
      lastResetState.current = 'playing';
    }
  }, [gameState, resetGame, canvasRef, resetVisuals]);

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameLoop]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !gameStateRef.current) return;

    gameStateRef.current.initialized = true;
  }, [canvasRef, gameStateRef]);
};
