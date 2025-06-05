
import { useCallback } from 'react';
import { getDifficulty } from '../utils/gameDifficulty';

interface UseGamePhysicsProps {
  gameStateRef: React.MutableRefObject<any>;
  onScoreUpdate: (score: number) => void;
  checkCollisions: (canvas: HTMLCanvasElement) => boolean;
  onCollision: () => void;
}

export const useGamePhysics = ({ 
  gameStateRef, 
  onScoreUpdate, 
  checkCollisions, 
  onCollision 
}: UseGamePhysicsProps) => {
  const updateGame = useCallback(() => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const state = gameStateRef.current;
    const difficulty = getDifficulty(state.score);
    const GRAVITY = 0.4;
    const PIPE_WIDTH = 120;

    // Update bird physics
    state.bird.velocity += GRAVITY;
    state.bird.y += state.bird.velocity;
    state.bird.rotation = Math.min(Math.max(state.bird.velocity * 3, -30), 90);

    // Spawn new pipes based on difficulty
    if (state.frameCount - state.lastPipeSpawn > difficulty.spawnRate) {
      const pipeHeight = Math.random() * (canvas.height - difficulty.pipeGap - 100) + 50;
      state.pipes.push({
        x: canvas.width,
        topHeight: pipeHeight,
        bottomY: pipeHeight + difficulty.pipeGap,
        passed: false
      });
      state.lastPipeSpawn = state.frameCount;
    }

    // Update pipes and check for scoring
    state.pipes = state.pipes.filter((pipe: any) => {
      pipe.x -= difficulty.pipeSpeed;
      
      // Score when bird passes the center of the pipe
      if (!pipe.passed && state.bird.x > pipe.x + PIPE_WIDTH / 2) {
        pipe.passed = true;
        state.score++;
        onScoreUpdate(state.score);
        console.log('Score updated:', state.score);
      }
      
      return pipe.x > -PIPE_WIDTH;
    });

    // Check collisions AFTER updating positions
    if (checkCollisions(canvas)) {
      console.log('Collision detected! Game Over');
      onCollision();
      return;
    }

    state.frameCount++;
  }, [gameStateRef, onScoreUpdate, checkCollisions, onCollision]);

  return { updateGame };
};
