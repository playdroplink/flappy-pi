
import React, { useEffect } from 'react';
import { useGameLoop } from '../hooks/useGameLoop';
import { useGamePhysics } from '../hooks/useGamePhysics';
import { useGameRenderer } from '../hooks/useGameRenderer';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { useCanvasSetup } from '../hooks/useCanvasSetup';
import { useGameInputHandlers } from '../hooks/useGameInputHandlers';
import { useGameLoopManager } from '../hooks/useGameLoopManager';

interface GameCanvasProps {
  gameState: 'menu' | 'playing' | 'gameOver' | 'paused';
  gameMode: 'classic' | 'endless' | 'challenge';
  level: number;
  onCollision: () => void;
  onGameOver: (score: number) => void;
  onScoreUpdate: (score: number) => void;
  onCoinEarned: (coins: number) => void;
  birdSkin: string;
  musicEnabled: boolean;
  onContinueGameRef?: (fn: () => void) => void;
  userDifficulty?: 'easy' | 'medium' | 'hard';
}

const GameCanvas: React.FC<GameCanvasProps> = ({
  gameState,
  gameMode,
  level,
  onCollision,
  onGameOver,
  onScoreUpdate,
  onCoinEarned,
  birdSkin,
  musicEnabled,
  onContinueGameRef,
  userDifficulty = 'medium'
}) => {
  const { canvasRef } = useCanvasSetup();
  
  // Create a ref to store the continue game function
  const continueGameRef = React.useRef<(() => void) | null>(null);

  useBackgroundMusic({ musicEnabled, gameState });
  
  const { initializeGameSounds, playWingFlap, playPoint, playHit, playDie } = useSoundEffects();

  const { gameStateRef, resetGame, continueGame, jump, checkCollisions } = useGameLoop({
    gameState,
    onCollision: () => {
      console.log('Collision detected in GameCanvas');
      playHit();
      onCollision();
    },
    onScoreUpdate: (score) => {
      console.log('Score updated in GameCanvas:', score);
      onScoreUpdate(score);
    }
  });

  // Track the last game state to detect state changes
  const lastGameStateRef = React.useRef(gameState);

  const { updateGame, resetGameWithLives, livesSystem, heartsSystem, flashTimer } = useGamePhysics({
    gameStateRef,
    onScoreUpdate: (score) => {
      console.log('Physics score update:', score);
      playPoint();
      onScoreUpdate(score);
    },
    onCoinEarned: (coins) => {
      console.log('Coins earned:', coins);
      onCoinEarned(coins);
    },
    checkCollisions,
    onCollision: () => {
      console.log('Physics collision detected');
      playDie();
      onCollision();
    },
    gameMode,
    userDifficulty
  });

  const { draw, resetVisuals } = useGameRenderer({ 
    canvasRef, 
    gameStateRef, 
    birdSkin,
    gameMode,
    userDifficulty,
    livesSystem,
    heartsSystem,
    flashTimer
  });

  useGameInputHandlers({
    gameState,
    jump: () => {
      console.log('Jump triggered');
      jump();
      playWingFlap();
    },
    playWingFlap
  });

  useGameLoopManager({
    gameState,
    gameStateRef,
    updateGame,
    draw,
    resetGame: (canvasHeight: number) => {
      console.log('Resetting game with canvas height:', canvasHeight);
      resetGame(canvasHeight);
      resetGameWithLives();
      if (resetVisuals) {
        resetVisuals();
      }
    },
    canvasRef,
    resetVisuals
  });

  useEffect(() => {
    console.log('Initializing game sounds');
    initializeGameSounds();
  }, [initializeGameSounds]);

  useEffect(() => {
    if (onContinueGameRef) {
      onContinueGameRef(continueGame);
    }
  }, [continueGame, onContinueGameRef]);

  // Detect when game transitions from 'gameOver' to 'playing' to ensure proper reset
  useEffect(() => {
    console.log('Game state changed from', lastGameStateRef.current, 'to', gameState);
    if (lastGameStateRef.current === 'gameOver' && gameState === 'playing') {
      console.log('Detected restart from game over to playing - ensuring proper bird reset');
      const canvas = canvasRef.current;
      if (canvas) {
        resetGame(canvas.height);
        resetGameWithLives();
        if (resetVisuals) resetVisuals();
      }
    }
    lastGameStateRef.current = gameState;
  }, [gameState, resetGame, resetGameWithLives, resetVisuals, canvasRef]);

  // Ensure canvas is properly sized
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        console.log('Canvas resized to:', canvas.width, 'x', canvas.height);
      };
      
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      
      return () => {
        window.removeEventListener('resize', resizeCanvas);
      };
    }
  }, [canvasRef]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed bg-gradient-to-b from-sky-400 to-sky-600 touch-none"
      style={{ 
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        position: 'fixed',
        zIndex: 1,
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh'
      }}
    />
  );
};

export default GameCanvas;
