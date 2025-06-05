
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
  canvasReady: boolean;
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
    isInitialized: false,
    canvasReady: false
  });

  const initializationTimeoutRef = useRef<NodeJS.Timeout>();

  const waitForCanvas = useCallback((): Promise<HTMLCanvasElement> => {
    return new Promise((resolve, reject) => {
      const checkCanvas = () => {
        const canvas = document.querySelector('canvas') as HTMLCanvasElement;
        if (canvas && canvas.width > 0 && canvas.height > 0) {
          console.log('✅ Canvas ready:', canvas.width, 'x', canvas.height);
          gameStateRef.current.canvasReady = true;
          resolve(canvas);
        } else {
          console.log('⏳ Waiting for canvas...');
          setTimeout(checkCanvas, 50);
        }
      };
      checkCanvas();
      
      // Timeout after 5 seconds
      setTimeout(() => reject(new Error('Canvas initialization timeout')), 5000);
    });
  }, []);

  const resetGame = useCallback(async () => {
    console.log('🔄 Starting complete game reset');
    
    // Clear any pending initialization
    if (initializationTimeoutRef.current) {
      clearTimeout(initializationTimeoutRef.current);
    }

    try {
      const canvas = await waitForCanvas();
      const safeY = Math.max(150, canvas.height / 2);
      const safeX = Math.max(80, canvas.width * 0.1);
      
      console.log('✅ Canvas verified - resetting game state');
      
      // Complete state reset
      gameStateRef.current = {
        bird: { x: safeX, y: safeY, velocity: 0, rotation: 0 },
        pipes: [],
        clouds: [],
        frameCount: 0,
        score: 0,
        lastPipeSpawn: 300, // Generous delay for first pipe
        gameOver: false,
        gameStarted: false,
        isInitialized: true,
        canvasReady: true
      };
      
      onScoreUpdate(0);
      console.log('✅ Game reset complete - ready for first jump');
      
    } catch (error) {
      console.error('❌ Canvas initialization failed:', error);
      // Fallback initialization
      gameStateRef.current = {
        bird: { x: 100, y: 300, velocity: 0, rotation: 0 },
        pipes: [],
        clouds: [],
        frameCount: 0,
        score: 0,
        lastPipeSpawn: 300,
        gameOver: false,
        gameStarted: false,
        isInitialized: false,
        canvasReady: false
      };
    }
  }, [onScoreUpdate, waitForCanvas]);

  const continueGame = useCallback(async () => {
    console.log('🚀 Continuing game after revive');
    
    try {
      const canvas = await waitForCanvas();
      const safeY = Math.max(150, canvas.height / 2);
      const safeX = Math.max(80, canvas.width * 0.1);
      
      // Reset bird to safe position with small boost
      gameStateRef.current.bird = {
        x: safeX,
        y: safeY,
        velocity: -6, // Small upward boost
        rotation: -10
      };
      
      // Clear game over flags
      gameStateRef.current.gameOver = false;
      gameStateRef.current.gameStarted = true;
      gameStateRef.current.isInitialized = true;
      gameStateRef.current.canvasReady = true;
      
      // Remove dangerous pipes
      const birdX = gameStateRef.current.bird.x;
      gameStateRef.current.pipes = gameStateRef.current.pipes.filter(pipe => 
        pipe.x > birdX + 600 // More generous safety margin
      );
      
      // Reset spawn timer for safety
      gameStateRef.current.lastPipeSpawn = gameStateRef.current.frameCount + 400;
      
      console.log('✅ Continue successful - bird repositioned safely');
      
    } catch (error) {
      console.error('❌ Continue failed:', error);
      // Fallback to reset if continue fails
      await resetGame();
    }
  }, [waitForCanvas, resetGame]);

  const jump = useCallback(() => {
    const state = gameStateRef.current;
    
    if (gameState !== 'playing' || !state.canvasReady || !state.isInitialized) {
      console.log('⚠️ Jump ignored - game not ready');
      return;
    }

    if (state.gameOver) {
      console.log('⚠️ Jump ignored - game over');
      return;
    }
    
    // Start game on first jump
    if (!state.gameStarted) {
      state.gameStarted = true;
      console.log('🎮 Game started with first jump!');
    }
    
    state.bird.velocity = -9;
    state.bird.rotation = -20;
    console.log('🐦 Bird jumped! Velocity:', state.bird.velocity);
  }, [gameState]);

  const checkCollisions = useCallback((canvas: HTMLCanvasElement) => {
    const state = gameStateRef.current;
    
    if (!state || state.gameOver || gameState !== 'playing' || !state.gameStarted || !state.canvasReady) {
      return false;
    }
    
    const BIRD_SIZE = 25;
    const PIPE_WIDTH = 120;
    const bird = state.bird;
    
    // Ground collision with margin
    if (bird.y + BIRD_SIZE >= canvas.height - 30) {
      console.log('💥 Ground collision');
      return true;
    }

    // Ceiling collision
    if (bird.y <= 10) {
      console.log('💥 Ceiling collision');
      return true;
    }
    
    // Pipe collisions with forgiving hitbox
    for (const pipe of state.pipes) {
      const birdLeft = bird.x + 6;
      const birdRight = bird.x + BIRD_SIZE - 6;
      const birdTop = bird.y + 6;
      const birdBottom = bird.y + BIRD_SIZE - 6;
      
      const pipeLeft = pipe.x;
      const pipeRight = pipe.x + PIPE_WIDTH;
      
      if (birdRight > pipeLeft && birdLeft < pipeRight) {
        if (birdTop < pipe.topHeight || birdBottom > pipe.bottomY) {
          console.log('💥 Pipe collision');
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
