import { useCallback, useRef } from 'react';
import { getDifficultyByUserChoice } from '../utils/gameDifficulty';
import { useBackgroundRenderer } from './useBackgroundRenderer';
import { useCloudsRenderer } from './useCloudsRenderer';
import { useBirdRenderer } from './useBirdRenderer';
import { usePipesRenderer } from './usePipesRenderer';
import { useGroundRenderer } from './useGroundRenderer';
import { useUIRenderer } from './useUIRenderer';
import { useLevelVisuals } from './useLevelVisuals';

interface UseGameRendererProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  gameStateRef: React.MutableRefObject<any>;
  birdSkin: string;
  gameMode: 'classic' | 'endless' | 'challenge';
  userDifficulty?: 'easy' | 'medium' | 'hard';
  livesSystem?: any;
  heartsSystem?: any;
  flashTimer?: React.MutableRefObject<number>;
}

export const useGameRenderer = ({ 
  canvasRef, 
  gameStateRef, 
  birdSkin, 
  gameMode,
  userDifficulty = 'medium',
  livesSystem,
  heartsSystem,
  flashTimer
}: UseGameRendererProps) => {
  const difficultyCache = useRef<{ score: number; difficulty: any } | null>(null);
  const lastLevelRef = useRef<number>(1);

  const { renderBackground } = useBackgroundRenderer({ gameMode, userDifficulty });
  const { renderClouds, renderWindEffect } = useCloudsRenderer();
  const { renderBird } = useBirdRenderer({ birdSkin });
  const { renderPipes } = usePipesRenderer();
  const { renderGround, renderBuildings } = useGroundRenderer();
  const { renderTapToStart } = useUIRenderer();
  const { 
    triggerLevelVisual, 
    updateParticles, 
    renderLevelText, 
    renderParticles, 
    applyBackgroundEffects,
    resetEffects 
  } = useLevelVisuals();

  const getDifficultyOptimized = useCallback((score: number) => {
    if (difficultyCache.current && difficultyCache.current.score === score) {
      return difficultyCache.current.difficulty;
    }
    
    const difficulty = getDifficultyByUserChoice(userDifficulty, score, gameMode);
    difficultyCache.current = { score, difficulty };
    return difficulty;
  }, [gameMode, userDifficulty]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = gameStateRef.current;
    
    // Check for level up and trigger visual effects
    const currentLevel = Math.floor(state.score / 5) + 1;
    if (currentLevel > lastLevelRef.current && state.gameStarted) {
      triggerLevelVisual(currentLevel, canvas);
      lastLevelRef.current = currentLevel;
    }

    // Update particle systems
    updateParticles();

    // Save context for background effects
    ctx.save();
    
    // Apply background effects (shake, etc.)
    applyBackgroundEffects(ctx, canvas);
    
    // Apply flash effect if active
    if (flashTimer && flashTimer.current > 0) {
      ctx.save();
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }
    
    // Render background and get difficulty
    const difficulty = renderBackground(ctx, canvas, state.score, state.frameCount);
    
    // Render clouds and wind effects
    renderClouds(ctx, state.clouds, difficulty);
    renderWindEffect(ctx, canvas, difficulty, state.frameCount, state.gameStarted);
    
    // Render pipes
    renderPipes(ctx, canvas, state.pipes, difficulty, state.gameStarted);
    
    // Render floating hearts (if hearts system available)
    if (heartsSystem && state.level >= 5) {
      heartsSystem.renderHearts(ctx);
    }
    
    // Render level visual particles
    renderParticles(ctx);
    
    // Render bird
    renderBird(ctx, state.bird, state.frameCount, state.gameStarted, difficulty);
    
    // Render "Tap to Start" overlay
    renderTapToStart(ctx, canvas, state.gameStarted, state.initialized, state.frameCount, difficulty);
    
    // Render ground and buildings
    renderGround(ctx, canvas, difficulty, state.gameStarted);
    renderBuildings(ctx, canvas, difficulty, state.frameCount);
    
    // Render level text overlay
    renderLevelText(ctx, canvas, currentLevel, state.frameCount);
    
    // Render lives UI (hearts in corner)
    if (livesSystem) {
      livesSystem.renderLivesUI(ctx, canvas);
    }
    
    // Show heart collection message at level 5
    if (state.level === 5 && state.gameStarted && state.frameCount % 180 < 90) {
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(canvas.width / 2 - 150, canvas.height / 2 - 30, 300, 60);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('❤️ Hearts unlocked! Collect for extra lives!', canvas.width / 2, canvas.height / 2);
      ctx.restore();
    }

    // Restore context after background effects
    ctx.restore();
  }, [
    canvasRef, 
    gameStateRef, 
    renderBackground, 
    renderClouds, 
    renderWindEffect, 
    renderPipes, 
    renderBird, 
    renderTapToStart, 
    renderGround, 
    renderBuildings,
    livesSystem,
    heartsSystem,
    flashTimer,
    triggerLevelVisual,
    updateParticles,
    renderLevelText,
    renderParticles,
    applyBackgroundEffects
  ]);

  // Reset visual effects when game resets
  const resetVisuals = useCallback(() => {
    lastLevelRef.current = 1;
    resetEffects();
  }, [resetEffects]);

  return { draw, resetVisuals };
};
