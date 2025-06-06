
import { useEffect, useRef } from 'react';

export const useCanvasSetup = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // For mobile, use full screen dimensions
      const isMobile = windowWidth <= 768;
      
      if (isMobile) {
        // Full screen on mobile
        canvas.width = windowWidth;
        canvas.height = windowHeight;
        canvas.style.width = `${windowWidth}px`;
        canvas.style.height = `${windowHeight}px`;
        canvas.style.left = '0px';
        canvas.style.top = '0px';
      } else {
        // Optimal Flappy Bird dimensions for desktop
        const gameWidth = 360;
        const gameHeight = 640;
        const aspectRatio = gameWidth / gameHeight;
        const windowAspectRatio = windowWidth / windowHeight;
        
        let canvasWidth, canvasHeight;
        
        if (windowAspectRatio > aspectRatio) {
          canvasHeight = windowHeight;
          canvasWidth = canvasHeight * aspectRatio;
        } else {
          canvasWidth = windowWidth;
          canvasHeight = canvasWidth / aspectRatio;
        }
        
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.width = `${canvasWidth}px`;
        canvas.style.height = `${canvasHeight}px`;
        canvas.style.left = `${(windowWidth - canvasWidth) / 2}px`;
        canvas.style.top = `${(windowHeight - canvasHeight) / 2}px`;
      }
      
      console.log('Canvas resized:', canvas.width, 'x', canvas.height, 'Mobile:', isMobile);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('orientationchange', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('orientationchange', resizeCanvas);
    };
  }, []);

  return { canvasRef };
};
