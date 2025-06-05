
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
    bird: { x: 100, y: 300, velocity: 0, rotation: 0 }, // Better starting position
    pipes: [],
    clouds: [],
    frameCount: 0,
    score: 0,
    lastPipeSpawn: 0
  });

  const resetGame = useCallback((canvasHeight: number) => {
    console.log('Resetting game with canvas height:', canvasHeight);
    gameStateRef.current = {
      bird: { x: 100, y: Math.max(100, canvasHeight / 2), velocity: 0, rotation: 0 },
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
      gameStateRef.current.bird.velocity = -7; // Slightly reduced jump force
      console.log('Bird jumped! Velocity:', gameStateRef.current.bird.velocity);
    }
  }, [gameState]);

  const checkCollisions = useCallback((canvas: HTMLCanvasElement) => {
    const { bird, pipes } = gameStateRef.current;
    const BIRD_SIZE = 25; // Even smaller for easier gameplay
    const PIPE_WIDTH = 120;
    
    // Ground collision - more forgiving
    if (bird.y + BIRD_SIZE >= canvas.height - 30) {
      console.log('Bird hit ground! Bird Y:', bird.y, 'Canvas height:', canvas.height);
      return true;
    }

    // Ceiling collision - more forgiving
    if (bird.y <= 10) {
      console.log('Bird hit ceiling! Bird Y:', bird.y);
      return true;
    }
    
    // Pipe collisions - much more forgiving
    for (const pipe of pipes) {
      // Check if bird is within pipe's x range (smaller collision box)
      if (
        bird.x + BIRD_SIZE - 8 > pipe.x &&
        bird.x + 8 < pipe.x + PIPE_WIDTH
      ) {
        // Check collision with top pipe or bottom pipe (larger margins)
        if (bird.y + 8 < pipe.topHeight || bird.y + BIRD_SIZE - 8 > pipe.bottomY) {
          console.log('Bird hit pipe! Bird Y:', bird.y, 'Top height:', pipe.topHeight, 'Bottom Y:', pipe.bottomY);
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
