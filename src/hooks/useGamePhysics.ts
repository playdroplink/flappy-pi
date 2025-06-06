
import { useCallback, useRef } from 'react';
import { getDifficultyByUserChoice, getScoreMultiplier } from '../utils/gameDifficulty';
import { useHeartsSystem } from './useHeartsSystem';
import { useLivesSystem } from './useLivesSystem';

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
  const livesSystem = useLivesSystem();
  const heartsSystem = useHeartsSystem({
    level: gameStateRef.current?.level || 1,
    onHeartCollected: livesSystem.addLife
  });
  const flashTimer = useRef<number>(0);

  const getDifficultyOptimized = useCallback((score: number) => {
    if (difficultyCache.current && difficultyCache.current.score === score) {
      return difficultyCache.current.difficulty;
    }
    
    const difficulty = getDifficultyByUserChoice(userDifficulty, score, gameMode);
    difficultyCache.current = { score, difficulty };
    return difficulty;
  }, [gameMode, userDifficulty]);

  const handleCollisionWithLives = useCallback((canvas: HTMLCanvasElement) => {
    // Don't process collision if invulnerable
    if (livesSystem.isInvulnerable) return false;
    
    const hasCollision = checkCollisions(canvas);
    if (!hasCollision) return false;
    
    console.log('Collision detected! Current lives:', livesSystem.currentLives);
    
    // Try to use a life
    if (livesSystem.useLife()) {
      console.log('Life used! Respawning bird. Lives remaining:', livesSystem.currentLives - 1);
      
      // Flash effect
      flashTimer.current = 30; // Flash for 30 frames
      
      // Calculate safe respawn position
      const minY = 100;
      const maxY = canvas.height - 150;
      const safeY = Math.max(minY, Math.min(maxY, canvas.height * 0.4));
      
      // Respawn bird at safe position
      gameStateRef.current.bird = {
        x: 80,
        y: safeY,
        velocity: -3, // Small upward boost
        rotation: 0
      };
      
      console.log('Bird respawned at safe Y position:', safeY);
      
      return false; // Don't trigger game over
    } else {
      console.log('No lives left - triggering game over');
      return true; // Trigger normal collision/game over
    }
  }, [checkCollisions, livesSystem]);

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

    // Calculate level from score
    const currentLevel = Math.floor(state.score / 5) + 1;
    state.level = currentLevel;

    // If game hasn't started, just do gentle floating animation
    if (!state.gameStarted) {
      // Gentle floating animation for bird
      const floatOffset = Math.sin(state.frameCount * 0.08) * 0.8;
      state.bird.y += floatOffset;
      state.bird.velocity = 0; // No velocity when not started
      state.bird.rotation = 0; // Keep bird level
      
      // Ensure bird stays within safe bounds even during floating
      const minY = 100;
      const maxY = canvas.height - 150;
      state.bird.y = Math.max(minY, Math.min(maxY, state.bird.y));
      
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
    
    // Constrain bird within safe vertical bounds to prevent getting stuck
    const minY = 30; // Top boundary
    const maxY = canvas.height - 80; // Bottom boundary
    
    if (state.bird.y < minY) {
      state.bird.y = minY;
      state.bird.velocity = Math.max(0, state.bird.velocity); // Only allow downward velocity
    }
    
    if (state.bird.y > maxY) {
      state.bird.y = maxY;
      state.bird.velocity = Math.min(0, state.bird.velocity); // Only allow upward velocity
    }
    
    // Bird rotation based on velocity - smoother rotation
    state.bird.rotation = Math.min(Math.max(state.bird.velocity * 2, -20), 60);

    // Keep bird within horizontal bounds when wind is active
    if (difficulty.hasWind) {
      state.bird.x = Math.max(60, Math.min(state.bird.x, canvas.width - 200));
    }

    // Update hearts system
    heartsSystem.spawnHeart(canvas.width, canvas.height, state.frameCount);
    heartsSystem.updateHearts(state.bird, livesSystem.maxLives, livesSystem.currentLives);

    // Update flash timer
    if (flashTimer.current > 0) {
      flashTimer.current--;
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

    // Check collisions with lives system
    if (handleCollisionWithLives(canvas)) {
      console.log('Collision detected! Game over triggered');
      state.gameOver = true;
      onCollision();
      return;
    }

    state.frameCount++;
  }, [gameStateRef, onScoreUpdate, onCoinEarned, onCollision, gameMode, getDifficultyOptimized, heartsSystem, livesSystem, handleCollisionWithLives]);

  const resetGameWithLives = useCallback(() => {
    livesSystem.resetLives();
    heartsSystem.resetHearts();
    flashTimer.current = 0;
  }, [livesSystem, heartsSystem]);

  return { 
    updateGame, 
    resetGameWithLives,
    livesSystem,
    heartsSystem,
    flashTimer
  };
};
