
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
      gameOver: false
    };
    
    console.log('Game reset complete');
  }, []);

  const continueGame = useCallback(() => {
    console.log('Continuing game after revive - preserving score:', gameStateRef.current.score);
    const canvas = document.querySelector('canvas');
    const safeY = canvas ? Math.max(150, canvas.height / 2) : 300;
    
    gameStateRef.current.bird = {
      x: 80,
      y: safeY,
      velocity: -2,
      rotation: 0
    };
    
    gameStateRef.current.gameOver = false;
    
    gameStateRef.current.pipes = gameStateRef.current.pipes.filter(pipe => 
      pipe.x > gameStateRef.current.bird.x + 300
    );
    
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
    
    if (gameOver || gameState !== 'playing') return false;
    
    const BIRD_SIZE = 25;
    const PIPE_WIDTH = 120;
    
    // ONLY check pipe collisions - removed ground and ceiling collision checks
    for (const pipe of pipes) {
      if (
        bird.x + BIRD_SIZE - 12 > pipe.x &&
        bird.x + 12 < pipe.x + PIPE_WIDTH
      ) {
        if (bird.y + 12 < pipe.topHeight || bird.y + BIRD_SIZE - 12 > pipe.bottomY) {
          console.log('Bird hit pipe! Bird Y:', bird.y, 'Top height:', pipe.topHeight, 'Bottom Y:', pipe.bottomY);
          return true;
        }
      }
    }

    return false;
  }, [gameState]);

  const forceReset = useCallback(() => {
    if (gameState !== 'playing') {
      console.log('Force resetting game state');
      const canvas = document.querySelector('canvas');
      const canvasHeight = canvas ? canvas.height : 600;
      resetGame(canvasHeight);
    }
  }, [resetGame, gameState]);

  return {
    gameStateRef,
    resetGame,
    continueGame,
    jump,
    checkCollisions,
    forceReset
  };
};
