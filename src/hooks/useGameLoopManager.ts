
import { useEffect, useRef, useCallback } from 'react';

interface UseGameLoopManagerProps {
  gameState: 'menu' | 'playing' | 'gameOver' | 'paused';
  gameStateRef: React.MutableRefObject<any>;
  updateGame: () => void;
  draw: () => void;
  resetGame: (canvasHeight: number) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export const useGameLoopManager = ({
  gameState,
  gameStateRef,
  updateGame,
  draw,
  resetGame,
  canvasRef
}: UseGameLoopManagerProps) => {
  const gameLoopRef = useRef<number>();
  const gameInitializedRef = useRef(false);

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
  }, [gameState, gameLoop, resetGame, canvasRef]);
};
