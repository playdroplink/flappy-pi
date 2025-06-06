
import { useCallback, useRef } from 'react';
import { getDifficultyByUserChoice, getScoreMultiplier } from '../utils/gameDifficulty';

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
  const difficultyCache = useRef<{ score: number; difficulty: any } | null>(null);

  const getDifficultyOptimized = useCallback((score: number) => {
    if (difficultyCache.current && difficultyCache.current.score === score) {
      return difficultyCache.current.difficulty;
    }
    
    const difficulty = getDifficultyByUserChoice(userDifficulty, score, gameMode);
    difficultyCache.current = { score, difficulty };
    return difficulty;
  }, [gameMode, userDifficulty]);

  const updateGame = useCallback(() => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const state = gameStateRef.current;
    
    if (!state || state.gameOver || !state.initialized) return;
    
    const difficulty = getDifficultyOptimized(state.score);
    const scoreMultiplier = getScoreMultiplier(gameMode);
    const GRAVITY = 0.4;
    const PIPE_WIDTH = difficulty.pipeWidth;
    const PIPE_GAP = difficulty.pipeGap;
    const PIPE_SPACING = 400;

    // If game hasn't started, just do gentle floating animation
    if (!state.gameStarted) {
      // Gentle floating animation for bird
      const floatOffset = Math.sin(state.frameCount * 0.08) * 0.8;
      state.bird.y += floatOffset;
      state.bird.velocity = 0; // No velocity when not started
      state.bird.rotation = 0; // Keep bird level
      
      state.frameCount++;
      return; // Don't process anything else until game starts
    }

    // Apply wind effect if enabled
    let horizontalForce = 0;
    if (difficulty.hasWind) {
      horizontalForce = Math.sin(state.frameCount * 0.02) * difficulty.windStrength;
    }

    // Update bird physics - only when game has started
    state.bird.velocity += GRAVITY;
    state.bird.y += state.bird.velocity;
    state.bird.x += horizontalForce;
    
    // Bird rotation based on velocity - smoother rotation
    state.bird.rotation = Math.min(Math.max(state.bird.velocity * 2, -20), 60);

    // Keep bird within horizontal bounds when wind is active
    if (difficulty.hasWind) {
      state.bird.x = Math.max(60, Math.min(state.bird.x, canvas.width - 200));
    }

    // Spawn new pipes with much better spacing - only after game started
    const spawnThreshold = Math.max(PIPE_SPACING, 300);
    if (state.frameCount - state.lastPipeSpawn > spawnThreshold) {
      const minHeight = 120;
      const maxHeight = canvas.height - PIPE_GAP - minHeight - 100;
      const pipeHeight = Math.random() * (maxHeight - minHeight) + minHeight;
      
      const newPipe = {
        x: canvas.width + 50,
        topHeight: pipeHeight,
        bottomY: pipeHeight + PIPE_GAP,
        passed: false,
        scored: false,
        isMoving: difficulty.hasMovingPipes,
        verticalDirection: difficulty.hasMovingPipes ? (Math.random() > 0.5 ? 1 : -1) : 0,
        moveSpeed: difficulty.hasMovingPipes ? 0.6 : 0,
        width: PIPE_WIDTH
      };
      state.pipes.push(newPipe);
      state.lastPipeSpawn = state.frameCount;
      console.log('New pipe spawned at x:', newPipe.x, 'gap:', PIPE_GAP);
    }

    // Spawn clouds if enabled
    if (difficulty.hasClouds && state.frameCount % 300 === 0) {
      if (!state.clouds) state.clouds = [];
      state.clouds.push({
        x: canvas.width,
        y: Math.random() * (canvas.height * 0.3) + 50,
        size: Math.random() * 60 + 40,
        speed: 0.5 + Math.random() * 0.5
      });
    }

    // Update pipes with proper scoring logic
    state.pipes = state.pipes.filter((pipe: any) => {
      pipe.x -= difficulty.pipeSpeed;
      
      // Move pipes vertically if enabled
      if (pipe.isMoving) {
        const moveAmount = pipe.moveSpeed * pipe.verticalDirection;
        pipe.topHeight += moveAmount;
        pipe.bottomY += moveAmount;
        
        // Keep moving pipes within safe bounds
        const minTopHeight = 100;
        const maxBottomY = canvas.height - 120;
        
        if (pipe.topHeight <= minTopHeight || pipe.bottomY >= maxBottomY) {
          pipe.verticalDirection *= -1;
        }
      }
      
      // FIXED SCORING: Score when bird completely passes pipe center
      if (!pipe.scored && state.bird.x > (pipe.x + PIPE_WIDTH/2)) {
        pipe.scored = true;
        const newScore = state.score + 1;
        state.score = newScore;
        
        console.log('SCORE! Bird passed pipe center. New score:', newScore);
        
        onScoreUpdate(newScore);
        
        const coinsEarned = Math.floor(scoreMultiplier);
        onCoinEarned(coinsEarned);
      }
      
      return pipe.x > -PIPE_WIDTH - 100;
    });

    // Update clouds
    if (state.clouds) {
      state.clouds = state.clouds.filter((cloud: any) => {
        cloud.x -= cloud.speed;
        return cloud.x > -cloud.size - 100;
      });
    }

    // Check collisions - only when game has started
    if (checkCollisions(canvas)) {
      console.log('Collision detected! Game over triggered');
      state.gameOver = true;
      onCollision();
      return;
    }

    state.frameCount++;
  }, [gameStateRef, onScoreUpdate, onCoinEarned, checkCollisions, onCollision, gameMode, getDifficultyOptimized]);

  return { updateGame };
};
