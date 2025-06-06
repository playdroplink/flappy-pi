
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
    console.log('COMPLETE GAME RESET - Clearing all state');
    const safeY = Math.max(100, canvasHeight / 2);
    
    // Force complete reset of all game state
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
    
    // Ensure score is reset in UI
    onScoreUpdate(0);
    
    console.log('Game completely reset and ready to play');
  }, [onScoreUpdate]);

  const continueGame = useCallback(() => {
    console.log('Continuing game after revive');
    const canvas = document.querySelector('canvas');
    const safeY = canvas ? Math.max(150, canvas.height / 2) : 300;
    
    // Only reset bird position and game over state for continue
    gameStateRef.current.bird = {
      x: 80,
      y: safeY,
      velocity: -2,
      rotation: 0
    };
    
    gameStateRef.current.gameOver = false;
    
    // Remove pipes that are too close to bird
    gameStateRef.current.pipes = gameStateRef.current.pipes.filter(pipe => 
      pipe.x > gameStateRef.current.bird.x + 300
    );
    gameStateRef.current.lastPipeSpawn = gameStateRef.current.frameCount + 120;
    
    console.log('Continue complete - score preserved:', gameStateRef.current.score);
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
    
    // Enhanced collision detection with more precise hitboxes
    const birdLeft = bird.x - BIRD_SIZE/2 + 3; // Slight margin for better gameplay
    const birdRight = bird.x + BIRD_SIZE/2 - 3;
    const birdTop = bird.y - BIRD_SIZE/2 + 3;
    const birdBottom = bird.y + BIRD_SIZE/2 - 3;
    
    // Check ceiling collision
    if (birdTop <= 0) {
      console.log('Bird hit ceiling! Collision detected');
      return true;
    }
    
    // Check ground collision
    if (birdBottom >= canvas.height - 25) { // Account for ground height
      console.log('Bird hit ground! Collision detected');
      return true;
    }
    
    // Check pipe collisions with more precise detection
    for (const pipe of pipes) {
      const pipeLeft = pipe.x;
      const pipeRight = pipe.x + PIPE_WIDTH;
      
      // Check if bird is horizontally aligned with pipe
      if (birdRight > pipeLeft && birdLeft < pipeRight) {
        // Check top pipe collision
        if (birdTop < pipe.topHeight) {
          console.log('Bird hit top pipe! Collision detected at pipe height:', pipe.topHeight);
          return true;
        }
        
        // Check bottom pipe collision
        if (birdBottom > pipe.bottomY) {
          console.log('Bird hit bottom pipe! Collision detected at pipe bottom:', pipe.bottomY);
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
