
import { useCallback } from 'react';

interface UseBirdRendererProps {
  birdSkin: string;
}

export const useBirdRenderer = ({ birdSkin }: UseBirdRendererProps) => {
  const getBirdImage = useCallback(() => {
    const birdImages = {
      'default': '/lovable-uploads/8ad9f53d-d0aa-4231-9042-d1890a6f997f.png',
      'green': '/lovable-uploads/b2ccab90-dff7-4e09-9564-3cdd075c6793.png',
      'red': '/lovable-uploads/3a780914-6faf-4deb-81ab-ce1f4b059984.png',
      'elite-violet': '/lovable-uploads/d139217c-21c4-42bd-ba26-18c96c98f9b1.png',
      'elite-eagle': '/lovable-uploads/9acde8f5-e27f-412c-9e12-d5f8a64c4ef2.png',
      'elite-royal': '/lovable-uploads/9553da41-d31b-473b-9951-87e3a0e5987c.png'
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
    
    // Add special glow effect for elite birds
    if (birdSkin.startsWith('elite-')) {
      ctx.shadowColor = '#FFD700';
      ctx.shadowBlur = 15;
    } else if (difficulty.timeOfDay === 'night') {
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
  }, [getBirdImage, birdSkin]);

  return { renderBird };
};
