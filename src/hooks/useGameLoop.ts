
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
  gapSize?: number;
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
    console.log('💫 Continuing game after revive');
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    
    // Reset bird to center position with clean physics
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
    
    // Clear nearby pipes for safe respawn
    gameStateRef.current.pipes = gameStateRef.current.pipes.filter(pipe => 
      pipe.x > gameStateRef.current.bird.x + 400
    );
    
    gameStateRef.current.lastPipeSpawn = gameStateRef.current.frameCount + 200;
    
    console.log('✅ Continue complete - bird respawned safely at Y:', safeY);
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
    
    // Mobile-responsive bird hitbox - slightly smaller for easier gameplay
    const isMobile = window.innerWidth <= 768;
    const BIRD_SIZE = isMobile ? 14 : 16;
    const hitboxMargin = isMobile ? 8 : 6;
    
    const birdLeft = bird.x - BIRD_SIZE/2 + hitboxMargin;
    const birdRight = bird.x + BIRD_SIZE/2 - hitboxMargin;
    const birdTop = bird.y - BIRD_SIZE/2 + hitboxMargin;
    const birdBottom = bird.y + BIRD_SIZE/2 - hitboxMargin;
    
    // Check ceiling collision with proper bounds
    if (birdTop <= 25) {
      console.log('💥 Bird hit ceiling! Y:', bird.y);
      return true;
    }
    
    // Check ground collision with proper bounds - more forgiving on mobile
    const groundMargin = isMobile ? 80 : 65;
    if (birdBottom >= canvas.height - groundMargin) {
      console.log('💥 Bird hit ground! Y:', bird.y, 'Ground at:', canvas.height - groundMargin);
      return true;
    }
    
    // Check pipe collisions with mobile-responsive hitboxes
    for (const pipe of pipes) {
      const pipeWidth = pipe.width || (isMobile ? 60 : 80);
      const pipeMargin = isMobile ? 8 : 6;
      const pipeLeft = pipe.x + pipeMargin;
      const pipeRight = pipe.x + pipeWidth - pipeMargin;
      
      if (birdRight > pipeLeft && birdLeft < pipeRight) {
        // Top pipe collision - more forgiving on mobile
        if (birdTop < pipe.topHeight - pipeMargin) {
          console.log('💥 Bird hit top pipe!', {
            birdTop,
            pipeTopHeight: pipe.topHeight,
            margin: pipeMargin
          });
          return true;
        }
        
        // Bottom pipe collision - more forgiving on mobile
        if (birdBottom > pipe.bottomY + pipeMargin) {
          console.log('💥 Bird hit bottom pipe!', {
            birdBottom,
            pipeBottomY: pipe.bottomY,
            margin: pipeMargin
          });
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
