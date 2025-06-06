
import { useEffect, useRef } from 'react';

export const useCanvasSetup = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      // Optimal Flappy Bird dimensions
      const gameWidth = 360;
      const gameHeight = 640;
      const aspectRatio = gameWidth / gameHeight;
      
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const windowAspectRatio = windowWidth / windowHeight;
      
      let canvasWidth, canvasHeight;
      
      if (windowAspectRatio > aspectRatio) {
        // Window is wider than game aspect ratio
        canvasHeight = windowHeight;
        canvasWidth = canvasHeight * aspectRatio;
      } else {
        // Window is taller than game aspect ratio
        canvasWidth = windowWidth;
        canvasHeight = canvasWidth / aspectRatio;
      }
      
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      
      // Center the canvas
      canvas.style.left = `${(windowWidth - canvasWidth) / 2}px`;
      canvas.style.top = `${(windowHeight - canvasHeight) / 2}px`;
      
      console.log('Canvas resized to optimal Flappy Bird dimensions:', canvasWidth, 'x', canvasHeight);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return { canvasRef };
};
