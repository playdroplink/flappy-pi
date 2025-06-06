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
  scored: boolean;
  isMoving?: boolean;
  verticalDirection?: number;
  moveSpeed?: number;
  width?: number;
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
    bird: { x: 80, y: 200, velocity: 0, rotation: 0 },
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
    const safeY = Math.max(120, canvasHeight / 3);
    
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
      velocity: -3, // Stronger initial velocity after revive
      rotation: 0
    };
    
    gameStateRef.current.gameOver = false;
    
    // Remove pipes that are too close to bird
    gameStateRef.current.pipes = gameStateRef.current.pipes.filter(pipe => 
      pipe.x > gameStateRef.current.bird.x + 250 // More generous distance
    );
    gameStateRef.current.lastPipeSpawn = gameStateRef.current.frameCount + 150;
    
    console.log('Continue complete - score preserved:', gameStateRef.current.score);
  }, []);

  const jump = useCallback(() => {
    if (gameState === 'playing' && !gameStateRef.current.gameOver) {
      gameStateRef.current.bird.velocity = -9; // Stronger jump for better control
      console.log('Bird jumped! Velocity:', gameStateRef.current.bird.velocity);
    }
  }, [gameState]);

  const checkCollisions = useCallback((canvas: HTMLCanvasElement) => {
    const { bird, pipes, gameOver } = gameStateRef.current;
    
    if (gameOver || gameState !== 'playing') return false;
    
    // Much more forgiving bird hitbox - smaller and more precise
    const BIRD_SIZE = 20; // Reduced from 24
    
    // Very tight collision detection - only the core of the bird sprite
    const birdLeft = bird.x - BIRD_SIZE/2 + 6; // More generous margins
    const birdRight = bird.x + BIRD_SIZE/2 - 6;
    const birdTop = bird.y - BIRD_SIZE/2 + 6;
    const birdBottom = bird.y + BIRD_SIZE/2 - 6;
    
    // Check ceiling collision with margin
    if (birdTop <= 5) {
      console.log('Bird hit ceiling! Collision detected');
      return true;
    }
    
    // Check ground collision with proper ground height margin
    if (birdBottom >= canvas.height - 45) {
      console.log('Bird hit ground! Collision detected');
      return true;
    }
    
    // Check pipe collisions with more forgiving detection
    for (const pipe of pipes) {
      const pipeWidth = pipe.width || 80; // Use pipe.width or default to 80
      const pipeLeft = pipe.x + 5; // Small margin on pipe edges
      const pipeRight = pipe.x + pipeWidth - 5;
      
      // Only check collision if bird is within pipe horizontal bounds
      if (birdRight > pipeLeft && birdLeft < pipeRight) {
        // Check top pipe collision with margin
        if (birdTop < pipe.topHeight - 5) {
          console.log('Bird hit top pipe! Collision detected');
          return true;
        }
        
        // Check bottom pipe collision with margin
        if (birdBottom > pipe.bottomY + 5) {
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
