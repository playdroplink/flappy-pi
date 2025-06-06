
import { useCallback } from 'react';

export const useUIRenderer = () => {
  const renderTapToStart = useCallback((
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    gameStarted: boolean,
    initialized: boolean,
    frameCount: number,
    difficulty: any
  ) => {
    if (gameStarted || !initialized) return;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Main title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Tap to Start!', canvas.width / 2, canvas.height / 2);
    
    // Subtitle with instructions
    ctx.font = '16px Arial';
    ctx.fillText('Touch the screen or press space to begin flying', canvas.width / 2, canvas.height / 2 + 40);
    
    // Theme indicator
    ctx.font = '14px Arial';
    const themeText = `${difficulty.backgroundTheme.charAt(0).toUpperCase() + difficulty.backgroundTheme.slice(1)} Theme`;
    ctx.fillText(themeText, canvas.width / 2, canvas.height / 2 + 60);
    
    // Animated "Get Ready" pulse effect
    const pulseAlpha = 0.5 + Math.sin(frameCount * 0.1) * 0.3;
    ctx.fillStyle = `rgba(255, 255, 255, ${pulseAlpha})`;
    ctx.font = '12px Arial';
    ctx.fillText('Get Ready!', canvas.width / 2, canvas.height / 2 + 80);
  }, []);

  return { renderTapToStart };
};
