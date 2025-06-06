
import { useCallback, useRef } from 'react';
import { getDifficultyByUserChoice, getBackgroundGradient } from '../utils/gameDifficulty';

interface UseBackgroundRendererProps {
  gameMode: 'classic' | 'endless' | 'challenge';
  userDifficulty?: 'easy' | 'medium' | 'hard';
}

export const useBackgroundRenderer = ({ 
  gameMode,
  userDifficulty = 'medium'
}: UseBackgroundRendererProps) => {
  const backgroundCache = useRef<{ theme: string; colors: any } | null>(null);
  const starField = useRef<Array<{x: number, y: number, size: number, twinkle: number}>>([]);

  const getBackgroundColorsOptimized = useCallback((theme: string) => {
    if (backgroundCache.current && backgroundCache.current.theme === theme) {
      return backgroundCache.current.colors;
    }
    
    const colors = getBackgroundGradient(theme);
    backgroundCache.current = { theme, colors };
    return colors;
  }, []);

  const initializeStarField = useCallback((canvas: HTMLCanvasElement) => {
    if (starField.current.length === 0) {
      for (let i = 0; i < 100; i++) {
        starField.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.8,
          size: Math.random() * 2 + 0.5,
          twinkle: Math.random() * Math.PI * 2
        });
      }
    }
  }, []);

  const renderBackground = useCallback((
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    score: number,
    frameCount: number
  ) => {
    const difficulty = getDifficultyByUserChoice(userDifficulty, score, gameMode);
    const backgroundColors = getBackgroundColorsOptimized(difficulty.backgroundTheme);

    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, backgroundColors.top);
    gradient.addColorStop(0.7, backgroundColors.middle || backgroundColors.top);
    gradient.addColorStop(1, backgroundColors.bottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars for night and space themes
    if (difficulty.hasStars) {
      initializeStarField(canvas);
      ctx.fillStyle = difficulty.backgroundTheme === 'space' ? '#FFFFFF' : '#FFFFCC';
      
      starField.current.forEach((star) => {
        const twinkle = Math.sin(frameCount * 0.02 + star.twinkle) * 0.3 + 0.7;
        ctx.globalAlpha = twinkle;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        
        star.x -= difficulty.backgroundScrollSpeed * 0.1;
        if (star.x < -10) {
          star.x = canvas.width + 10;
          star.y = Math.random() * canvas.height * 0.8;
        }
      });
      ctx.globalAlpha = 1;
    }

    // Draw nebula effect for space theme
    if (difficulty.hasNebulaEffect) {
      const nebulaGradient = ctx.createRadialGradient(
        canvas.width * 0.7, canvas.height * 0.3, 0,
        canvas.width * 0.7, canvas.height * 0.3, canvas.width * 0.6
      );
      nebulaGradient.addColorStop(0, 'rgba(138, 43, 226, 0.1)');
      nebulaGradient.addColorStop(0.5, 'rgba(75, 0, 130, 0.05)');
      nebulaGradient.addColorStop(1, 'rgba(25, 25, 112, 0.02)');
      
      ctx.fillStyle = nebulaGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    return difficulty;
  }, [gameMode, userDifficulty, getBackgroundColorsOptimized, initializeStarField]);

  return { renderBackground };
};
