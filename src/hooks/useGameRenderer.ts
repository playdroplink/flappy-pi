
import { useCallback } from 'react';
import { useBirdRenderer } from './useBirdRenderer';
import { usePipesRenderer } from './usePipesRenderer';

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
  const { renderBird } = useBirdRenderer({ birdSkin });
  const { renderPipes } = usePipesRenderer();

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = gameStateRef.current;
    if (!state) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#98D8E8');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw ground
    ctx.fillStyle = '#8B7355';
    ctx.fillRect(0, canvas.height - 60, canvas.width, 60);

    // Draw pipes
    renderPipes(ctx, canvas, state.pipes, { timeOfDay: 'day' }, state.gameStarted);

    // Draw bird
    renderBird(ctx, state.bird, state.frameCount, state.gameStarted, { timeOfDay: 'day' });

    // Draw score
    if (state.gameStarted) {
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      
      const scoreText = state.score.toString();
      const x = canvas.width / 2;
      const y = 80;
      
      ctx.strokeText(scoreText, x, y);
      ctx.fillText(scoreText, x, y);
    }

    // Draw start message
    if (!state.gameStarted && !state.gameOver) {
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      
      const message = 'Tap to Start';
      const x = canvas.width / 2;
      const y = canvas.height / 2 + 80;
      
      ctx.strokeText(message, x, y);
      ctx.fillText(message, x, y);
    }
  }, [canvasRef, gameStateRef, renderBird, renderPipes]);

  const resetVisuals = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, [canvasRef]);

  return { draw, resetVisuals };
};
