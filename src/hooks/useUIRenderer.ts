
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
    
    // Responsive font sizes based on canvas size
    const isMobile = canvas.width <= 768;
    const titleSize = isMobile ? Math.max(20, canvas.width * 0.06) : 24;
    const subtitleSize = isMobile ? Math.max(14, canvas.width * 0.04) : 16;
    const smallTextSize = isMobile ? Math.max(12, canvas.width * 0.035) : 14;
    
    // Main title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${titleSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('Tap to Start!', canvas.width / 2, canvas.height / 2);
    
    // Subtitle with instructions
    ctx.font = `${subtitleSize}px Arial`;
    const instructionText = isMobile ? 'Touch to fly' : 'Touch the screen or press space to begin flying';
    ctx.fillText(instructionText, canvas.width / 2, canvas.height / 2 + 40);
    
    // Theme indicator
    ctx.font = `${smallTextSize}px Arial`;
    const themeText = `${difficulty.backgroundTheme.charAt(0).toUpperCase() + difficulty.backgroundTheme.slice(1)} Theme`;
    ctx.fillText(themeText, canvas.width / 2, canvas.height / 2 + 70);
    
    // Animated "Get Ready" pulse effect
    const pulseAlpha = 0.5 + Math.sin(frameCount * 0.1) * 0.3;
    ctx.fillStyle = `rgba(255, 255, 255, ${pulseAlpha})`;
    ctx.font = `${smallTextSize * 0.9}px Arial`;
    ctx.fillText('Get Ready!', canvas.width / 2, canvas.height / 2 + 95);
  }, []);

  return { renderTapToStart };
};
