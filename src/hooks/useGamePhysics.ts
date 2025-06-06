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
    if (livesSystem.isInvulnerable) return false;
    
    const hasCollision = checkCollisions(canvas);
    if (!hasCollision) return false;
    
    console.log('💥 Collision detected! Current lives:', livesSystem.currentLives);
    
    if (livesSystem.useLife()) {
      console.log('❤️ Life used! Respawning bird. Lives remaining:', livesSystem.currentLives - 1);
      
      flashTimer.current = 30;
      
      // Respawn at center
      const centerY = canvas.height / 2;
      const safeY = Math.max(100, Math.min(canvas.height - 100, centerY));
      
      gameStateRef.current.bird = {
        x: 80,
        y: safeY,
        velocity: -3,
        rotation: 0
      };
      
      console.log('✅ Bird respawned at center Y:', safeY);
      return false;
    } else {
      console.log('💀 No lives left - game over');
      return true;
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

    // Calculate level
    const currentLevel = Math.floor(state.score / 5) + 1;
    state.level = currentLevel;

    // Handle pre-game state
    if (!state.gameStarted) {
      // Gentle floating animation
      const floatOffset = Math.sin(state.frameCount * 0.06) * 1.2;
      state.bird.y += floatOffset * 0.5;
      state.bird.velocity = 0;
      state.bird.rotation = 0;
      
      // Keep bird centered
      const centerY = canvas.height / 2;
      const targetY = Math.max(100, Math.min(canvas.height - 100, centerY));
      
      // Smoothly move to center if displaced
      if (Math.abs(state.bird.y - targetY) > 50) {
        state.bird.y += (targetY - state.bird.y) * 0.05;
      }
      
      state.frameCount++;
      return;
    }

    // Apply wind effect
    let horizontalForce = 0;
    if (difficulty.hasWind) {
      horizontalForce = Math.sin(state.frameCount * 0.02) * difficulty.windStrength;
    }

    // Update bird physics
    state.bird.velocity += GRAVITY;
    state.bird.y += state.bird.velocity;
    state.bird.x += horizontalForce;
    
    // Strict boundary constraints
    const minY = 35;
    const maxY = canvas.height - 75;
    
    if (state.bird.y < minY) {
      state.bird.y = minY;
      state.bird.velocity = Math.max(0, state.bird.velocity);
    }
    
    if (state.bird.y > maxY) {
      state.bird.y = maxY;
      state.bird.velocity = Math.min(0, state.bird.velocity);
    }
    
    // Bird rotation
    state.bird.rotation = Math.min(Math.max(state.bird.velocity * 2, -20), 60);

    // Keep bird in horizontal bounds
    if (difficulty.hasWind) {
      state.bird.x = Math.max(60, Math.min(state.bird.x, canvas.width - 200));
    }

    // Update background offsets
    state.backgroundOffset += difficulty.backgroundScrollSpeed * 0.5;
    state.foregroundOffset += difficulty.backgroundScrollSpeed * 0.8;

    // Update hearts system
    heartsSystem.spawnHeart(canvas.width, canvas.height, state.frameCount);
    heartsSystem.updateHearts(state.bird, livesSystem.maxLives, livesSystem.currentLives);

    // Update flash timer
    if (flashTimer.current > 0) {
      flashTimer.current--;
    }

    // Spawn pipes
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
    }

    // Spawn clouds
    if (difficulty.hasClouds && state.frameCount % 300 === 0) {
      if (!state.clouds) state.clouds = [];
      state.clouds.push({
        x: canvas.width,
        y: Math.random() * (canvas.height * 0.3) + 50,
        size: Math.random() * 60 + 40,
        speed: 0.5 + Math.random() * 0.5
      });
    }

    // Update pipes
    state.pipes = state.pipes.filter((pipe: any) => {
      pipe.x -= difficulty.pipeSpeed;
      
      // Move pipes vertically if enabled
      if (pipe.isMoving) {
        const moveAmount = pipe.moveSpeed * pipe.verticalDirection;
        pipe.topHeight += moveAmount;
        pipe.bottomY += moveAmount;
        
        const minTopHeight = 100;
        const maxBottomY = canvas.height - 120;
        
        if (pipe.topHeight <= minTopHeight || pipe.bottomY >= maxBottomY) {
          pipe.verticalDirection *= -1;
        }
      }
      
      // Scoring logic
      if (!pipe.scored && state.bird.x > (pipe.x + PIPE_WIDTH/2)) {
        pipe.scored = true;
        const newScore = state.score + 1;
        state.score = newScore;
        
        console.log('🎯 SCORE! New score:', newScore);
        
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

    // Check collisions
    if (handleCollisionWithLives(canvas)) {
      console.log('💀 Game over triggered');
      state.gameOver = true;
      onCollision();
      return;
    }

    state.frameCount++;
  }, [gameStateRef, onScoreUpdate, onCoinEarned, onCollision, gameMode, getDifficultyOptimized, heartsSystem, livesSystem, handleCollisionWithLives]);

  const resetGameWithLives = useCallback(() => {
    console.log('🔄 Resetting game systems');
    livesSystem.resetLives();
    heartsSystem.resetHearts();
    flashTimer.current = 0;
    difficultyCache.current = null;
  }, [livesSystem, heartsSystem]);

  return { 
    updateGame, 
    resetGameWithLives,
    livesSystem,
    heartsSystem,
    flashTimer
  };
};
