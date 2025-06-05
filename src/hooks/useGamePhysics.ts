import { useCallback } from 'react';
import { getDifficulty } from '../utils/gameDifficulty';

interface UseGamePhysicsProps {
  gameStateRef: React.MutableRefObject<any>;
  onScoreUpdate: (score: number) => void;
  onCoinEarned: (coins: number) => void;
  checkCollisions: (canvas: HTMLCanvasElement) => boolean;
  onCollision: () => void;
  gameMode: 'classic' | 'endless' | 'challenge';
}

export const useGamePhysics = ({ 
  gameStateRef, 
  onScoreUpdate, 
  onCoinEarned,
  checkCollisions, 
  onCollision,
  gameMode
}: UseGamePhysicsProps) => {
  const updateGame = useCallback(() => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const state = gameStateRef.current;
    const difficulty = getDifficulty(state.score, gameMode);
    const GRAVITY = 0.4;
    const PIPE_WIDTH = 120;

    // Apply wind effect if enabled
    let horizontalForce = 0;
    if (difficulty.hasWind) {
      horizontalForce = Math.sin(state.frameCount * 0.02) * difficulty.windStrength;
    }

    // Update bird physics with wind
    state.bird.velocity += GRAVITY;
    state.bird.y += state.bird.velocity;
    state.bird.x += horizontalForce; // Wind effect
    state.bird.rotation = Math.min(Math.max(state.bird.velocity * 3, -30), 90);

    // Keep bird within horizontal bounds when wind is active
    if (difficulty.hasWind) {
      state.bird.x = Math.max(50, Math.min(state.bird.x, canvas.width - 150));
    }

    // Spawn new pipes based on difficulty
    if (state.frameCount - state.lastPipeSpawn > difficulty.spawnRate) {
      const pipeHeight = Math.random() * (canvas.height - difficulty.pipeGap - 100) + 50;
      const newPipe = {
        x: canvas.width,
        topHeight: pipeHeight,
        bottomY: pipeHeight + difficulty.pipeGap,
        passed: false,
        isMoving: difficulty.hasMovingPipes,
        verticalDirection: difficulty.hasMovingPipes ? (Math.random() > 0.5 ? 1 : -1) : 0,
        moveSpeed: difficulty.hasMovingPipes ? 1 : 0
      };
      state.pipes.push(newPipe);
      state.lastPipeSpawn = state.frameCount;
    }

    // Spawn clouds if enabled
    if (difficulty.hasClouds && state.frameCount % 200 === 0) {
      if (!state.clouds) state.clouds = [];
      state.clouds.push({
        x: canvas.width,
        y: Math.random() * (canvas.height * 0.3) + 50,
        size: Math.random() * 60 + 40,
        speed: 0.5 + Math.random() * 0.5
      });
    }

    // Update pipes and check for scoring
    state.pipes = state.pipes.filter((pipe: any) => {
      pipe.x -= difficulty.pipeSpeed;
      
      // Move pipes vertically if enabled
      if (pipe.isMoving) {
        const moveAmount = pipe.moveSpeed * pipe.verticalDirection;
        pipe.topHeight += moveAmount;
        pipe.bottomY += moveAmount;
        
        // Reverse direction if hitting bounds
        if (pipe.topHeight <= 50 || pipe.bottomY >= canvas.height - 50) {
          pipe.verticalDirection *= -1;
        }
      }
      
      // Score when bird passes the center of the pipe
      if (!pipe.passed && state.bird.x > pipe.x + PIPE_WIDTH / 2) {
        pipe.passed = true;
        state.score++;
        onScoreUpdate(state.score);
        onCoinEarned(1);
        console.log(`Score updated: ${state.score} (${gameMode} mode), Coin earned!`);
      }
      
      return pipe.x > -PIPE_WIDTH;
    });

    // Update clouds
    if (state.clouds) {
      state.clouds = state.clouds.filter((cloud: any) => {
        cloud.x -= cloud.speed;
        return cloud.x > -cloud.size;
      });
    }

    // Check collisions AFTER updating positions
    if (checkCollisions(canvas)) {
      console.log(`Collision detected in ${gameMode} mode! Game Over`);
      onCollision();
      return;
    }

    state.frameCount++;
  }, [gameStateRef, onScoreUpdate, onCoinEarned, checkCollisions, onCollision, gameMode]);

  return { updateGame };
};
