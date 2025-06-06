
import { useCallback } from 'react';

export const useCloudsRenderer = () => {
  const renderClouds = useCallback((
    ctx: CanvasRenderingContext2D,
    clouds: any[],
    difficulty: any
  ) => {
    if (!difficulty.hasClouds || !clouds) return;

    clouds.forEach((cloud: any) => {
      let cloudColor = '#FFFFFF';
      if (difficulty.backgroundTheme === 'evening') cloudColor = '#E8B4FF';
      else if (difficulty.backgroundTheme === 'sunset') cloudColor = '#FFE4B5';
      else if (difficulty.backgroundTheme === 'night') cloudColor = '#696969';
      
      // Cloud shadow
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.arc(cloud.x + 3, cloud.y + 3, cloud.size / 2, 0, Math.PI * 2);
      ctx.arc(cloud.x + cloud.size * 0.3 + 3, cloud.y + 3, cloud.size * 0.4, 0, Math.PI * 2);
      ctx.arc(cloud.x - cloud.size * 0.3 + 3, cloud.y + 3, cloud.size * 0.4, 0, Math.PI * 2);
      ctx.fill();
      
      // Cloud
      ctx.fillStyle = cloudColor;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.arc(cloud.x, cloud.y, cloud.size / 2, 0, Math.PI * 2);
      ctx.arc(cloud.x + cloud.size * 0.3, cloud.y, cloud.size * 0.4, 0, Math.PI * 2);
      ctx.arc(cloud.x - cloud.size * 0.3, cloud.y, cloud.size * 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });
  }, []);

  const renderWindEffect = useCallback((
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    difficulty: any,
    frameCount: number,
    gameStarted: boolean
  ) => {
    if (!difficulty.hasWind || !gameStarted) return;

    ctx.strokeStyle = difficulty.timeOfDay === 'night' ? '#CCCCCC' : '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.4;
    for (let i = 0; i < 5; i++) {
      const y = (canvas.height / 6) * (i + 1);
      const offset = Math.sin((frameCount + i * 20) * 0.05) * 30;
      ctx.beginPath();
      ctx.moveTo(0, y + offset);
      ctx.lineTo(canvas.width, y + offset - 20);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }, []);

  return { renderClouds, renderWindEffect };
};
