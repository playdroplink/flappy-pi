
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
  gameStarted: boolean;
  isInitialized: boolean;
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
    gameStarted: false,
    isInitialized: false
  });

  const resetGame = useCallback(() => {
    console.log('🔄 Complete game reset - creating fresh game state');
    const canvas = document.querySelector('canvas');
    
    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      console.warn('⚠️ Canvas not ready for reset, retrying...');
      setTimeout(() => resetGame(), 100);
      return;
    }

    const canvasHeight = canvas.height;
    const canvasWidth = canvas.width;
    const safeY = Math.max(150, canvasHeight / 2);
    const safeX = Math.max(80, canvasWidth * 0.1);
    
    console.log('✅ Resetting game with canvas:', canvasWidth, 'x', canvasHeight);
    
    // Complete fresh state
    gameStateRef.current = {
      bird: { x: safeX, y: safeY, velocity: 0, rotation: 0 },
      pipes: [],
      clouds: [],
      frameCount: 0,
      score: 0,
      lastPipeSpawn: 200, // Generous time before first pipe
      gameOver: false,
      gameStarted: false,
      isInitialized: true
    };
    
    onScoreUpdate(0);
    console.log('✅ Fresh game state created - waiting for first jump');
  }, [onScoreUpdate]);

  const continueGame = useCallback(() => {
    console.log('🚀 Continuing game after revive - repositioning bird safely');
    const canvas = document.querySelector('canvas');
    
    if (!canvas) {
      console.error('❌ Cannot continue - canvas not found');
      return;
    }
    
    const safeY = Math.max(150, canvas.height / 2);
    const safeX = Math.max(80, canvas.width * 0.1);
    
    // Reset bird to safe position
    gameStateRef.current.bird = {
      x: safeX,
      y: safeY,
      velocity: -5, // Small upward boost
      rotation: -15
    };
    
    // Clear game over state
    gameStateRef.current.gameOver = false;
    gameStateRef.current.gameStarted = true;
    gameStateRef.current.isInitialized = true;
    
    // Remove nearby pipes for safety
    gameStateRef.current.pipes = gameStateRef.current.pipes.filter(pipe => 
      pipe.x > gameStateRef.current.bird.x + 500
    );
    
    // Reset spawn timer
    gameStateRef.current.lastPipeSpawn = gameStateRef.current.frameCount + 300;
    
    console.log('✅ Continue complete - bird safe, score preserved:', gameStateRef.current.score);
  }, []);

  const jump = useCallback(() => {
    if (gameState !== 'playing' || !gameStateRef.current.isInitialized) {
      console.log('⚠️ Jump ignored - game not ready');
      return;
    }

    if (gameStateRef.current.gameOver) {
      console.log('⚠️ Jump ignored - game over');
      return;
    }
    
    // Start game on first jump
    if (!gameStateRef.current.gameStarted) {
      gameStateRef.current.gameStarted = true;
      console.log('🎮 Game started with first jump!');
    }
    
    gameStateRef.current.bird.velocity = -9;
    console.log('🐦 Bird jumped! New velocity:', gameStateRef.current.bird.velocity);
  }, [gameState]);

  const checkCollisions = useCallback((canvas: HTMLCanvasElement) => {
    const { bird, pipes, gameOver, gameStarted, isInitialized } = gameStateRef.current;
    
    if (gameOver || gameState !== 'playing' || !gameStarted || !isInitialized) {
      return false;
    }
    
    const BIRD_SIZE = 25;
    const PIPE_WIDTH = 120;
    
    // Ground collision
    if (bird.y + BIRD_SIZE >= canvas.height - 25) {
      console.log('💥 Ground collision detected');
      return true;
    }

    // Ceiling collision
    if (bird.y <= 5) {
      console.log('💥 Ceiling collision detected');
      return true;
    }
    
    // Pipe collisions with forgiving hitbox
    for (const pipe of pipes) {
      const birdLeft = bird.x + 8;
      const birdRight = bird.x + BIRD_SIZE - 8;
      const birdTop = bird.y + 8;
      const birdBottom = bird.y + BIRD_SIZE - 8;
      
      const pipeLeft = pipe.x;
      const pipeRight = pipe.x + PIPE_WIDTH;
      
      if (birdRight > pipeLeft && birdLeft < pipeRight) {
        if (birdTop < pipe.topHeight || birdBottom > pipe.bottomY) {
          console.log('💥 Pipe collision detected');
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
