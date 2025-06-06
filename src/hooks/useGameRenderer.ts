
import { useCallback, useRef } from 'react';
import { getDifficultyByUserChoice } from '../utils/gameDifficulty';
import { useBackgroundRenderer } from './useBackgroundRenderer';
import { useCloudsRenderer } from './useCloudsRenderer';
import { useBirdRenderer } from './useBirdRenderer';
import { usePipesRenderer } from './usePipesRenderer';
import { useGroundRenderer } from './useGroundRenderer';
import { useUIRenderer } from './useUIRenderer';

interface UseGameRendererProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  gameStateRef: React.MutableRefObject<any>;
  birdSkin: string;
  gameMode: 'classic' | 'endless' | 'challenge';
  userDifficulty?: 'easy' | 'medium' | 'hard';
}

export const useGameRenderer = ({ 
  canvasRef, 
  gameStateRef, 
  birdSkin, 
  gameMode,
  userDifficulty = 'medium'
}: UseGameRendererProps) => {
  const difficultyCache = useRef<{ score: number; difficulty: any } | null>(null);

  const { renderBackground } = useBackgroundRenderer({ gameMode, userDifficulty });
  const { renderClouds, renderWindEffect } = useCloudsRenderer();
  const { renderBird } = useBirdRenderer({ birdSkin });
  const { renderPipes } = usePipesRenderer();
  const { renderGround, renderBuildings } = useGroundRenderer();
  const { renderTapToStart } = useUIRenderer();

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
    
    // Render background and get difficulty
    const difficulty = renderBackground(ctx, canvas, state.score, state.frameCount);
    
    // Render clouds and wind effects
    renderClouds(ctx, state.clouds, difficulty);
    renderWindEffect(ctx, canvas, difficulty, state.frameCount, state.gameStarted);
    
    // Render pipes
    renderPipes(ctx, canvas, state.pipes, difficulty, state.gameStarted);
    
    // Render bird
    renderBird(ctx, state.bird, state.frameCount, state.gameStarted, difficulty);
    
    // Render "Tap to Start" overlay
    renderTapToStart(ctx, canvas, state.gameStarted, state.initialized, state.frameCount, difficulty);
    
    // Render ground and buildings
    renderGround(ctx, canvas, difficulty, state.gameStarted);
    renderBuildings(ctx, canvas, difficulty, state.frameCount);
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
    renderBuildings
  ]);

  return { draw };
};
