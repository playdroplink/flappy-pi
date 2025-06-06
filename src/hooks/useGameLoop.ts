
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
  backgroundOffset: number;
  foregroundOffset: number;
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
    gameStarted: false,
    backgroundOffset: 0,
    foregroundOffset: 0
  });

  const resetGame = useCallback((canvasHeight: number) => {
    console.log('🔄 COMPLETE GAME RESTART - Full state reset initiated');
    
    // Calculate safe center position
    const centerY = canvasHeight / 2;
    const safeY = Math.max(100, Math.min(canvasHeight - 100, centerY));
    
    console.log('Canvas height:', canvasHeight, 'Safe center Y:', safeY);
    
    // Complete game state reset
    gameStateRef.current = {
      bird: { 
        x: 80, 
        y: safeY, 
        velocity: 0,
        rotation: 0
      },
      pipes: [],
      clouds: [],
      frameCount: 0,
      score: 0,
      lastPipeSpawn: 0,
      gameOver: false,
      initialized: true,
      gameStarted: false,
      backgroundOffset: 0,
      foregroundOffset: 0
    };
    
    // Reset score display
    onScoreUpdate(0);
    
    console.log('✅ Game completely reset - bird at center Y:', safeY, 'ready for new game');
  }, [onScoreUpdate]);

  const startGame = useCallback(() => {
    if (gameStateRef.current.gameStarted) return;
    
    console.log('🚀 Starting game - enabling physics and spawning');
    gameStateRef.current.gameStarted = true;
    gameStateRef.current.lastPipeSpawn = gameStateRef.current.frameCount + 120;
    
    // Give bird initial jump
    gameStateRef.current.bird.velocity = -6;
  }, []);

  const continueGame = useCallback(() => {
    console.log('💫 Continuing game after revive');
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    
    // Reset bird to center position
    const centerY = canvas.height / 2;
    const safeY = Math.max(100, Math.min(canvas.height - 100, centerY));
    
    gameStateRef.current.bird = {
      x: 80,
      y: safeY,
      velocity: 0,
      rotation: 0
    };
    
    gameStateRef.current.gameOver = false;
    gameStateRef.current.gameStarted = false;
    
    // Clear nearby pipes
    gameStateRef.current.pipes = gameStateRef.current.pipes.filter(pipe => 
      pipe.x > gameStateRef.current.bird.x + 400
    );
    
    gameStateRef.current.lastPipeSpawn = gameStateRef.current.frameCount + 200;
    
    console.log('✅ Continue complete - bird respawned at center Y:', safeY);
  }, []);

  const jump = useCallback(() => {
    if (gameState === 'playing' && !gameStateRef.current.gameOver) {
      // Start game on first jump
      if (!gameStateRef.current.gameStarted) {
        startGame();
      }
      
      // Apply jump force
      gameStateRef.current.bird.velocity = -8;
      console.log('🦅 Bird jumped! Velocity:', gameStateRef.current.bird.velocity);
    }
  }, [gameState, startGame]);

  const checkCollisions = useCallback((canvas: HTMLCanvasElement) => {
    const { bird, pipes, gameOver, gameStarted } = gameStateRef.current;
    
    if (gameOver || gameState !== 'playing' || !gameStarted) return false;
    
    // Bird hitbox
    const BIRD_SIZE = 16;
    const birdLeft = bird.x - BIRD_SIZE/2 + 6;
    const birdRight = bird.x + BIRD_SIZE/2 - 6;
    const birdTop = bird.y - BIRD_SIZE/2 + 6;
    const birdBottom = bird.y + BIRD_SIZE/2 - 6;
    
    // Check ceiling collision
    if (birdTop <= 25) {
      console.log('💥 Bird hit ceiling! Y:', bird.y);
      return true;
    }
    
    // Check ground collision
    if (birdBottom >= canvas.height - 65) {
      console.log('💥 Bird hit ground! Y:', bird.y);
      return true;
    }
    
    // Check pipe collisions
    for (const pipe of pipes) {
      const pipeWidth = pipe.width || 80;
      const pipeLeft = pipe.x + 6;
      const pipeRight = pipe.x + pipeWidth - 6;
      
      if (birdRight > pipeLeft && birdLeft < pipeRight) {
        if (birdTop < pipe.topHeight - 6) {
          console.log('💥 Bird hit top pipe!');
          return true;
        }
        
        if (birdBottom > pipe.bottomY + 6) {
          console.log('💥 Bird hit bottom pipe!');
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
