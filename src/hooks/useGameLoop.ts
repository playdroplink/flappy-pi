
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
  scored: boolean; // Add scored flag
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
    bird: { x: 80, y: 200, velocity: 0, rotation: 0 }, // Adjusted starting position
    pipes: [],
    clouds: [],
    frameCount: 0,
    score: 0,
    lastPipeSpawn: 0,
    gameOver: false,
    initialized: false
  });

  const resetGame = useCallback((canvasHeight: number) => {
    console.log('COMPLETE GAME RESET - Clearing all state');
    const safeY = Math.max(100, canvasHeight / 3); // Start higher up
    
    gameStateRef.current = {
      bird: { x: 80, y: safeY, velocity: 0, rotation: 0 },
      pipes: [],
      clouds: [],
      frameCount: 0,
      score: 0,
      lastPipeSpawn: 0,
      gameOver: false,
      initialized: true
    };
    
    onScoreUpdate(0);
    console.log('Game completely reset and ready to play');
  }, [onScoreUpdate]);

  const continueGame = useCallback(() => {
    console.log('Continuing game after revive');
    const canvas = document.querySelector('canvas');
    const safeY = canvas ? Math.max(150, canvas.height / 3) : 200;
    
    gameStateRef.current.bird = {
      x: 80,
      y: safeY,
      velocity: -2,
      rotation: 0
    };
    
    gameStateRef.current.gameOver = false;
    
    // Remove pipes that are too close to bird
    gameStateRef.current.pipes = gameStateRef.current.pipes.filter(pipe => 
      pipe.x > gameStateRef.current.bird.x + 200
    );
    gameStateRef.current.lastPipeSpawn = gameStateRef.current.frameCount + 120;
    
    console.log('Continue complete - score preserved:', gameStateRef.current.score);
  }, []);

  const jump = useCallback(() => {
    if (gameState === 'playing' && !gameStateRef.current.gameOver) {
      gameStateRef.current.bird.velocity = -8; // Stronger jump for better control
      console.log('Bird jumped! Velocity:', gameStateRef.current.bird.velocity);
    }
  }, [gameState]);

  const checkCollisions = useCallback((canvas: HTMLCanvasElement) => {
    const { bird, pipes, gameOver } = gameStateRef.current;
    
    if (gameOver || gameState !== 'playing') return false;
    
    // Precise bird hitbox - no visible box around sprite
    const BIRD_SIZE = 24; // Smaller, more precise hitbox
    const PIPE_WIDTH = 80;
    
    // Tight collision detection matching sprite exactly
    const birdLeft = bird.x - BIRD_SIZE/2 + 4; // Small margin for fairness
    const birdRight = bird.x + BIRD_SIZE/2 - 4;
    const birdTop = bird.y - BIRD_SIZE/2 + 4;
    const birdBottom = bird.y + BIRD_SIZE/2 - 4;
    
    // Check ceiling collision
    if (birdTop <= 0) {
      console.log('Bird hit ceiling! Collision detected');
      return true;
    }
    
    // Check ground collision (account for ground height)
    if (birdBottom >= canvas.height - 40) {
      console.log('Bird hit ground! Collision detected');
      return true;
    }
    
    // Check pipe collisions with precise detection
    for (const pipe of pipes) {
      const pipeLeft = pipe.x;
      const pipeRight = pipe.x + PIPE_WIDTH;
      
      // Only check collision if bird is within pipe horizontal bounds
      if (birdRight > pipeLeft && birdLeft < pipeRight) {
        // Check top pipe collision
        if (birdTop < pipe.topHeight) {
          console.log('Bird hit top pipe! Collision detected');
          return true;
        }
        
        // Check bottom pipe collision
        if (birdBottom > pipe.bottomY) {
          console.log('Bird hit bottom pipe! Collision detected');
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
