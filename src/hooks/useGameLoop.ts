
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
  initialized: boolean;
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
    gameOver: false,
    initialized: false
  });

  const resetGame = useCallback((canvasHeight: number) => {
    console.log('Resetting game with canvas height:', canvasHeight);
    const safeY = Math.max(100, canvasHeight / 2);
    
    gameStateRef.current = {
      bird: { x: 100, y: safeY, velocity: 0, rotation: 0 },
      pipes: [],
      clouds: [],
      frameCount: 0,
      score: 0,
      lastPipeSpawn: 0,
      gameOver: false,
      initialized: true
    };
    
    onScoreUpdate(0);
  }, [onScoreUpdate]);

  const continueGame = useCallback(() => {
    console.log('Continuing game - preserving score:', gameStateRef.current.score);
    const canvas = document.querySelector('canvas');
    const safeY = canvas ? Math.max(150, canvas.height / 2) : 300;
    
    if (!gameStateRef.current.initialized) {
      console.log('Game not initialized, cannot continue');
      return;
    }
    
    // Reset bird position and physics only
    gameStateRef.current.bird = {
      x: 100,
      y: safeY,
      velocity: 0,
      rotation: 0
    };
    
    // Clear game over flag
    gameStateRef.current.gameOver = false;
    
    // Clear pipes that are too close to bird
    gameStateRef.current.pipes = gameStateRef.current.pipes.filter(pipe => 
      pipe.x > gameStateRef.current.bird.x + 300
    );
    
    // Reset spawn timer
    gameStateRef.current.lastPipeSpawn = gameStateRef.current.frameCount;
    
    console.log('Game continued with preserved score:', gameStateRef.current.score);
  }, []);

  const jump = useCallback(() => {
    if (gameState === 'playing' && !gameStateRef.current.gameOver && gameStateRef.current.initialized) {
      gameStateRef.current.bird.velocity = -7;
      console.log('Bird jumped! Velocity:', gameStateRef.current.bird.velocity);
    }
  }, [gameState]);

  const checkCollisions = useCallback((canvas: HTMLCanvasElement) => {
    const { bird, pipes, gameOver, initialized } = gameStateRef.current;
    
    if (!initialized || gameOver) return false;
    
    const BIRD_SIZE = 25;
    const PIPE_WIDTH = 120;
    
    // Ground collision
    if (bird.y + BIRD_SIZE >= canvas.height - 30) {
      console.log('Bird hit ground!');
      return true;
    }

    // Ceiling collision
    if (bird.y <= 10) {
      console.log('Bird hit ceiling!');
      return true;
    }
    
    // Pipe collisions
    for (const pipe of pipes) {
      if (
        bird.x + BIRD_SIZE - 8 > pipe.x &&
        bird.x + 8 < pipe.x + PIPE_WIDTH
      ) {
        if (bird.y + 8 < pipe.topHeight || bird.y + BIRD_SIZE - 8 > pipe.bottomY) {
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
    continueGame,
    jump,
    checkCollisions
  };
};
