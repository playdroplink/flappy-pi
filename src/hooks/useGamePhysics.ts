import { useCallback, useRef } from 'react';
import { getDifficulty, getScoreMultiplier } from '../utils/gameDifficulty';

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
  const difficultyCache = useRef<{ score: number; difficulty: any } | null>(null);
  const lastScoreUpdate = useRef<number>(0);

  const getDifficultyOptimized = useCallback((score: number) => {
    if (difficultyCache.current && difficultyCache.current.score === score) {
      return difficultyCache.current.difficulty;
    }
    
    const difficulty = getDifficulty(score, gameMode);
    difficultyCache.current = { score, difficulty };
    return difficulty;
  }, [gameMode]);

  const updateGame = useCallback(() => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const state = gameStateRef.current;
    
    if (!state || state.gameOver || !state.initialized) return;
    
    const difficulty = getDifficultyOptimized(state.score);
    const scoreMultiplier = getScoreMultiplier(gameMode);
    const GRAVITY = 0.4;
    const PIPE_WIDTH = 120;
    const BIRD_SIZE = 25;

    // Apply enhanced wind effect
    let horizontalForce = 0;
    if (difficulty.hasWind) {
      horizontalForce = Math.sin(state.frameCount * 0.02) * difficulty.windStrength;
    }

    // Enhanced bird physics with better feel
    state.bird.velocity += GRAVITY;
    state.bird.y += state.bird.velocity;
    state.bird.x += horizontalForce;
    
    // Enhanced bird rotation for better visual feedback
    state.bird.rotation = Math.min(Math.max(state.bird.velocity * 3, -30), 90);

    // Keep bird within bounds when wind is active
    if (difficulty.hasWind) {
      state.bird.x = Math.max(60, Math.min(state.bird.x, canvas.width - 160));
    }

    // Enhanced pipe spawning with better timing
    const baseSpawnRate = 180;
    const spawnThreshold = Math.max(baseSpawnRate - (state.score * 2), difficulty.spawnRate);
    
    if (state.frameCount - state.lastPipeSpawn > spawnThreshold) {
      const minHeight = 100;
      const maxHeight = canvas.height - difficulty.pipeGap - minHeight - 40;
      const pipeHeight = Math.random() * (maxHeight - minHeight) + minHeight;
      
      const newPipe = {
        x: canvas.width + 50,
        topHeight: pipeHeight,
        bottomY: pipeHeight + difficulty.pipeGap,
        passed: false,
        isMoving: difficulty.hasMovingPipes,
        verticalDirection: difficulty.hasMovingPipes ? (Math.random() > 0.5 ? 1 : -1) : 0,
        moveSpeed: difficulty.hasMovingPipes ? 1.2 : 0
      };
      state.pipes.push(newPipe);
      state.lastPipeSpawn = state.frameCount;
    }

    // Enhanced cloud spawning
    if (difficulty.hasClouds && state.frameCount % 180 === 0) {
      if (!state.clouds) state.clouds = [];
      if (state.clouds.length < 6) { // Limit clouds for performance
        state.clouds.push({
          x: canvas.width + 100,
          y: Math.random() * (canvas.height * 0.4) + 40,
          size: Math.random() * 80 + 60,
          speed: 0.3 + Math.random() * 0.4
        });
      }
    }

    // Enhanced pipe movement and scoring
    state.pipes = state.pipes.filter((pipe: any) => {
      pipe.x -= difficulty.pipeSpeed;
      
      // Enhanced moving pipe logic
      if (pipe.isMoving) {
        const moveAmount = pipe.moveSpeed * pipe.verticalDirection;
        pipe.topHeight += moveAmount;
        pipe.bottomY += moveAmount;
        
        const minTopHeight = 80;
        const maxBottomY = canvas.height - 100;
        
        if (pipe.topHeight <= minTopHeight || pipe.bottomY >= maxBottomY) {
          pipe.verticalDirection *= -1;
          // Add slight randomness to movement
          pipe.moveSpeed = 0.8 + Math.random() * 0.8;
        }
      }
      
      // Enhanced scoring - only score once per pipe when bird center passes pipe center
      const birdCenter = state.bird.x;
      const pipeCenter = pipe.x + (PIPE_WIDTH / 2);
      
      if (!pipe.passed && birdCenter > pipeCenter) {
        pipe.passed = true;
        state.score++;
        
        console.log('Score increased to:', state.score);
        
        // Throttled UI updates for better performance
        if (state.score !== lastScoreUpdate.current) {
          onScoreUpdate(state.score);
          lastScoreUpdate.current = state.score;
          
          // Award coins with mode-based multiplier
          const coinsEarned = Math.max(1, Math.floor(scoreMultiplier));
          onCoinEarned(coinsEarned);
        }
      }
      
      return pipe.x > -PIPE_WIDTH - 50;
    });

    // Update clouds with culling
    if (state.clouds) {
      state.clouds = state.clouds.filter((cloud: any) => {
        cloud.x -= cloud.speed;
        return cloud.x > -cloud.size - 50;
      });
    }

    // Enhanced collision detection - check before updating frame count
    if (checkCollisions(canvas)) {
      console.log('Enhanced collision detected! Triggering game over');
      state.gameOver = true;
      onCollision();
      return;
    }

    state.frameCount++;
  }, [gameStateRef, onScoreUpdate, onCoinEarned, checkCollisions, onCollision, gameMode, getDifficultyOptimized]);

  return { updateGame };
};
