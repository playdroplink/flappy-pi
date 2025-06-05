
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
  gameOver: boolean;
}

interface UseGameLoopProps {
  gameState: 'menu' | 'playing' | 'gameOver' | 'paused';
  onCollision: () => void;
  onScoreUpdate: (score: number) => void;
}

export const useGameLoop = ({ gameState, onCollision, onScoreUpdate }: UseGameLoopProps) => {
  const gameStateRef = useRef<GameLoopState>({
    bird: { x: 100, y: 300, velocity: 0, rotation: 0 },
    pipes: [],
    clouds: [],
    frameCount: 0,
    score: 0,
    lastPipeSpawn: 0,
    gameOver: false
  });

  const resetGame = useCallback(() => {
    console.log('Resetting game - getting current canvas dimensions');
    const canvas = document.querySelector('canvas');
    
    if (!canvas) {
      console.warn('Canvas not found during reset, using default values');
      gameStateRef.current = {
        bird: { x: 100, y: 300, velocity: 0, rotation: 0 },
        pipes: [],
        clouds: [],
        frameCount: 0,
        score: 0,
        lastPipeSpawn: 0,
        gameOver: false
      };
      onScoreUpdate(0);
      return;
    }

    const canvasHeight = canvas.height;
    const safeY = Math.max(150, canvasHeight / 2);
    
    console.log('Resetting game with canvas height:', canvasHeight, 'Bird Y:', safeY);
    
    gameStateRef.current = {
      bird: { x: 100, y: safeY, velocity: 0, rotation: 0 },
      pipes: [],
      clouds: [],
      frameCount: 0,
      score: 0,
      lastPipeSpawn: 0,
      gameOver: false
    };
    onScoreUpdate(0);
  }, [onScoreUpdate]);

  const continueGame = useCallback(() => {
    console.log('Continuing game after revive - preserving score:', gameStateRef.current.score);
    const canvas = document.querySelector('canvas');
    const safeY = canvas ? Math.max(150, canvas.height / 2) : 300;
    
    // Reset bird to safe position
    gameStateRef.current.bird = {
      x: 80,
      y: safeY,
      velocity: -2,
      rotation: 0
    };
    
    // Clear game over flag IMMEDIATELY to prevent further collision processing
    gameStateRef.current.gameOver = false;
    
    // Remove pipes that are too close
    gameStateRef.current.pipes = gameStateRef.current.pipes.filter(pipe => 
      pipe.x > gameStateRef.current.bird.x + 300
    );
    
    // Reset spawn timer
    gameStateRef.current.lastPipeSpawn = gameStateRef.current.frameCount + 120;
    
    console.log('Revive complete - Bird at safe position, score preserved:', gameStateRef.current.score);
  }, []);

  const jump = useCallback(() => {
    if (gameState === 'playing' && !gameStateRef.current.gameOver) {
      gameStateRef.current.bird.velocity = -7;
      console.log('Bird jumped! Velocity:', gameStateRef.current.bird.velocity);
    }
  }, [gameState]);

  const checkCollisions = useCallback((canvas: HTMLCanvasElement) => {
    const { bird, pipes, gameOver } = gameStateRef.current;
    
    // Don't check collisions if game is already over or not playing
    if (gameOver || gameState !== 'playing') return false;
    
    const BIRD_SIZE = 25;
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
    
    // Pipe collisions - more forgiving hitbox
    for (const pipe of pipes) {
      if (
        bird.x + BIRD_SIZE - 8 > pipe.x &&
        bird.x + 8 < pipe.x + PIPE_WIDTH
      ) {
        if (bird.y + 8 < pipe.topHeight || bird.y + BIRD_SIZE - 8 > pipe.bottomY) {
          console.log('Bird hit pipe! Bird Y:', bird.y, 'Top height:', pipe.topHeight, 'Bottom Y:', pipe.bottomY);
          return true;
        }
      }
    }

    return false;
  }, [gameState]);

  return {
    gameStateRef,
    resetGame,
    continueGame,
    jump,
    checkCollisions
  };
};
