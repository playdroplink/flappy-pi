
import { useCallback } from 'react';

interface RenderProps {
  canvas: HTMLCanvasElement;
  bird: { x: number; y: number; velocity: number; rotation: number };
  pipes: Array<{ x: number; topHeight: number; bottomY: number; width: number }>;
  score: number;
  gameMode: 'classic' | 'endless' | 'challenge';
  birdSkin: string;
}

const BIRD_IMAGES = {
  'default': '/lovable-uploads/8ad9f53d-d0aa-4231-9042-d1890a6f997f.png',
  'green': '/lovable-uploads/b2ccab90-dff7-4e09-9564-3cdd075c6793.png',
  'red': '/lovable-uploads/3a780914-6faf-4deb-81ab-ce1f4b059984.png'
};

const MODE_COLORS = {
  classic: {
    bg: ['#87CEEB', '#98D8E8'],
    pipe: '#228B22',
    pipeStroke: '#006400'
  },
  endless: {
    bg: ['#FF7F50', '#FFA07A'],
    pipe: '#8B4513',
    pipeStroke: '#654321'
  },
  challenge: {
    bg: ['#9370DB', '#BA55D3'],
    pipe: '#4B0082',
    pipeStroke: '#301934'
  }
};

export const useNewGameRenderer = () => {
  const render = useCallback(({ canvas, bird, pipes, score, gameMode, birdSkin }: RenderProps) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = MODE_COLORS[gameMode];
    const BIRD_SIZE = 25;

    // Clear and draw background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, colors.bg[0]);
    gradient.addColorStop(1, colors.bg[1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw pipes
    pipes.forEach(pipe => {
      // Pipe color
      ctx.fillStyle = colors.pipe;
      ctx.strokeStyle = colors.pipeStroke;
      ctx.lineWidth = 3;

      // Top pipe
      ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
      ctx.strokeRect(pipe.x, 0, pipe.width, pipe.topHeight);

      // Bottom pipe
      ctx.fillRect(pipe.x, pipe.bottomY, pipe.width, canvas.height - pipe.bottomY);
      ctx.strokeRect(pipe.x, pipe.bottomY, pipe.width, canvas.height - pipe.bottomY);

      // Pipe caps
      ctx.fillStyle = colors.pipeStroke;
      ctx.fillRect(pipe.x - 5, pipe.topHeight - 20, pipe.width + 10, 20);
      ctx.fillRect(pipe.x - 5, pipe.bottomY, pipe.width + 10, 20);
    });

    // Draw bird
    const birdImage = new Image();
    birdImage.src = BIRD_IMAGES[birdSkin] || BIRD_IMAGES.default;
    
    ctx.save();
    ctx.translate(bird.x + BIRD_SIZE/2, bird.y + BIRD_SIZE/2);
    ctx.rotate(bird.rotation * Math.PI / 180);
    ctx.drawImage(birdImage, -BIRD_SIZE/2, -BIRD_SIZE/2, BIRD_SIZE, BIRD_SIZE);
    ctx.restore();

    // Draw score
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.strokeText(score.toString(), canvas.width / 2, 80);
    ctx.fillText(score.toString(), canvas.width / 2, 80);

    // Draw mode indicator
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`${gameMode.toUpperCase()} MODE`, 10, 30);
  }, []);

  return { render };
};
