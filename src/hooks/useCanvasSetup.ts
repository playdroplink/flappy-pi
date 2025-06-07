
import { useEffect, useRef } from 'react';
import { FLAPPY_BIRD_CONSTANTS } from '../utils/gameConstants';

export const useCanvasSetup = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      const isMobile = windowWidth <= FLAPPY_BIRD_CONSTANTS.SCREEN.MOBILE_BREAKPOINT || 'ontouchstart' in window;
      
      console.log('Resizing canvas with Flappy Bird standards:', { windowWidth, windowHeight, isMobile });
      
      if (isMobile) {
        // Full screen mobile with proper scaling
        const devicePixelRatio = window.devicePixelRatio || 1;
        
        canvas.width = windowWidth * devicePixelRatio;
        canvas.height = windowHeight * devicePixelRatio;
        canvas.style.width = `${windowWidth}px`;
        canvas.style.height = `${windowHeight}px`;
        canvas.style.left = '0px';
        canvas.style.top = '0px';
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.scale(devicePixelRatio, devicePixelRatio);
          ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
        }
        
        console.log('Mobile canvas setup (Flappy Bird optimized):', {
          actualSize: { width: canvas.width, height: canvas.height },
          styleSize: { width: canvas.style.width, height: canvas.style.height },
          devicePixelRatio
        });
      } else {
        // Desktop with Flappy Bird aspect ratio
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
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.scale(devicePixelRatio, devicePixelRatio);
        }
        
        console.log('Desktop canvas setup (Flappy Bird aspect ratio):', {
          actualSize: { width: canvas.width, height: canvas.height },
          styleSize: { width: canvas.style.width, height: canvas.style.height },
          aspectRatio,
          devicePixelRatio
        });
      }
    };

    resizeCanvas();
    
    const events = ['resize', 'orientationchange', 'load'];
    events.forEach(event => {
      window.addEventListener(event, resizeCanvas);
    });
    
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
