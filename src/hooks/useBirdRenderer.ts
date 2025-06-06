
import { useCallback } from 'react';

interface UseBirdRendererProps {
  birdSkin: string;
}

export const useBirdRenderer = ({ birdSkin }: UseBirdRendererProps) => {
  const getBirdImage = useCallback(() => {
    const birdImages = {
      'default': '/lovable-uploads/8ad9f53d-d0aa-4231-9042-d1890a6f997f.png',
      'green': '/lovable-uploads/b2ccab90-dff7-4e09-9564-3cdd075c6793.png',
      'red': '/lovable-uploads/3a780914-6faf-4deb-81ab-ce1f4b059984.png'
    };
    return birdImages[birdSkin] || birdImages['default'];
  }, [birdSkin]);

  const renderBird = useCallback((
    ctx: CanvasRenderingContext2D,
    bird: any,
    frameCount: number,
    gameStarted: boolean,
    difficulty: any
  ) => {
    const BIRD_SIZE = 32;
    const birdImage = new Image();
    birdImage.src = getBirdImage();
    
    ctx.save();
    
    // Add glow effect for night time
    if (difficulty.timeOfDay === 'night') {
      ctx.shadowColor = '#FFFF00';
      ctx.shadowBlur = 12;
    }
    
    // Enhanced animation based on game state
    let flapOffset = 0;
    if (gameStarted) {
      flapOffset = Math.sin(frameCount * 0.2) * 1.5;
    } else {
      flapOffset = Math.sin(frameCount * 0.1) * 2;
    }
    
    // Ensure bird stays in safe spawn position until game starts
    const birdX = gameStarted ? bird.x : 80;
    const birdY = gameStarted ? bird.y + flapOffset : bird.y + flapOffset;
    
    ctx.translate(birdX, birdY);
    ctx.rotate(bird.rotation * Math.PI / 180);
    
    ctx.drawImage(birdImage, -BIRD_SIZE/2, -BIRD_SIZE/2, BIRD_SIZE, BIRD_SIZE);
    ctx.restore();
  }, [getBirdImage]);

  return { renderBird };
};
