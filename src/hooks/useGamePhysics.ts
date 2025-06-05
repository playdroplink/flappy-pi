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
    
    // ENHANCED SAFETY CHECKS - Prevent errors in all modes
    if (!state || state.gameOver || !state.canvasReady || !state.isInitialized) {
      return;
    }
    
    const difficulty = getDifficulty(state.score, gameMode);
    const GRAVITY = 0.4;  // Slightly increased for better feel
    const PIPE_WIDTH = 120;

    // BIRD PHYSICS - Only when game has started
    if (state.gameStarted) {
      try {
        // Apply wind effect if enabled
        let horizontalForce = 0;
        if (difficulty.hasWind) {
          horizontalForce = Math.sin(state.frameCount * 0.02) * difficulty.windStrength;
        }

        // Update bird physics with proper bounds
        state.bird.velocity += GRAVITY;
        state.bird.y += state.bird.velocity;
        state.bird.x += horizontalForce;
        
        // Smooth rotation based on velocity
        state.bird.rotation = Math.min(Math.max(state.bird.velocity * 3, -30), 90);

        // Keep bird within horizontal bounds when wind is active
        if (difficulty.hasWind) {
          state.bird.x = Math.max(60, Math.min(state.bird.x, canvas.width - 160));
        }
        
      } catch (error) {
        console.error('❌ Bird physics error:', error);
        return;
      }
    }

    // PIPE SPAWNING - Better timing and spacing
    if (state.gameStarted && state.frameCount - state.lastPipeSpawn > Math.max(difficulty.spawnRate, 180)) {
      try {
        const minHeight = 100;
        const maxHeight = canvas.height - difficulty.pipeGap - minHeight - 60;
        const pipeHeight = Math.random() * (maxHeight - minHeight) + minHeight;
        
        const newPipe = {
          x: canvas.width + 50, // Spawn slightly off-screen
          topHeight: pipeHeight,
          bottomY: pipeHeight + difficulty.pipeGap,
          passed: false,
          isMoving: difficulty.hasMovingPipes,
          verticalDirection: difficulty.hasMovingPipes ? (Math.random() > 0.5 ? 1 : -1) : 0,
          moveSpeed: difficulty.hasMovingPipes ? 1.2 : 0
        };
        
        state.pipes.push(newPipe);
        state.lastPipeSpawn = state.frameCount;
        console.log(`New pipe spawned in ${gameMode} mode at frame:`, state.frameCount);
        
      } catch (error) {
        console.error('❌ Pipe spawn error:', error);
      }
    }

    // CLOUD SPAWNING - If enabled
    if (state.gameStarted && difficulty.hasClouds && state.frameCount % 300 === 0) {
      try {
        if (!state.clouds) state.clouds = [];
        if (state.clouds.length < 5) { // Limit cloud count
          state.clouds.push({
            x: canvas.width,
            y: Math.random() * (canvas.height * 0.4) + 50,
            size: Math.random() * 50 + 35,
            speed: 0.4 + Math.random() * 0.6
          });
        }
      } catch (error) {
        console.error('❌ Cloud spawn error:', error);
      }
    }

    // UPDATE PIPES - Movement and scoring
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
            const topBound = 60;
            const bottomBound = canvas.height - 60;
            if (pipe.topHeight <= topBound || pipe.bottomY >= bottomBound) {
              pipe.verticalDirection *= -1;
            }
          }
          
          // SCORE WHEN BIRD PASSES PIPE
          if (!pipe.passed && state.bird.x > pipe.x + PIPE_WIDTH + 10) {
            pipe.passed = true;
            state.score++;
            console.log(`🎯 SCORE! ${state.score} (${gameMode} mode)`);
            onScoreUpdate(state.score);
            onCoinEarned(1); // Earn 1 coin per pipe
          }
          
          // Remove pipes that are off-screen
          return pipe.x > -PIPE_WIDTH - 50;
        });
      } catch (error) {
        console.error('❌ Pipe update error:', error);
      }
    }

    // UPDATE CLOUDS
    if (state.gameStarted && state.clouds) {
      try {
        state.clouds = state.clouds.filter((cloud: any) => {
          cloud.x -= cloud.speed;
          return cloud.x > -cloud.size - 20;
        });
      } catch (error) {
        console.error('❌ Cloud update error:', error);
      }
    }

    // COLLISION DETECTION - Final check
    if (state.gameStarted && !state.gameOver) {
      try {
        if (checkCollisions(canvas)) {
          console.log(`💥 COLLISION in ${gameMode} mode! Final score: ${state.score}`);
          state.gameOver = true;
          onCollision();
          return;
        }
      } catch (error) {
        console.error('❌ Collision check error:', error);
      }
    }

    // Increment frame counter
    state.frameCount++;
  }, [gameStateRef, onScoreUpdate, onCoinEarned, checkCollisions, onCollision, gameMode]);

  return { updateGame };
};
