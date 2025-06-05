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
    
    // Enhanced safety checks
    if (!state || state.gameOver || !state.canvasReady || !state.isInitialized) {
      return;
    }
    
    const difficulty = getDifficulty(state.score, gameMode);
    const GRAVITY = 0.35;
    const PIPE_WIDTH = 120;

    // Only apply physics if the game has actually started
    if (state.gameStarted) {
      try {
        // Apply wind effect if enabled
        let horizontalForce = 0;
        if (difficulty.hasWind) {
          horizontalForce = Math.sin(state.frameCount * 0.02) * difficulty.windStrength;
        }

        // Update bird physics with bounds checking
        state.bird.velocity += GRAVITY;
        state.bird.y += state.bird.velocity;
        state.bird.x += horizontalForce;
        
        // Improved rotation calculation
        state.bird.rotation = Math.min(Math.max(state.bird.velocity * 2.5, -25), 70);

        // Keep bird within horizontal bounds when wind is active
        if (difficulty.hasWind) {
          state.bird.x = Math.max(50, Math.min(state.bird.x, canvas.width - 150));
        }
      } catch (error) {
        console.error('❌ Bird physics error:', error);
        return;
      }
    }

    // Only spawn pipes after game has started and enough time has passed
    if (state.gameStarted && state.frameCount - state.lastPipeSpawn > Math.max(difficulty.spawnRate, 200)) {
      try {
        const minHeight = 80;
        const maxHeight = canvas.height - difficulty.pipeGap - minHeight - 50; // Extra margin
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
      } catch (error) {
        console.error('❌ Pipe spawn error:', error);
      }
    }

    // Spawn clouds if enabled and game started
    if (state.gameStarted && difficulty.hasClouds && state.frameCount % 250 === 0) {
      try {
        if (!state.clouds) state.clouds = [];
        state.clouds.push({
          x: canvas.width,
          y: Math.random() * (canvas.height * 0.3) + 50,
          size: Math.random() * 60 + 40,
          speed: 0.5 + Math.random() * 0.5
        });
      } catch (error) {
        console.error('❌ Cloud spawn error:', error);
      }
    }

    // Update pipes and check for scoring (only if game started)
    if (state.gameStarted) {
      try {
        state.pipes = state.pipes.filter((pipe: any) => {
          pipe.x -= difficulty.pipeSpeed;
          
          // Move pipes vertically if enabled
          if (pipe.isMoving) {
            const moveAmount = pipe.moveSpeed * pipe.verticalDirection;
            pipe.topHeight += moveAmount;
            pipe.bottomY += moveAmount;
            
            // Reverse direction if hitting bounds
            if (pipe.topHeight <= 80 || pipe.bottomY >= canvas.height - 80) {
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
      } catch (error) {
        console.error('❌ Pipe update error:', error);
      }
    }

    // Update clouds (only if game started)
    if (state.gameStarted && state.clouds) {
      try {
        state.clouds = state.clouds.filter((cloud: any) => {
          cloud.x -= cloud.speed;
          return cloud.x > -cloud.size;
        });
      } catch (error) {
        console.error('❌ Cloud update error:', error);
      }
    }

    // Check collisions AFTER updating positions
    if (state.gameStarted && !state.gameOver) {
      try {
        if (checkCollisions(canvas)) {
          console.log(`Collision detected in ${gameMode} mode! Final score: ${state.score}`);
          state.gameOver = true;
          onCollision();
          return;
        }
      } catch (error) {
        console.error('❌ Collision check error:', error);
      }
    }

    state.frameCount++;
  }, [gameStateRef, onScoreUpdate, onCoinEarned, checkCollisions, onCollision, gameMode]);

  return { updateGame };
};
