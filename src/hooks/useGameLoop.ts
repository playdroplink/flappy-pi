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

  const completeGameReset = useCallback((canvasHeight: number) => {
    console.log('🔄 COMPLETE GAME RESET - Full cleanup and state reset');
    
    // Calculate safe center position
    const centerY = canvasHeight / 2;
    const safeY = Math.max(100, Math.min(canvasHeight - 100, centerY));
    
    console.log('Canvas height:', canvasHeight, 'Safe center Y:', safeY);
    
    // COMPLETE state reset - create entirely new state object
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
    
    // Reset score display immediately
    onScoreUpdate(0);
    
    console.log('✅ Complete game reset - bird at center Y:', safeY, 'all systems clean');
  }, [onScoreUpdate]);

  const resetGame = useCallback((canvasHeight: number) => {
    completeGameReset(canvasHeight);
  }, [completeGameReset]);

  const startGame = useCallback(() => {
    if (gameStateRef.current.gameStarted) return;
    
    console.log('🚀 Starting game - enabling physics and spawning');
    gameStateRef.current.gameStarted = true;
    gameStateRef.current.lastPipeSpawn = gameStateRef.current.frameCount + 120;
    
    // Give bird initial jump with proper velocity reset
    gameStateRef.current.bird.velocity = -6;
    
    console.log('✅ Game started - bird ready for action');
  }, []);

  const continueGame = useCallback(() => {
    console.log('💫 Continuing game after Pi Ad revive');
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    
    // Reset bird to safe center position with clean physics
    const centerY = canvas.height / 2;
    const safeY = Math.max(100, Math.min(canvas.height - 100, centerY));
    
    gameStateRef.current.bird = {
      x: 80,
      y: safeY,
      velocity: 0,
      rotation: 0
    };
    
    gameStateRef.current.gameOver = false;
    gameStateRef.current.gameStarted = false; // Reset to show "tap to continue" state
    
    // Clear nearby pipes for safe respawn
    gameStateRef.current.pipes = gameStateRef.current.pipes.filter(pipe => 
      pipe.x > gameStateRef.current.bird.x + 400
    );
    
    gameStateRef.current.lastPipeSpawn = gameStateRef.current.frameCount + 200;
    
    console.log('✅ Continue complete - bird respawned safely at Y:', safeY, 'waiting for tap to continue');
  }, []);

  const jump = useCallback(() => {
    if (gameState === 'playing' && !gameStateRef.current.gameOver) {
      // Start game on first jump
      if (!gameStateRef.current.gameStarted) {
        startGame();
      }
      
      // Apply jump force with velocity reset for clean jump
      gameStateRef.current.bird.velocity = -8;
      console.log('🦅 Bird jumped! Clean velocity:', gameStateRef.current.bird.velocity);
    }
  }, [gameState, startGame]);

  const checkCollisions = useCallback((canvas: HTMLCanvasElement) => {
    const { bird, pipes, gameOver, gameStarted } = gameStateRef.current;
    
    if (gameOver || gameState !== 'playing' || !gameStarted) return false;
    
    // Bird hitbox with refined collision detection
    const BIRD_SIZE = 16;
    const birdLeft = bird.x - BIRD_SIZE/2 + 6;
    const birdRight = bird.x + BIRD_SIZE/2 - 6;
    const birdTop = bird.y - BIRD_SIZE/2 + 6;
    const birdBottom = bird.y + BIRD_SIZE/2 - 6;
    
    // Check ceiling collision with proper bounds
    if (birdTop <= 25) {
      console.log('💥 Bird hit ceiling! Y:', bird.y);
      return true;
    }
    
    // Check ground collision with proper bounds
    if (birdBottom >= canvas.height - 65) {
      console.log('💥 Bird hit ground! Y:', bird.y);
      return true;
    }
    
    // Check pipe collisions with accurate hitboxes
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
