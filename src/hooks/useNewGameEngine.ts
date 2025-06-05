
import { useRef, useCallback, useState } from 'react';

interface Bird {
  x: number;
  y: number;
  velocity: number;
  rotation: number;
}

interface Pipe {
  id: string;
  x: number;
  topHeight: number;
  bottomY: number;
  scored: boolean;
  width: number;
}

interface GameState {
  bird: Bird;
  pipes: Pipe[];
  score: number;
  isPlaying: boolean;
  gameOver: boolean;
  frameCount: number;
}

interface GameConfig {
  gravity: number;
  jumpStrength: number;
  pipeSpeed: number;
  pipeGap: number;
  spawnDistance: number;
}

const GAME_CONFIGS = {
  classic: {
    gravity: 0.4,
    jumpStrength: -8,
    pipeSpeed: 3,
    pipeGap: 200,
    spawnDistance: 300
  },
  endless: {
    gravity: 0.35,
    jumpStrength: -7.5,
    pipeSpeed: 2.5,
    pipeGap: 220,
    spawnDistance: 280
  },
  challenge: {
    gravity: 0.45,
    jumpStrength: -8.5,
    pipeSpeed: 4,
    pipeGap: 180,
    spawnDistance: 250
  }
};

export const useNewGameEngine = (gameMode: 'classic' | 'endless' | 'challenge') => {
  const [gameState, setGameState] = useState<GameState>({
    bird: { x: 100, y: 300, velocity: 0, rotation: 0 },
    pipes: [],
    score: 0,
    isPlaying: false,
    gameOver: false,
    frameCount: 0
  });

  const configRef = useRef<GameConfig>(GAME_CONFIGS[gameMode]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const resetGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const centerY = canvas.height / 2;
    
    setGameState({
      bird: { x: 100, y: centerY, velocity: 0, rotation: 0 },
      pipes: [],
      score: 0,
      isPlaying: true,
      gameOver: false,
      frameCount: 0
    });

    console.log('New game engine reset - mode:', gameMode);
  }, [gameMode]);

  const jump = useCallback(() => {
    if (!gameState.isPlaying || gameState.gameOver) return;

    setGameState(prev => ({
      ...prev,
      bird: {
        ...prev.bird,
        velocity: configRef.current.jumpStrength
      }
    }));
  }, [gameState.isPlaying, gameState.gameOver]);

  const updateGame = useCallback(() => {
    if (!gameState.isPlaying || gameState.gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    setGameState(prev => {
      const config = configRef.current;
      const newState = { ...prev };

      // Update bird physics
      newState.bird = {
        ...prev.bird,
        velocity: prev.bird.velocity + config.gravity,
        y: prev.bird.y + prev.bird.velocity,
        rotation: Math.min(Math.max(prev.bird.velocity * 3, -30), 90)
      };

      // Spawn pipes
      if (prev.frameCount % Math.floor(config.spawnDistance / config.pipeSpeed) === 0) {
        const pipeHeight = Math.random() * (canvas.height - config.pipeGap - 100) + 50;
        const newPipe: Pipe = {
          id: `pipe-${prev.frameCount}`,
          x: canvas.width,
          topHeight: pipeHeight,
          bottomY: pipeHeight + config.pipeGap,
          scored: false,
          width: 80
        };
        newState.pipes = [...prev.pipes, newPipe];
      }

      // Update pipes and check scoring
      newState.pipes = prev.pipes
        .map(pipe => {
          const updatedPipe = { ...pipe, x: pipe.x - config.pipeSpeed };
          
          // Check if bird passed pipe for scoring
          if (!updatedPipe.scored && prev.bird.x > updatedPipe.x + updatedPipe.width) {
            updatedPipe.scored = true;
            newState.score = prev.score + 1;
            console.log('Score:', newState.score);
          }
          
          return updatedPipe;
        })
        .filter(pipe => pipe.x > -pipe.width);

      // Check collisions (only pipes)
      const BIRD_SIZE = 25;
      for (const pipe of newState.pipes) {
        if (
          newState.bird.x + BIRD_SIZE > pipe.x &&
          newState.bird.x < pipe.x + pipe.width
        ) {
          if (
            newState.bird.y < pipe.topHeight ||
            newState.bird.y + BIRD_SIZE > pipe.bottomY
          ) {
            newState.gameOver = true;
            newState.isPlaying = false;
            console.log('Collision detected - Game Over');
            break;
          }
        }
      }

      newState.frameCount = prev.frameCount + 1;
      return newState;
    });
  }, [gameState.isPlaying, gameState.gameOver]);

  const setCanvas = useCallback((canvas: HTMLCanvasElement | null) => {
    canvasRef.current = canvas;
  }, []);

  return {
    gameState,
    resetGame,
    jump,
    updateGame,
    setCanvas,
    config: configRef.current
  };
};
