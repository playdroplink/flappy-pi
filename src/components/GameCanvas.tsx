
import React, { useEffect } from 'react';
import { useGameLoop } from '../hooks/useGameLoop';
import { useGamePhysics } from '../hooks/useGamePhysics';
import { useGameRenderer } from '../hooks/useGameRenderer';
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
  
  const { playWingFlap, playPoint, playHit, audioUnlocked } = useAudioManager({ 
    musicEnabled, 
    gameState 
  });

  const { gameStateRef, resetGame, jump, checkCollisions } = useGameLoop({
    gameState,
    onCollision: () => {
      console.log('Collision detected');
      playHit();
      onCollision();
    },
    onScoreUpdate: (score) => {
      console.log('Score updated:', score);
      onScoreUpdate(score);
    }
  });

  const { updateGame, resetGameWithLives } = useGamePhysics({
    gameStateRef,
    onScoreUpdate: (score) => {
      playPoint();
      onScoreUpdate(score);
    },
    onCoinEarned,
    checkCollisions,
    onCollision: () => {
      playHit();
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
    userDifficulty
  });

  useGameInputHandlers({
    gameState,
    jump: () => {
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
      resetGame(canvasHeight);
      resetGameWithLives();
      if (resetVisuals) {
        resetVisuals();
      }
    },
    canvasRef,
    resetVisuals
  });

  // Log audio status for debugging
  useEffect(() => {
    console.log('Audio unlocked:', audioUnlocked);
  }, [audioUnlocked]);

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
