
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
        // Full screen on mobile with proper device pixel ratio
        const devicePixelRatio = window.devicePixelRatio || 1;
        
        canvas.width = windowWidth * devicePixelRatio;
        canvas.height = windowHeight * devicePixelRatio;
        canvas.style.width = `${windowWidth}px`;
        canvas.style.height = `${windowHeight}px`;
        canvas.style.left = '0px';
        canvas.style.top = '0px';
        
        // Scale context for high DPI displays
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.scale(devicePixelRatio, devicePixelRatio);
        }
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
        
        const devicePixelRatio = window.devicePixelRatio || 1;
        
        canvas.width = canvasWidth * devicePixelRatio;
        canvas.height = canvasHeight * devicePixelRatio;
        canvas.style.width = `${canvasWidth}px`;
        canvas.style.height = `${canvasHeight}px`;
        canvas.style.left = `${(windowWidth - canvasWidth) / 2}px`;
        canvas.style.top = `${(windowHeight - canvasHeight) / 2}px`;
        
        // Scale context for high DPI displays
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.scale(devicePixelRatio, devicePixelRatio);
        }
      }
      
      console.log('Enhanced canvas resized:', canvas.width, 'x', canvas.height, 'Mobile:', isMobile, 'DPR:', window.devicePixelRatio || 1);
    };

    resizeCanvas();
    
    // Use multiple event listeners for better coverage
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('orientationchange', resizeCanvas);
    
    // Use ResizeObserver for more accurate detection if available
    if (window.ResizeObserver) {
      const resizeObserver = new ResizeObserver(resizeCanvas);
      resizeObserver.observe(document.body);
      
      return () => {
        window.removeEventListener('resize', resizeCanvas);
        window.removeEventListener('orientationchange', resizeCanvas);
        resizeObserver.disconnect();
      };
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('orientationchange', resizeCanvas);
    };
  }, []);

  return { canvasRef };
};
