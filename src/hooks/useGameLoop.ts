
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
  width: number;
}

interface GameLoopState {
  bird: Bird;
  pipes: Pipe[];
  frameCount: number;
  score: number;
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
    frameCount: 0,
    score: 0,
    gameOver: false,
    initialized: false,
    gameStarted: false
  });

  const resetGame = useCallback((canvasHeight: number) => {
    const centerY = canvasHeight / 2;
    
    gameStateRef.current = {
      bird: { 
        x: 80, 
        y: centerY, 
        velocity: 0,
        rotation: 0
      },
      pipes: [],
      frameCount: 0,
      score: 0,
      gameOver: false,
      initialized: true,
      gameStarted: false
    };
    
    onScoreUpdate(0);
    console.log('Game reset - bird positioned at center Y:', centerY);
  }, [onScoreUpdate]);

  const jump = useCallback(() => {
    if (gameState === 'playing' && !gameStateRef.current.gameOver) {
      // Start game on first jump
      if (!gameStateRef.current.gameStarted) {
        gameStateRef.current.gameStarted = true;
        console.log('Game started');
      }
      
      // Apply consistent jump force
      gameStateRef.current.bird.velocity = -8;
      gameStateRef.current.bird.rotation = -0.3;
    }
  }, [gameState]);

  const checkCollisions = useCallback((canvas: HTMLCanvasElement) => {
    const { bird, pipes, gameOver, gameStarted } = gameStateRef.current;
    
    if (gameOver || gameState !== 'playing' || !gameStarted) return false;
    
    const BIRD_SIZE = 20;
    const birdLeft = bird.x - BIRD_SIZE/2;
    const birdRight = bird.x + BIRD_SIZE/2;
    const birdTop = bird.y - BIRD_SIZE/2;
    const birdBottom = bird.y + BIRD_SIZE/2;
    
    // Check ceiling collision
    if (birdTop <= 0) {
      console.log('Bird hit ceiling');
      return true;
    }
    
    // Check ground collision
    if (birdBottom >= canvas.height - 60) {
      console.log('Bird hit ground');
      return true;
    }
    
    // Check pipe collisions
    for (const pipe of pipes) {
      if (birdRight > pipe.x && birdLeft < pipe.x + pipe.width) {
        // Top pipe collision
        if (birdTop < pipe.topHeight) {
          console.log('Bird hit top pipe');
          return true;
        }
        
        // Bottom pipe collision
        if (birdBottom > pipe.bottomY) {
          console.log('Bird hit bottom pipe');
          return true;
        }
      }
    }

    return false;
  }, [gameState]);

  return {
    gameStateRef,
    resetGame,
    jump,
    checkCollisions
  };
};
