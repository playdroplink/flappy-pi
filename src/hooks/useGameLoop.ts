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
          console.log('✅ Canvas ready for game reset:', canvas.width, 'x', canvas.height);
          resolve(canvas);
        } else {
          setTimeout(checkCanvas, 50);
        }
      };
      checkCanvas();
      
      setTimeout(() => reject(new Error('Canvas timeout')), 3000);
    });
  }, []);

  const resetGame = useCallback(async () => {
    console.log('🔄 MASTER RESET - Starting complete game reset');
    
    // Clear any pending operations
    if (initializationTimeoutRef.current) {
      clearTimeout(initializationTimeoutRef.current);
    }

    try {
      const canvas = await waitForCanvas();
      
      // Calculate safe bird position
      const safeY = Math.max(100, Math.min(canvas.height / 2, canvas.height - 200));
      const safeX = Math.max(80, canvas.width * 0.15);
      
      console.log('🐦 Resetting bird to safe position:', safeX, safeY);
      
      // COMPLETE STATE RESET - Fix all restart issues
      gameStateRef.current = {
        bird: { 
          x: safeX, 
          y: safeY, 
          velocity: 0,  // Reset velocity completely
          rotation: 0   // Reset rotation
        },
        pipes: [],      // Clear all pipes
        clouds: [],     // Clear all clouds
        frameCount: 0,  // Reset frame counter
        score: 0,       // Reset score to zero
        lastPipeSpawn: 400, // Safe delay before first pipe
        gameOver: false,    // Clear game over flag
        gameStarted: false, // Reset game started flag
        isInitialized: true,
        canvasReady: true
      };
      
      // Update score display immediately
      onScoreUpdate(0);
      console.log('✅ MASTER RESET COMPLETE - All states cleared');
      
    } catch (error) {
      console.error('❌ Canvas reset failed:', error);
      // Fallback reset without canvas dependency
      gameStateRef.current = {
        bird: { x: 100, y: 300, velocity: 0, rotation: 0 },
        pipes: [],
        clouds: [],
        frameCount: 0,
        score: 0,
        lastPipeSpawn: 400,
        gameOver: false,
        gameStarted: false,
        isInitialized: false,
        canvasReady: false
      };
      onScoreUpdate(0);
    }
  }, [onScoreUpdate, waitForCanvas]);

  const continueGame = useCallback(async () => {
    console.log('🚀 CONTINUE GAME - After ad or revive');
    
    try {
      const canvas = await waitForCanvas();
      const safeY = Math.max(100, Math.min(canvas.height / 2, canvas.height - 200));
      const safeX = Math.max(80, canvas.width * 0.15);
      
      // Reset bird for continue (keep score and some pipes)
      gameStateRef.current.bird = {
        x: safeX,
        y: safeY,
        velocity: -5,  // Small upward boost
        rotation: -10
      };
      
      // Clear ONLY dangerous pipes near bird
      const birdX = gameStateRef.current.bird.x;
      gameStateRef.current.pipes = gameStateRef.current.pipes.filter(pipe => 
        pipe.x > birdX + 400  // Keep distant pipes
      );
      
      // Reset critical flags for continue
      gameStateRef.current.gameOver = false;
      gameStateRef.current.gameStarted = true;
      gameStateRef.current.isInitialized = true;
      gameStateRef.current.canvasReady = true;
      gameStateRef.current.lastPipeSpawn = gameStateRef.current.frameCount + 300;
      
      console.log('✅ Continue successful - Score preserved:', gameStateRef.current.score);
      
    } catch (error) {
      console.error('❌ Continue failed, falling back to reset:', error);
      await resetGame();
    }
  }, [waitForCanvas, resetGame]);

  const jump = useCallback(() => {
    const state = gameStateRef.current;
    
    // Enhanced jump validation
    if (gameState !== 'playing' || !state.canvasReady || !state.isInitialized) {
      console.log('⚠️ Jump blocked - game not ready');
      return;
    }

    if (state.gameOver) {
      console.log('⚠️ Jump blocked - game over');
      return;
    }
    
    // Start game on first jump
    if (!state.gameStarted) {
      state.gameStarted = true;
      console.log('🎮 GAME STARTED with first jump!');
    }
    
    // Apply jump physics
    state.bird.velocity = -8.5;  // Consistent jump strength
    state.bird.rotation = -20;
    console.log('🐦 Bird jumped! New velocity:', state.bird.velocity);
  }, [gameState]);

  const checkCollisions = useCallback((canvas: HTMLCanvasElement) => {
    const state = gameStateRef.current;
    
    // Enhanced collision validation
    if (!state || state.gameOver || gameState !== 'playing' || !state.gameStarted || !state.canvasReady) {
      return false;
    }
    
    const BIRD_SIZE = 25;
    const PIPE_WIDTH = 120;
    const bird = state.bird;
    
    // Ground collision (with margin)
    if (bird.y + BIRD_SIZE >= canvas.height - 30) {
      console.log('💥 GROUND COLLISION - Game Over');
      return true;
    }

    // Ceiling collision
    if (bird.y <= 10) {
      console.log('💥 CEILING COLLISION - Game Over');
      return true;
    }
    
    // Pipe collisions with forgiving hitbox
    for (const pipe of state.pipes) {
      const birdLeft = bird.x + 5;
      const birdRight = bird.x + BIRD_SIZE - 5;
      const birdTop = bird.y + 5;
      const birdBottom = bird.y + BIRD_SIZE - 5;
      
      const pipeLeft = pipe.x;
      const pipeRight = pipe.x + PIPE_WIDTH;
      
      if (birdRight > pipeLeft && birdLeft < pipeRight) {
        if (birdTop < pipe.topHeight || birdBottom > pipe.bottomY) {
          console.log('💥 PIPE COLLISION - Game Over');
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
