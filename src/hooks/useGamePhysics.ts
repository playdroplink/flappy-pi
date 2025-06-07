
import { useCallback, useRef } from 'react';
import { getDifficultyByUserChoice } from '../utils/gameDifficulty';
import { useLifeSystem } from './useLifeSystem';
import { useHeartSystem } from './useHeartSystem';

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

  // Mobile-responsive pipe generation
  const generateResponsivePipe = useCallback((canvas: HTMLCanvasElement) => {
    const isMobile = window.innerWidth <= 768;
    const screenHeight = canvas.height;
    const screenWidth = canvas.width;
    
    console.log('Generating pipe for:', { isMobile, screenHeight, screenWidth });
    
    // Responsive gap sizing - larger on mobile for easier gameplay
    let gapSize: number;
    if (isMobile) {
      // Mobile: 30-35% of screen height for gap (more forgiving)
      gapSize = Math.max(120, screenHeight * 0.32);
    } else {
      // Desktop: 25% of screen height
      gapSize = Math.max(150, screenHeight * 0.25);
    }
    
    // Responsive minimum heights
    const minPipeHeight = isMobile ? screenHeight * 0.15 : screenHeight * 0.2;
    const maxPipeHeight = screenHeight - gapSize - minPipeHeight - 100; // Extra margin for ground
    
    // Ensure we have valid pipe heights
    const safeMinHeight = Math.max(50, minPipeHeight);
    const safeMaxHeight = Math.max(safeMinHeight + 50, maxPipeHeight);
    
    // Generate top pipe height with mobile-friendly positioning
    const topHeight = Math.random() * (safeMaxHeight - safeMinHeight) + safeMinHeight;
    const bottomY = topHeight + gapSize;
    
    // Responsive pipe width
    const pipeWidth = isMobile ? Math.max(60, screenWidth * 0.15) : 80;
    
    console.log('Generated pipe:', {
      topHeight,
      bottomY,
      gapSize,
      pipeWidth,
      screenHeight,
      bottomSpace: screenHeight - bottomY
    });
    
    return {
      x: screenWidth,
      topHeight,
      bottomY,
      passed: false,
      scored: false,
      width: pipeWidth,
      gapSize // Store for debugging
    };
  }, []);

  const updateGame = useCallback(() => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    if (!canvas || !gameStateRef.current?.gameStarted) return;

    const state = gameStateRef.current;
    const difficulty = getDifficultyByUserChoice(userDifficulty, state.score, gameMode);

    // Update frame count
    state.frameCount++;

    // Update flash timer for red flash effect
    lifeSystem.updateFlashTimer();

    // Apply gravity to bird
    state.bird.velocity += 0.4;
    state.bird.y += state.bird.velocity;

    // Update bird rotation based on velocity
    state.bird.rotation = Math.min(Math.max(state.bird.velocity * 0.1, -0.5), 0.5);

    // Responsive pipe spawn rate - slower on mobile for easier gameplay
    const isMobile = window.innerWidth <= 768;
    const basePipeSpawnRate = difficulty.pipeSpawnRate || 120;
    const pipeSpawnRate = isMobile ? basePipeSpawnRate + 30 : basePipeSpawnRate;
    
    // Spawn pipes with responsive sizing
    if (state.frameCount - lastPipeSpawn.current > pipeSpawnRate) {
      const newPipe = generateResponsivePipe(canvas);
      state.pipes.push(newPipe);
      lastPipeSpawn.current = state.frameCount;
      
      console.log('Pipe spawned:', newPipe);
    }

    // Update pipes with responsive speed
    const basePipeSpeed = difficulty.pipeSpeed || 2;
    const pipeSpeed = isMobile ? Math.max(1.5, basePipeSpeed * 0.8) : basePipeSpeed;
    
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

    // Check for level up and spawn hearts
    const currentLevel = Math.floor(state.score / 5) + 1;
    heartSystem.spawnHeartForLevel(currentLevel, canvas.width, canvas.height);

    // Update hearts
    heartSystem.updateHearts(state.bird, state.gameStarted);

    // Check collisions
    if (checkCollisions(canvas)) {
      // Try to use a life first
      const lifeUsed = lifeSystem.useLife(() => {
        // Respawn bird in center
        state.bird.y = canvas.height / 2;
        state.bird.velocity = 0;
        state.bird.rotation = 0;
        console.log('Player respawned with life!');
      });

      if (!lifeUsed) {
        // No lives left, trigger game over
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
    generateResponsivePipe
  ]);

  const resetGameWithLives = useCallback(() => {
    console.log('Resetting game physics with lives');
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
