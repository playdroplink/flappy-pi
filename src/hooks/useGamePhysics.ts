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
    
    // Don't update if game is not actively playing or already over
    if (!state || state.gameOver) return;
    
    const difficulty = getDifficulty(state.score, gameMode);
    const GRAVITY = 0.35;
    const PIPE_WIDTH = 120;

    // Apply wind effect if enabled
    let horizontalForce = 0;
    if (difficulty.hasWind) {
      horizontalForce = Math.sin(state.frameCount * 0.02) * difficulty.windStrength;
    }

    // Update bird physics
    state.bird.velocity += GRAVITY;
    state.bird.y += state.bird.velocity;
    state.bird.x += horizontalForce;
    
    // Improved rotation
    state.bird.rotation = Math.min(Math.max(state.bird.velocity * 2.5, -25), 70);

    // Keep bird within horizontal bounds when wind is active
    if (difficulty.hasWind) {
      state.bird.x = Math.max(50, Math.min(state.bird.x, canvas.width - 150));
    }

    // Spawn new pipes based on difficulty
    const spawnThreshold = Math.max(difficulty.spawnRate, 120);
    if (state.frameCount - state.lastPipeSpawn > spawnThreshold) {
      const minHeight = 80;
      const maxHeight = canvas.height - difficulty.pipeGap - minHeight;
      const pipeHeight = Math.random() * (maxHeight - minHeight) + minHeight;
      
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
      console.log('New pipe spawned at frame:', state.frameCount);
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
        if (pipe.topHeight <= 60 || pipe.bottomY >= canvas.height - 60) {
          pipe.verticalDirection *= -1;
        }
      }
      
      // Score when bird passes the pipe completely
      if (!pipe.passed && state.bird.x > pipe.x + PIPE_WIDTH) {
        pipe.passed = true;
        state.score++;
        console.log(`Score: ${state.score} (${gameMode} mode) - Pipe passed!`);
        onScoreUpdate(state.score);
        onCoinEarned(1);
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
      console.log(`Collision detected in ${gameMode} mode! Final score: ${state.score}`);
      state.gameOver = true;
      onCollision();
      return;
    }

    state.frameCount++;
  }, [gameStateRef, onScoreUpdate, onCoinEarned, checkCollisions, onCollision, gameMode]);

  return { updateGame };
};
