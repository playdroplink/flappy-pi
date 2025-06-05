
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
    const BIRD_SIZE = 30; // Reduced from 40 to make it easier
    const PIPE_WIDTH = 120;
    
    // Ground collision - bird hits the bottom (with some margin)
    if (bird.y + BIRD_SIZE >= canvas.height - 25) { // Added 5px margin
      console.log('Bird hit ground!');
      return true;
    }

    // Ceiling collision - bird hits the top (with some margin)
    if (bird.y <= 5) { // Added 5px margin from top
      console.log('Bird hit ceiling!');
      return true;
    }
    
    // Pipe collisions - more forgiving collision detection
    for (const pipe of pipes) {
      // Check if bird is within pipe's x range (with smaller collision box)
      if (
        bird.x + BIRD_SIZE - 5 > pipe.x &&
        bird.x + 5 < pipe.x + PIPE_WIDTH
      ) {
        // Check collision with top pipe or bottom pipe (with margin)
        if (bird.y + 5 < pipe.topHeight || bird.y + BIRD_SIZE - 5 > pipe.bottomY) {
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
