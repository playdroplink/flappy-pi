
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
  isInitialized: boolean; // Add flag to track if game is properly initialized
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
    console.log('🔄 Resetting game - checking canvas availability');
    const canvas = document.querySelector('canvas');
    
    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      console.warn('⚠️ Canvas not ready, scheduling reset retry');
      // Retry reset after a short delay if canvas isn't ready
      setTimeout(() => resetGame(), 100);
      return;
    }

    const canvasHeight = canvas.height;
    const canvasWidth = canvas.width;
    const safeY = Math.max(150, canvasHeight / 2);
    const safeX = Math.max(80, canvasWidth * 0.1);
    
    console.log('✅ Resetting with canvas:', canvasWidth, 'x', canvasHeight, 'Bird at:', safeX, safeY);
    
    gameStateRef.current = {
      bird: { x: safeX, y: safeY, velocity: 0, rotation: 0 },
      pipes: [],
      clouds: [],
      frameCount: 0,
      score: 0,
      lastPipeSpawn: 180, // Give more time before first pipe
      gameOver: false,
      gameStarted: false,
      isInitialized: true // Mark as properly initialized
    };
    
    onScoreUpdate(0);
    console.log('✅ Game reset complete - ready for first jump');
  }, [onScoreUpdate]);

  const continueGame = useCallback(() => {
    console.log('🚀 Continuing game after revive - preserving score:', gameStateRef.current.score);
    const canvas = document.querySelector('canvas');
    
    if (!canvas) {
      console.error('❌ Cannot continue - canvas not found');
      return;
    }
    
    const safeY = Math.max(150, canvas.height / 2);
    const safeX = Math.max(80, canvas.width * 0.1);
    
    // Reset bird to safe position with small upward velocity
    gameStateRef.current.bird = {
      x: safeX,
      y: safeY,
      velocity: -3, // Small upward boost
      rotation: -10
    };
    
    // Clear game over flag and mark as started
    gameStateRef.current.gameOver = false;
    gameStateRef.current.gameStarted = true;
    gameStateRef.current.isInitialized = true;
    
    // Remove pipes that are too close to give player breathing room
    gameStateRef.current.pipes = gameStateRef.current.pipes.filter(pipe => 
      pipe.x > gameStateRef.current.bird.x + 400
    );
    
    // Reset spawn timer to give time before next pipe
    gameStateRef.current.lastPipeSpawn = gameStateRef.current.frameCount + 200;
    
    console.log('✅ Continue complete - Bird repositioned safely');
  }, []);

  const jump = useCallback(() => {
    // Only allow jumping if game is playing and initialized
    if (gameState !== 'playing' || !gameStateRef.current.isInitialized) {
      console.log('⚠️ Jump ignored - game not ready or not playing');
      return;
    }

    if (gameStateRef.current.gameOver) {
      console.log('⚠️ Jump ignored - game is over');
      return;
    }
    
    // Mark game as started on first jump
    if (!gameStateRef.current.gameStarted) {
      gameStateRef.current.gameStarted = true;
      console.log('🎮 Game started with first jump!');
    }
    
    gameStateRef.current.bird.velocity = -8; // Slightly stronger jump
    console.log('🐦 Bird jumped! Velocity:', gameStateRef.current.bird.velocity);
  }, [gameState]);

  const checkCollisions = useCallback((canvas: HTMLCanvasElement) => {
    const { bird, pipes, gameOver, gameStarted, isInitialized } = gameStateRef.current;
    
    // Don't check collisions if game conditions aren't met
    if (gameOver || gameState !== 'playing' || !gameStarted || !isInitialized) {
      return false;
    }
    
    const BIRD_SIZE = 25;
    const PIPE_WIDTH = 120;
    
    // Ground collision with better bounds checking
    if (bird.y + BIRD_SIZE >= canvas.height - 25) {
      console.log('💥 Ground collision! Bird Y:', bird.y, 'Ground level:', canvas.height - 25);
      return true;
    }

    // Ceiling collision
    if (bird.y <= 5) {
      console.log('💥 Ceiling collision! Bird Y:', bird.y);
      return true;
    }
    
    // Pipe collisions with more forgiving hitbox
    for (const pipe of pipes) {
      const birdLeft = bird.x + 5; // More forgiving left edge
      const birdRight = bird.x + BIRD_SIZE - 5; // More forgiving right edge
      const birdTop = bird.y + 5; // More forgiving top edge
      const birdBottom = bird.y + BIRD_SIZE - 5; // More forgiving bottom edge
      
      const pipeLeft = pipe.x;
      const pipeRight = pipe.x + PIPE_WIDTH;
      
      // Check if bird is horizontally within pipe area
      if (birdRight > pipeLeft && birdLeft < pipeRight) {
        // Check vertical collision with top or bottom pipe
        if (birdTop < pipe.topHeight || birdBottom > pipe.bottomY) {
          console.log('💥 Pipe collision! Bird bounds:', {
            x: birdLeft, y: birdTop, width: BIRD_SIZE-10, height: BIRD_SIZE-10
          }, 'Pipe:', { x: pipeLeft, topHeight: pipe.topHeight, bottomY: pipe.bottomY });
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
