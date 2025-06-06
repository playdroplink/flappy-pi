
import { useCallback } from 'react';

export const usePipesRenderer = () => {
  const renderPipes = useCallback((
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    pipes: any[],
    difficulty: any,
    gameStarted: boolean
  ) => {
    if (!gameStarted) return;

    pipes.forEach((pipe: any) => {
      const pipeWidth = pipe.width || difficulty.pipeWidth;
      
      // Pipe colors based on time of day
      let pipeGradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipeWidth, 0);
      
      if (difficulty.timeOfDay === 'evening') {
        pipeGradient.addColorStop(0, '#4CAF50');
        pipeGradient.addColorStop(1, '#388E3C');
      } else if (difficulty.timeOfDay === 'night') {
        pipeGradient.addColorStop(0, '#2E7D32');
        pipeGradient.addColorStop(1, '#1B5E20');
      } else {
        pipeGradient.addColorStop(0, '#4CAF50');
        pipeGradient.addColorStop(1, '#388E3C');
      }

      // Pipe shadows
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fillRect(pipe.x + 2, 2, pipeWidth, pipe.topHeight);
      ctx.fillRect(pipe.x + 2, pipe.bottomY + 2, pipeWidth, canvas.height - pipe.bottomY);

      // Add glow effect for moving pipes
      if (pipe.isMoving) {
        ctx.shadowColor = '#4CAF50';
        ctx.shadowBlur = 8;
      }

      // Top pipe
      ctx.fillStyle = pipeGradient;
      ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);

      // Bottom pipe  
      ctx.fillRect(pipe.x, pipe.bottomY, pipeWidth, canvas.height - pipe.bottomY);

      // Pipe caps
      const capGradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipeWidth, 0);
      capGradient.addColorStop(0, '#66BB6A');
      capGradient.addColorStop(1, '#4CAF50');
      
      ctx.fillStyle = capGradient;
      ctx.fillRect(pipe.x - 4, pipe.topHeight - 20, pipeWidth + 8, 20);
      ctx.fillRect(pipe.x - 4, pipe.bottomY, pipeWidth + 8, 20);

      // Reset shadow
      ctx.shadowBlur = 0;
    });
  }, []);

  return { renderPipes };
};
