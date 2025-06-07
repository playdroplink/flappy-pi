
import { useCallback, useRef } from 'react';
import { getDifficultyByUserChoice } from '../utils/gameDifficulty';
import { useLifeSystem } from './useLifeSystem';
import { useHeartSystem } from './useHeartSystem';
import { FLAPPY_BIRD_CONSTANTS, calculatePipeGap, calculatePipeWidth, calculatePipeSpeed } from '../utils/gameConstants';

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
  const lifeSystem = useLifeSystem();
  const heartSystem = useHeartSystem({
    level: Math.floor(gameStateRef.current?.score / 5) + 1,
    onHeartCollected: lifeSystem.addLife
  });

  const lastPipeSpawn = useRef(0);

  // Standardized pipe generation using Flappy Bird constants
  const generateStandardPipe = useCallback((canvas: HTMLCanvasElement) => {
    const screenHeight = canvas.height;
    const screenWidth = canvas.width;
    
    // Use standardized gap calculation
    const gapSize = calculatePipeGap(screenHeight);
    const pipeWidth = calculatePipeWidth();
    
    // Calculate pipe heights with proper margins
    const minPipeHeight = screenHeight * FLAPPY_BIRD_CONSTANTS.PIPES.MIN_HEIGHT_RATIO;
    const maxPipeHeight = screenHeight - gapSize - minPipeHeight - FLAPPY_BIRD_CONSTANTS.SCREEN.GROUND_HEIGHT;
    
    // Ensure valid pipe heights
    const safeMinHeight = Math.max(50, minPipeHeight);
    const safeMaxHeight = Math.max(safeMinHeight + 50, maxPipeHeight);
    
    // Generate top pipe height
    const topHeight = Math.random() * (safeMaxHeight - safeMinHeight) + safeMinHeight;
    const bottomY = topHeight + gapSize;
    
    console.log('Standard pipe generated:', {
      topHeight,
      bottomY,
      gapSize,
      pipeWidth,
      screenHeight,
      isValid: bottomY + 50 < screenHeight - FLAPPY_BIRD_CONSTANTS.SCREEN.GROUND_HEIGHT
    });
    
    return {
      x: screenWidth,
      topHeight,
      bottomY,
      passed: false,
      scored: false,
      width: pipeWidth,
      gapSize
    };
  }, []);

  const updateGame = useCallback(() => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    if (!canvas || !gameStateRef.current?.gameStarted) return;

    const state = gameStateRef.current;
    const difficulty = getDifficultyByUserChoice(userDifficulty, state.score, gameMode);

    // Update frame count
    state.frameCount++;

    // Update flash timer for visual effects
    lifeSystem.updateFlashTimer();

    // Apply standardized gravity
    state.bird.velocity += FLAPPY_BIRD_CONSTANTS.BIRD.GRAVITY;
    state.bird.velocity = Math.min(state.bird.velocity, FLAPPY_BIRD_CONSTANTS.BIRD.MAX_VELOCITY);
    state.bird.y += state.bird.velocity;

    // Update bird rotation based on velocity (like original Flappy Bird)
    state.bird.rotation = Math.min(
      Math.max(state.bird.velocity * FLAPPY_BIRD_CONSTANTS.BIRD.ROTATION_FACTOR, -FLAPPY_BIRD_CONSTANTS.BIRD.MAX_ROTATION),
      FLAPPY_BIRD_CONSTANTS.BIRD.MAX_ROTATION
    );

    // Standardized pipe spawning
    const isMobile = window.innerWidth <= FLAPPY_BIRD_CONSTANTS.SCREEN.MOBILE_BREAKPOINT;
    const pipeSpawnRate = isMobile 
      ? FLAPPY_BIRD_CONSTANTS.TIMING.PIPE_SPAWN_RATE_MOBILE 
      : FLAPPY_BIRD_CONSTANTS.TIMING.PIPE_SPAWN_RATE_DESKTOP;
    
    if (state.frameCount - lastPipeSpawn.current > pipeSpawnRate) {
      const newPipe = generateStandardPipe(canvas);
      state.pipes.push(newPipe);
      lastPipeSpawn.current = state.frameCount;
    }

    // Update pipes with standardized speed
    const pipeSpeed = calculatePipeSpeed();
    
    state.pipes = state.pipes.filter((pipe: any) => {
      pipe.x -= pipeSpeed;

      // Score when bird passes pipe
      if (!pipe.scored && pipe.x + pipe.width < state.bird.x) {
        pipe.scored = true;
        state.score++;
        onScoreUpdate(state.score);

        // Spawn coins occasionally
        if (Math.random() < 0.3) {
          onCoinEarned(1);
        }
      }

      return pipe.x > -pipe.width;
    });

    // Update hearts system
    const currentLevel = Math.floor(state.score / 5) + 1;
    heartSystem.spawnHeartForLevel(currentLevel, canvas.width, canvas.height);
    heartSystem.updateHearts(state.bird, state.gameStarted);

    // Check collisions with standardized detection
    if (checkCollisions(canvas)) {
      const lifeUsed = lifeSystem.useLife(() => {
        // Respawn bird in safe center position
        state.bird.y = canvas.height / 2;
        state.bird.velocity = 0;
        state.bird.rotation = 0;
        console.log('Player respawned with life!');
      });

      if (!lifeUsed) {
        console.log('Game over - no lives remaining');
        onCollision();
      }
    }
  }, [
    gameStateRef,
    userDifficulty,
    gameMode,
    onScoreUpdate,
    onCoinEarned,
    checkCollisions,
    onCollision,
    lifeSystem,
    heartSystem,
    generateStandardPipe
  ]);

  const resetGameWithLives = useCallback(() => {
    console.log('Resetting game physics with standardized values');
    lifeSystem.resetLives();
    heartSystem.resetHearts();
    lastPipeSpawn.current = 0;
  }, [lifeSystem, heartSystem]);

  return {
    updateGame,
    resetGameWithLives,
    livesSystem: lifeSystem,
    heartsSystem: heartSystem,
    flashTimer: { current: lifeSystem.flashTimer },
    redFlashTimer: { current: lifeSystem.flashTimer }
  };
};
