
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

    // Spawn pipes
    if (state.frameCount - lastPipeSpawn.current > difficulty.pipeSpawnRate) {
      const gapSize = difficulty.pipeGap;
      const minPipeHeight = 50;
      const maxPipeHeight = canvas.height - gapSize - 100;
      const topHeight = Math.random() * (maxPipeHeight - minPipeHeight) + minPipeHeight;

      state.pipes.push({
        x: canvas.width,
        topHeight,
        bottomY: topHeight + gapSize,
        passed: false,
        scored: false,
        width: 80
      });

      lastPipeSpawn.current = state.frameCount;
    }

    // Update pipes
    state.pipes = state.pipes.filter((pipe: any) => {
      pipe.x -= difficulty.pipeSpeed;

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
    heartSystem
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
