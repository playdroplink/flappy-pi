
import { useState, useCallback } from 'react';

export const useLivesSystem = () => {
  const [currentLives, setCurrentLives] = useState(0);
  const [isInvulnerable, setIsInvulnerable] = useState(false);
  const maxLives = 3;

  const addLife = useCallback(() => {
    setCurrentLives(prev => Math.min(prev + 1, maxLives));
  }, [maxLives]);

  const useLife = useCallback(() => {
    if (currentLives > 0) {
      setCurrentLives(prev => prev - 1);
      
      // Brief invulnerability period
      setIsInvulnerable(true);
      setTimeout(() => {
        setIsInvulnerable(false);
      }, 1000);
      
      return true; // Life was used
    }
    return false; // No lives left
  }, [currentLives]);

  const resetLives = useCallback(() => {
    setCurrentLives(0);
    setIsInvulnerable(false);
  }, []);

  const renderLivesUI = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Render heart icons in top-left corner
    for (let i = 0; i < maxLives; i++) {
      const x = 20 + i * 35;
      const y = 30;
      const size = 8;
      
      ctx.save();
      
      // Determine heart color
      if (i < currentLives) {
        ctx.fillStyle = '#ff1744'; // Active heart
        ctx.strokeStyle = '#ffffff';
      } else {
        ctx.fillStyle = '#555555'; // Empty heart
        ctx.strokeStyle = '#888888';
      }
      
      ctx.lineWidth = 1.5;
      
      // Draw heart shape
      ctx.beginPath();
      ctx.moveTo(x, y + size * 0.3);
      ctx.bezierCurveTo(x, y - size * 0.2, x - size * 0.8, y - size * 0.2, x - size * 0.4, y + size * 0.1);
      ctx.bezierCurveTo(x - size * 0.1, y - size * 0.1, x + size * 0.1, y - size * 0.1, x + size * 0.4, y + size * 0.1);
      ctx.bezierCurveTo(x + size * 0.8, y - size * 0.2, x, y - size * 0.2, x, y + size * 0.3);
      ctx.fill();
      ctx.stroke();
      
      ctx.restore();
    }
  }, [currentLives, maxLives]);

  return {
    currentLives,
    maxLives,
    isInvulnerable,
    addLife,
    useLife,
    resetLives,
    renderLivesUI
  };
};
