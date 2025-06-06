
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
  gameStarted: boolean;
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
    initialized: false,
    gameStarted: false
  });

  const resetGame = useCallback((canvasHeight: number) => {
    console.log('COMPLETE GAME RESET - Clearing all state and resetting bird');
    
    // Calculate safe vertical position based on canvas height
    const safeY = Math.max(150, canvasHeight / 2);
    
    // Complete state reset with proper bird positioning and physics
    gameStateRef.current = {
      bird: { 
        x: 80, 
        y: safeY, 
        velocity: 0, // Reset velocity completely
        rotation: 0  // Reset rotation/tilt angle
      },
      pipes: [],     // Clear all pipes
      clouds: [],    // Clear all clouds
      frameCount: 0,
      score: 0,
      lastPipeSpawn: 0,
      gameOver: false,
      initialized: true,
      gameStarted: false // Bird waits for first tap - crucial for restart behavior
    };
    
    // Reset score display
    onScoreUpdate(0);
    
    console.log('Game completely reset - bird positioned at center, waiting for tap to start');
  }, [onScoreUpdate]);

  const startGame = useCallback(() => {
    if (gameStateRef.current.gameStarted) return;
    
    console.log('Starting game - enabling physics and pipe spawning');
    gameStateRef.current.gameStarted = true;
    gameStateRef.current.lastPipeSpawn = gameStateRef.current.frameCount + 120; // Delay first pipe
    
    // Give bird a small initial jump to feel responsive
    gameStateRef.current.bird.velocity = -3;
  }, []);

  const continueGame = useCallback(() => {
    console.log('Continuing game after revive');
    const canvas = document.querySelector('canvas');
    const safeY = canvas ? canvas.height / 2 : 200; // Position in vertical center
    
    // Reset bird to safe position with small upward velocity
    gameStateRef.current.bird = {
      x: 80,
      y: safeY,
      velocity: 0,    // Start with zero velocity until player taps
      rotation: 0     // Reset rotation completely
    };
    
    gameStateRef.current.gameOver = false;
    gameStateRef.current.gameStarted = false; // Wait for tap before applying physics
    
    // Remove pipes that are too close to bird
    gameStateRef.current.pipes = gameStateRef.current.pipes.filter(pipe => 
      pipe.x > gameStateRef.current.bird.x + 300
    );
    
    gameStateRef.current.lastPipeSpawn = gameStateRef.current.frameCount + 200;
    
    console.log('Continue complete - bird respawned at center position, waiting for tap');
  }, []);

  const jump = useCallback(() => {
    if (gameState === 'playing' && !gameStateRef.current.gameOver) {
      // Start game on first jump if not started
      if (!gameStateRef.current.gameStarted) {
        startGame();
      }
      
      // Apply jump force
      gameStateRef.current.bird.velocity = -8;
      console.log('Bird jumped! Velocity:', gameStateRef.current.bird.velocity);
    }
  }, [gameState, startGame]);

  const checkCollisions = useCallback((canvas: HTMLCanvasElement) => {
    const { bird, pipes, gameOver, gameStarted } = gameStateRef.current;
    
    if (gameOver || gameState !== 'playing' || !gameStarted) return false;
    
    // Forgiving bird hitbox
    const BIRD_SIZE = 16;
    
    const birdLeft = bird.x - BIRD_SIZE/2 + 8;
    const birdRight = bird.x + BIRD_SIZE/2 - 8;
    const birdTop = bird.y - BIRD_SIZE/2 + 8;
    const birdBottom = bird.y + BIRD_SIZE/2 - 8;
    
    // Check ceiling collision
    if (birdTop <= 10) {
      console.log('Bird hit ceiling! Collision detected');
      return true;
    }
    
    // Check ground collision
    if (birdBottom >= canvas.height - 50) {
      console.log('Bird hit ground! Collision detected');
      return true;
    }
    
    // Check pipe collisions
    for (const pipe of pipes) {
      const pipeWidth = pipe.width || 80;
      const pipeLeft = pipe.x + 8;
      const pipeRight = pipe.x + pipeWidth - 8;
      
      if (birdRight > pipeLeft && birdLeft < pipeRight) {
        if (birdTop < pipe.topHeight - 8) {
          console.log('Bird hit top pipe! Collision detected');
          return true;
        }
        
        if (birdBottom > pipe.bottomY + 8) {
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
    checkCollisions,
    startGame
  };
};
