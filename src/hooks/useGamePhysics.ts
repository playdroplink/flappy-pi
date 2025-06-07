
import { useCallback, useRef } from 'react';

interface UseGamePhysicsProps {
  gameStateRef: React.MutableRefObject<any>;
  onScoreUpdate: (score: number) => void;
  onCoinEarned: (coins: number) => void;
  checkCollisions: (canvas: HTMLCanvasElement) => boolean;
  onCollision: () => void;
  gameMode: 'classic' | 'endless' | 'challenge';
  userDifficulty?: 'easy' | 'medium' | 'hard';
}

export const useGamePhysics = ({
  gameStateRef,
  onScoreUpdate,
  onCoinEarned,
  checkCollisions,
  onCollision,
  gameMode,
  userDifficulty = 'medium'
}: UseGamePhysicsProps) => {
  const lastPipeSpawn = useRef(0);

  const generatePipe = useCallback((canvas: HTMLCanvasElement) => {
    const screenHeight = canvas.height;
    const screenWidth = canvas.width;
    
    // Responsive gap sizing
    const gapSize = Math.max(150, screenHeight * 0.28);
    const minPipeHeight = 60;
    const maxPipeHeight = screenHeight - gapSize - minPipeHeight - 80;
    
    const topHeight = Math.random() * (maxPipeHeight - minPipeHeight) + minPipeHeight;
    const bottomY = topHeight + gapSize;
    const pipeWidth = 80;
    
    return {
      x: screenWidth,
      topHeight,
      bottomY,
      passed: false,
      scored: false,
      width: pipeWidth
    };
  }, []);

  const updateGame = useCallback(() => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    if (!canvas || !gameStateRef.current?.gameStarted) return;

    const state = gameStateRef.current;

    // Update frame count
    state.frameCount++;

    // Apply gravity to bird - smooth and consistent
    state.bird.velocity += 0.5;
    state.bird.y += state.bird.velocity;

    // Update bird rotation based on velocity
    if (state.bird.velocity > 0) {
      state.bird.rotation = Math.min(state.bird.rotation + 0.05, 0.5);
    } else {
      state.bird.rotation = Math.max(state.bird.rotation - 0.02, -0.3);
    }

    // Spawn pipes at consistent intervals
    if (state.frameCount - lastPipeSpawn.current > 120) {
      const newPipe = generatePipe(canvas);
      state.pipes.push(newPipe);
      lastPipeSpawn.current = state.frameCount;
    }

    // Update pipes
    const pipeSpeed = 2.5;
    state.pipes = state.pipes.filter((pipe: any) => {
      pipe.x -= pipeSpeed;

      // Score when bird passes pipe
      if (!pipe.scored && pipe.x + pipe.width < state.bird.x) {
        pipe.scored = true;
        state.score++;
        onScoreUpdate(state.score);

        // Spawn coins occasionally
        if (Math.random() < 0.3) {
          onCoinEarned(1);
        }
      }

      return pipe.x > -pipe.width;
    });

    // Check collisions
    if (checkCollisions(canvas)) {
      onCollision();
    }
  }, [gameStateRef, onScoreUpdate, onCoinEarned, checkCollisions, onCollision, generatePipe]);

  const resetGameWithLives = useCallback(() => {
    lastPipeSpawn.current = 0;
  }, []);

  return {
    updateGame,
    resetGameWithLives
  };
};
