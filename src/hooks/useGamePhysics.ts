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
      
      // Clean respawn at center with proper physics reset
      const centerY = canvas.height / 2;
      const safeY = Math.max(100, Math.min(canvas.height - 100, centerY));
      
      gameStateRef.current.bird = {
        x: 80,
        y: safeY,
        velocity: -3, // Small upward velocity for natural feel
        rotation: 0
      };
      
      console.log('✅ Bird respawned cleanly at center Y:', safeY);
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

    // Handle pre-game state with improved floating
    if (!state.gameStarted) {
      // Gentle floating animation with proper center positioning
      const floatOffset = Math.sin(state.frameCount * 0.06) * 1.2;
      const centerY = canvas.height / 2;
      const targetY = Math.max(100, Math.min(canvas.height - 100, centerY));
      
      // Keep bird properly centered with smooth floating
      state.bird.y = targetY + floatOffset;
      state.bird.velocity = 0;
      state.bird.rotation = 0;
      state.bird.x = 80; // Ensure X position stays consistent
      
      state.frameCount++;
      return;
    }

    // Apply wind effect if enabled
    let horizontalForce = 0;
    if (difficulty.hasWind) {
      horizontalForce = Math.sin(state.frameCount * 0.02) * difficulty.windStrength;
    }

    // Update bird physics with improved bounds checking
    state.bird.velocity += GRAVITY;
    state.bird.y += state.bird.velocity;
    state.bird.x += horizontalForce;
    
    // Enhanced boundary constraints with proper physics
    const minY = 35;
    const maxY = canvas.height - 75;
    
    if (state.bird.y < minY) {
      state.bird.y = minY;
      state.bird.velocity = Math.max(0, state.bird.velocity); // Stop upward movement
    }
    
    if (state.bird.y > maxY) {
      state.bird.y = maxY;
      state.bird.velocity = Math.min(-1, state.bird.velocity); // Slight bounce effect
    }
    
    // Smooth bird rotation based on velocity
    state.bird.rotation = Math.min(Math.max(state.bird.velocity * 2, -20), 60);

    // Keep bird in horizontal bounds when wind is active
    if (difficulty.hasWind) {
      state.bird.x = Math.max(60, Math.min(state.bird.x, canvas.width - 200));
    } else {
      state.bird.x = 80; // Reset to standard position when no wind
    }

    // Update background offsets (reset to 0 on game start for clean restart)
    state.backgroundOffset += difficulty.backgroundScrollSpeed * 0.5;
    state.foregroundOffset += difficulty.backgroundScrollSpeed * 0.8;

    // Update hearts system
    heartsSystem.spawnHeart(canvas.width, canvas.height, state.frameCount);
    heartsSystem.updateHearts(state.bird, livesSystem.maxLives, livesSystem.currentLives);

    // Update flash timer for invulnerability
    if (flashTimer.current > 0) {
      flashTimer.current--;
    }

    // Spawn pipes with proper spacing
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

    // Spawn clouds with proper cleanup
    if (difficulty.hasClouds && state.frameCount % 300 === 0) {
      if (!state.clouds) state.clouds = [];
      state.clouds.push({
        x: canvas.width,
        y: Math.random() * (canvas.height * 0.3) + 50,
        size: Math.random() * 60 + 40,
        speed: 0.5 + Math.random() * 0.5
      });
    }

    // Update pipes with improved movement and cleanup
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
      
      // Scoring logic with clean point tracking
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

    // Update clouds with proper cleanup
    if (state.clouds) {
      state.clouds = state.clouds.filter((cloud: any) => {
        cloud.x -= cloud.speed;
        return cloud.x > -cloud.size - 100;
      });
    }

    // Check collisions with improved handling
    if (handleCollisionWithLives(canvas)) {
      console.log('💀 Game over triggered - stopping all game logic');
      state.gameOver = true;
      state.gameStarted = false; // Stop game logic immediately
      onCollision();
      return;
    }

    state.frameCount++;
  }, [gameStateRef, onScoreUpdate, onCoinEarned, onCollision, gameMode, getDifficultyOptimized, heartsSystem, livesSystem, handleCollisionWithLives]);

  const resetGameWithLives = useCallback(() => {
    console.log('🔄 Resetting all game systems with complete cleanup');
    livesSystem.resetLives();
    heartsSystem.resetHearts();
    flashTimer.current = 0;
    difficultyCache.current = null;
    
    console.log('✅ All game systems reset and ready');
  }, [livesSystem, heartsSystem]);

  return { 
    updateGame, 
    resetGameWithLives,
    livesSystem,
    heartsSystem,
    flashTimer
  };
};
