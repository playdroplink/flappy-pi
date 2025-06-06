
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
      playHit();
      onCollision();
    },
    onScoreUpdate
  });

  const { updateGame, resetGameWithLives, livesSystem, heartsSystem, flashTimer } = useGamePhysics({
    gameStateRef,
    onScoreUpdate: (score) => {
      playPoint();
      onScoreUpdate(score);
    },
    onCoinEarned,
    checkCollisions,
    onCollision: () => {
      playDie();
      onCollision();
    },
    gameMode,
    userDifficulty
  });

  const { draw } = useGameRenderer({ 
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
    jump,
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
    },
    canvasRef
  });

  useEffect(() => {
    initializeGameSounds();
  }, [initializeGameSounds]);

  useEffect(() => {
    if (onContinueGameRef) {
      onContinueGameRef(continueGame);
    }
  }, [continueGame, onContinueGameRef]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed bg-gradient-to-b from-sky-400 to-sky-600 touch-none"
      style={{ 
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        position: 'fixed',
        zIndex: 1
      }}
    />
  );
};

export default GameCanvas;
