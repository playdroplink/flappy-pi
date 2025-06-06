
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
  gameStarted: boolean; // New flag to control game start
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
    // Only reset if not already initialized to prevent multiple resets
    if (gameStateRef.current.initialized && gameState === 'playing') {
      console.log('Game already initialized, skipping reset');
      return;
    }
    
    console.log('COMPLETE GAME RESET - Clearing all state');
    const safeY = Math.max(150, canvasHeight / 3);
    
    gameStateRef.current = {
      bird: { x: 80, y: safeY, velocity: 0, rotation: 0 },
      pipes: [],
      clouds: [],
      frameCount: 0,
      score: 0,
      lastPipeSpawn: 0,
      gameOver: false,
      initialized: true,
      gameStarted: false // Start with game not started
    };
    
    onScoreUpdate(0);
    console.log('Game completely reset and ready to play - waiting for first tap');
  }, [onScoreUpdate, gameState]);

  const startGame = useCallback(() => {
    if (gameStateRef.current.gameStarted) return;
    
    console.log('Starting game - bird will now fall and pipes will spawn');
    gameStateRef.current.gameStarted = true;
    gameStateRef.current.lastPipeSpawn = gameStateRef.current.frameCount + 120; // Delay first pipe
  }, []);

  const continueGame = useCallback(() => {
    console.log('Continuing game after revive');
    const canvas = document.querySelector('canvas');
    const safeY = canvas ? Math.max(150, canvas.height / 3) : 200;
    
    gameStateRef.current.bird = {
      x: 80,
      y: safeY,
      velocity: -5,
      rotation: 0
    };
    
    gameStateRef.current.gameOver = false;
    gameStateRef.current.gameStarted = true; // Ensure game is started after continue
    
    // Remove pipes that are too close to bird
    gameStateRef.current.pipes = gameStateRef.current.pipes.filter(pipe => 
      pipe.x > gameStateRef.current.bird.x + 300
    );
    gameStateRef.current.lastPipeSpawn = gameStateRef.current.frameCount + 200;
    
    console.log('Continue complete - score preserved:', gameStateRef.current.score);
  }, []);

  const jump = useCallback(() => {
    if (gameState === 'playing' && !gameStateRef.current.gameOver) {
      // Start game on first jump if not started
      if (!gameStateRef.current.gameStarted) {
        startGame();
      }
      
      gameStateRef.current.bird.velocity = -8; // Strong jump for better control
      console.log('Bird jumped! Velocity:', gameStateRef.current.bird.velocity);
    }
  }, [gameState, startGame]);

  const checkCollisions = useCallback((canvas: HTMLCanvasElement) => {
    const { bird, pipes, gameOver, gameStarted } = gameStateRef.current;
    
    if (gameOver || gameState !== 'playing' || !gameStarted) return false;
    
    // Much more forgiving bird hitbox - smaller collision area
    const BIRD_SIZE = 16; // Reduced collision size significantly
    
    // Very generous collision detection - only the center core of the bird
    const birdLeft = bird.x - BIRD_SIZE/2 + 8;
    const birdRight = bird.x + BIRD_SIZE/2 - 8;
    const birdTop = bird.y - BIRD_SIZE/2 + 8;
    const birdBottom = bird.y + BIRD_SIZE/2 - 8;
    
    // Check ceiling collision with generous margin
    if (birdTop <= 10) {
      console.log('Bird hit ceiling! Collision detected');
      return true;
    }
    
    // Check ground collision with more forgiving ground detection
    if (birdBottom >= canvas.height - 50) {
      console.log('Bird hit ground! Collision detected');
      return true;
    }
    
    // Check pipe collisions with very forgiving detection
    for (const pipe of pipes) {
      const pipeWidth = pipe.width || 80;
      const pipeLeft = pipe.x + 8; // More generous margin on pipe edges
      const pipeRight = pipe.x + pipeWidth - 8;
      
      // Only check collision if bird is clearly within pipe horizontal bounds
      if (birdRight > pipeLeft && birdLeft < pipeRight) {
        // Check top pipe collision with generous margin
        if (birdTop < pipe.topHeight - 8) {
          console.log('Bird hit top pipe! Collision detected');
          return true;
        }
        
        // Check bottom pipe collision with generous margin
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
