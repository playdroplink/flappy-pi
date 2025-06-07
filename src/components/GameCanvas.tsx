
import React, { useEffect } from 'react';
import { useGameLoop } from '../hooks/useGameLoop';
import { useGamePhysics } from '../hooks/useGamePhysics';
import { useGameRenderer } from '../hooks/useGameRenderer';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';
import { useAudioManager } from '../hooks/useAudioManager';
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
  
  // Use the fixed audio manager instead of multiple sound systems
  const { playWingFlap, playPoint, playHit, playDie, audioUnlocked } = useAudioManager({ 
    musicEnabled, 
    gameState 
  });

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

  const { updateGame, resetGameWithLives, livesSystem, heartsSystem, flashTimer, redFlashTimer } = useGamePhysics({
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
    flashTimer: redFlashTimer // Use red flash timer for bump effects
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

  // Show audio unlock status in console for debugging
  useEffect(() => {
    console.log('Audio unlocked status:', audioUnlocked);
  }, [audioUnlocked]);

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
