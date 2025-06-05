import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useGameLoop } from '../hooks/useGameLoop';
import { useGamePhysics } from '../hooks/useGamePhysics';
import { useGameRenderer } from '../hooks/useGameRenderer';

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
  musicEnabled
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number>();
  const [score, setScore] = useState(0);

  const { gameStateRef, resetGame, jump, checkCollisions } = useGameLoop({
    gameState,
    onCollision,
    onScoreUpdate
  });

  const { updateGame } = useGamePhysics({
    gameStateRef,
    onScoreUpdate,
    onCoinEarned,
    checkCollisions,
    onCollision,
    gameMode
  });

  const { draw } = useGameRenderer({ 
    canvasRef, 
    gameStateRef, 
    birdSkin,
    gameMode 
  });

  const gameLoop = useCallback(() => {
    updateGame();
    draw();
    
    if (gameState === 'playing') {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
  }, [updateGame, draw, gameState]);

  // Handle input
  useEffect(() => {
    const handleClick = () => jump();
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };

    if (gameState === 'playing') {
      window.addEventListener('click', handleClick);
      window.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [jump, gameState]);

  // Game loop management
  useEffect(() => {
    if (gameState === 'playing') {
      const canvas = canvasRef.current;
      if (canvas) {
        resetGame(canvas.height);
      }
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, gameLoop, resetGame]);

  // Canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full bg-gradient-to-b from-sky-400 to-sky-600 touch-none"
      style={{ 
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none'
      }}
    />
  );
};

export default GameCanvas;
