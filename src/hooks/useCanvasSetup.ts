
import { useEffect, useRef } from 'react';

export const useCanvasSetup = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // Detect mobile with more specific criteria
      const isMobile = windowWidth <= 768 || 'ontouchstart' in window;
      
      console.log('Resizing canvas:', { windowWidth, windowHeight, isMobile });
      
      if (isMobile) {
        // Full screen on mobile with proper device pixel ratio
        const devicePixelRatio = window.devicePixelRatio || 1;
        
        // Use actual viewport dimensions
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
          // Set transform origin for proper scaling
          ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
        }
        
        console.log('Mobile canvas setup:', {
          actualSize: { width: canvas.width, height: canvas.height },
          styleSize: { width: canvas.style.width, height: canvas.style.height },
          devicePixelRatio
        });
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
        
        console.log('Desktop canvas setup:', {
          actualSize: { width: canvas.width, height: canvas.height },
          styleSize: { width: canvas.style.width, height: canvas.style.height },
          devicePixelRatio
        });
      }
    };

    resizeCanvas();
    
    // Use multiple event listeners for better coverage
    const events = ['resize', 'orientationchange', 'load'];
    events.forEach(event => {
      window.addEventListener(event, resizeCanvas);
    });
    
    // Use ResizeObserver for more accurate detection if available
    let resizeObserver: ResizeObserver | null = null;
    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(resizeCanvas);
      resizeObserver.observe(document.body);
    }

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resizeCanvas);
      });
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  return { canvasRef };
};
