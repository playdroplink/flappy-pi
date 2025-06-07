import { useRef, useCallback } from 'react';
import { FLAPPY_BIRD_CONSTANTS } from '../utils/gameConstants';

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
    console.log('🔄 COMPLETE GAME RESET - Standardized Flappy Bird reset');
    
    const centerY = canvasHeight / 2;
    const safeY = Math.max(100, Math.min(canvasHeight - 100, centerY));
    
    // Reset to standardized initial state
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
    
    onScoreUpdate(0);
    console.log('✅ Standardized reset complete - bird at Y:', safeY);
  }, [onScoreUpdate]);

  const resetGame = useCallback((canvasHeight: number) => {
    completeGameReset(canvasHeight);
  }, [completeGameReset]);

  const startGame = useCallback(() => {
    if (gameStateRef.current.gameStarted) return;
    
    console.log('🚀 Starting standardized Flappy Bird game');
    gameStateRef.current.gameStarted = true;
    gameStateRef.current.lastPipeSpawn = gameStateRef.current.frameCount + 120;
    
    // Apply standardized initial jump
    gameStateRef.current.bird.velocity = FLAPPY_BIRD_CONSTANTS.BIRD.JUMP_VELOCITY;
    
    console.log('✅ Game started with standard physics');
  }, []);

  const continueGame = useCallback(() => {
    console.log('💫 Continuing game with standardized respawn');
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    
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
    
    console.log('✅ Standardized continue complete');
  }, []);

  const jump = useCallback(() => {
    if (gameState === 'playing' && !gameStateRef.current.gameOver) {
      if (!gameStateRef.current.gameStarted) {
        startGame();
      }
      
      // Apply standardized jump velocity
      gameStateRef.current.bird.velocity = FLAPPY_BIRD_CONSTANTS.BIRD.JUMP_VELOCITY;
      console.log('🦅 Standardized jump! Velocity:', FLAPPY_BIRD_CONSTANTS.BIRD.JUMP_VELOCITY);
    }
  }, [gameState, startGame]);

  const checkCollisions = useCallback((canvas: HTMLCanvasElement) => {
    const { bird, pipes, gameOver, gameStarted } = gameStateRef.current;
    
    if (gameOver || gameState !== 'playing' || !gameStarted) return false;
    
    // Standardized collision detection
    const isMobile = window.innerWidth <= FLAPPY_BIRD_CONSTANTS.SCREEN.MOBILE_BREAKPOINT;
    const hitboxMargin = FLAPPY_BIRD_CONSTANTS.COLLISION.BIRD_HITBOX_MARGIN;
    
    const birdLeft = bird.x - FLAPPY_BIRD_CONSTANTS.BIRD.SIZE/2 + hitboxMargin;
    const birdRight = bird.x + FLAPPY_BIRD_CONSTANTS.BIRD.SIZE/2 - hitboxMargin;
    const birdTop = bird.y - FLAPPY_BIRD_CONSTANTS.BIRD.SIZE/2 + hitboxMargin;
    const birdBottom = bird.y + FLAPPY_BIRD_CONSTANTS.BIRD.SIZE/2 - hitboxMargin;
    
    // Check ceiling collision
    if (birdTop <= 25) {
      console.log('💥 Bird hit ceiling! Y:', bird.y);
      return true;
    }
    
    // Check ground collision with standardized margin
    const groundMargin = isMobile 
      ? FLAPPY_BIRD_CONSTANTS.COLLISION.GROUND_MARGIN_MOBILE 
      : FLAPPY_BIRD_CONSTANTS.COLLISION.GROUND_MARGIN_DESKTOP;
      
    if (birdBottom >= canvas.height - groundMargin) {
      console.log('💥 Bird hit ground! Y:', bird.y, 'Ground at:', canvas.height - groundMargin);
      return true;
    }
    
    // Check pipe collisions with standardized hitboxes
    for (const pipe of pipes) {
      const pipeWidth = pipe.width || (isMobile ? FLAPPY_BIRD_CONSTANTS.PIPES.WIDTH_MOBILE : FLAPPY_BIRD_CONSTANTS.PIPES.WIDTH_DESKTOP);
      const pipeMargin = FLAPPY_BIRD_CONSTANTS.COLLISION.PIPE_HITBOX_MARGIN;
      const pipeLeft = pipe.x + pipeMargin;
      const pipeRight = pipe.x + pipeWidth - pipeMargin;
      
      if (birdRight > pipeLeft && birdLeft < pipeRight) {
        // Top pipe collision
        if (birdTop < pipe.topHeight - pipeMargin) {
          console.log('💥 Bird hit top pipe!', {
            birdTop,
            pipeTopHeight: pipe.topHeight,
            margin: pipeMargin
          });
          return true;
        }
        
        // Bottom pipe collision
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
