
import { useCallback, useRef } from 'react';

export const useGroundRenderer = () => {
  const groundOffset = useRef(0);

  const resetGround = useCallback(() => {
    console.log('🌍 Resetting ground renderer');
    groundOffset.current = 0;
    console.log('✅ Ground renderer reset complete');
  }, []);

  const renderGround = useCallback((
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    difficulty: any,
    gameStarted: boolean
  ) => {
    const GROUND_HEIGHT = 40;
    
    // Only update ground offset when game is started
    if (gameStarted) {
      groundOffset.current += 2;
    } else {
      groundOffset.current += 0.5; // Slow movement when not started
    }
    
    if (groundOffset.current >= 50) groundOffset.current = 0;
    
    const groundGradient = ctx.createLinearGradient(0, canvas.height - GROUND_HEIGHT, 0, canvas.height);
    if (difficulty.timeOfDay === 'evening') {
      groundGradient.addColorStop(0, '#8B4513');
      groundGradient.addColorStop(1, '#654321');
    } else if (difficulty.timeOfDay === 'night') {
      groundGradient.addColorStop(0, '#2F1B14');
      groundGradient.addColorStop(1, '#1A0F0A');
    } else {
      groundGradient.addColorStop(0, '#8B4513');
      groundGradient.addColorStop(1, '#5D2F0C');
    }
    
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, canvas.height - GROUND_HEIGHT, canvas.width, GROUND_HEIGHT);
    
    // Add ground texture pattern
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    for (let x = -groundOffset.current; x < canvas.width; x += 50) {
      ctx.fillRect(x, canvas.height - GROUND_HEIGHT, 2, GROUND_HEIGHT);
    }
  }, []);

  const renderBuildings = useCallback((
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    difficulty: any,
    frameCount: number
  ) => {
    if (frameCount % 2 !== 0) return;
    
    const GROUND_HEIGHT = 40;
    ctx.fillStyle = difficulty.timeOfDay === 'night' ? 'rgba(50,50,50,0.8)' : 'rgba(100,100,100,0.6)';
    
    for (let i = 0; i < 5; i++) {
      const buildingX = (canvas.width / 5) * i;
      const buildingHeight = 50 + Math.sin(buildingX * 0.01 + frameCount * 0.001) * 30;
      ctx.fillRect(buildingX, canvas.height - GROUND_HEIGHT - buildingHeight, canvas.width / 5, buildingHeight);
    }
  }, []);

  return { renderGround, renderBuildings, resetGround };
};
