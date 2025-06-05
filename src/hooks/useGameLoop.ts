
import { useRef, useCallback } from 'react';

interface Bird {
  x: number;
  y: number;
  velocity: number;
  rotation: number;
}

interface Pipe {
  x: number;
  topHeight: number;
  bottomY: number;
  passed: boolean;
  isMoving?: boolean;
  verticalDirection?: number;
  moveSpeed?: number;
}

interface Cloud {
  x: number;
  y: number;
  size: number;
  speed: number;
}

interface GameLoopState {
  bird: Bird;
  pipes: Pipe[];
  clouds: Cloud[];
  frameCount: number;
  score: number;
  lastPipeSpawn: number;
}

interface UseGameLoopProps {
  gameState: 'menu' | 'playing' | 'gameOver' | 'paused';
  onCollision: () => void;
  onScoreUpdate: (score: number) => void;
}

export const useGameLoop = ({ gameState, onCollision, onScoreUpdate }: UseGameLoopProps) => {
  const gameStateRef = useRef<GameLoopState>({
    bird: { x: 100, y: 200, velocity: 0, rotation: 0 },
    pipes: [],
    clouds: [],
    frameCount: 0,
    score: 0,
    lastPipeSpawn: 0
  });

  const resetGame = useCallback((canvasHeight: number) => {
    gameStateRef.current = {
      bird: { x: 100, y: canvasHeight / 2, velocity: 0, rotation: 0 },
      pipes: [],
      clouds: [],
      frameCount: 0,
      score: 0,
      lastPipeSpawn: 0
    };
    onScoreUpdate(0);
  }, [onScoreUpdate]);

  const jump = useCallback(() => {
    if (gameState === 'playing') {
      gameStateRef.current.bird.velocity = -8; // JUMP_FORCE
    }
  }, [gameState]);

  const checkCollisions = useCallback((canvas: HTMLCanvasElement) => {
    const { bird, pipes } = gameStateRef.current;
    const BIRD_SIZE = 40;
    const PIPE_WIDTH = 120;
    
    // Ground collision - bird hits the bottom
    if (bird.y + BIRD_SIZE >= canvas.height - 20) { // 20 is ground height
      console.log('Bird hit ground!');
      return true;
    }

    // Ceiling collision - bird hits the top
    if (bird.y <= 0) {
      console.log('Bird hit ceiling!');
      return true;
    }
    
    // Pipe collisions - more precise collision detection
    for (const pipe of pipes) {
      // Check if bird is within pipe's x range
      if (
        bird.x + BIRD_SIZE > pipe.x &&
        bird.x < pipe.x + PIPE_WIDTH
      ) {
        // Check collision with top pipe or bottom pipe
        if (bird.y < pipe.topHeight || bird.y + BIRD_SIZE > pipe.bottomY) {
          console.log('Bird hit pipe!');
          return true;
        }
      }
    }

    return false;
  }, []);

  return {
    gameStateRef,
    resetGame,
    jump,
    checkCollisions
  };
};
