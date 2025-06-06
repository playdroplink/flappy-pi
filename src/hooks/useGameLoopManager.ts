
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
  const isResetting = useRef<boolean>(false);

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
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      
      console.log('📐 Canvas resized:', canvas.width, 'x', canvas.height);
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [canvasRef]);

  const performGameReset = useCallback(() => {
    if (isResetting.current) return;
    
    isResetting.current = true;
    console.log('🔄 Performing complete game reset...');
    
    const canvas = canvasRef.current;
    if (canvas) {
      // Stop any ongoing animations
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      // Reset game state
      resetGame(canvas.height);
      
      // Reset visuals
      if (resetVisuals) {
        resetVisuals();
      }
      
      // Small delay to ensure everything is reset
      setTimeout(() => {
        // Restart animation loop
        animationFrameRef.current = requestAnimationFrame(gameLoop);
        isResetting.current = false;
        console.log('✅ Game reset complete');
      }, 100);
    }
  }, [resetGame, canvasRef, resetVisuals, gameLoop]);

  useEffect(() => {
    const cleanup = setupCanvas();
    return cleanup;
  }, [setupCanvas]);

  useEffect(() => {
    if (gameState === 'playing' && lastResetState.current !== 'playing') {
      console.log('🎮 Game state changed to playing - triggering reset');
      performGameReset();
      lastResetState.current = 'playing';
    }
  }, [gameState, performGameReset]);

  useEffect(() => {
    if (!isResetting.current) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }

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
