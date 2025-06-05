
import { useCallback } from 'react';
import { getDifficulty, getBackgroundGradient } from '../utils/gameDifficulty';

interface UseGameRendererProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  gameStateRef: React.MutableRefObject<any>;
  birdSkin: string;
  gameMode: 'classic' | 'endless' | 'challenge';
}

export const useGameRenderer = ({ canvasRef, gameStateRef, birdSkin, gameMode }: UseGameRendererProps) => {
  const getBirdImage = useCallback(() => {
    const birdImages = {
      'default': '/lovable-uploads/8ad9f53d-d0aa-4231-9042-d1890a6f997f.png',
      'green': '/lovable-uploads/b2ccab90-dff7-4e09-9564-3cdd075c6793.png',
      'red': '/lovable-uploads/3a780914-6faf-4deb-81ab-ce1f4b059984.png'
    };
    return birdImages[birdSkin] || birdImages['default'];
  }, [birdSkin]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = gameStateRef.current;
    const difficulty = getDifficulty(state.score, gameMode);
    const backgroundColors = getBackgroundGradient(difficulty.timeOfDay);
    const BIRD_SIZE = 30; // Updated to match collision detection
    const PIPE_WIDTH = 120;

    // Clear canvas with time-of-day gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, backgroundColors.top);
    gradient.addColorStop(1, backgroundColors.bottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw clouds if enabled
    if (difficulty.hasClouds && state.clouds) {
      ctx.fillStyle = difficulty.timeOfDay === 'night' ? '#333333' : '#FFFFFF';
      state.clouds.forEach((cloud: any) => {
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.size / 2, 0, Math.PI * 2);
        ctx.arc(cloud.x + cloud.size * 0.3, cloud.y, cloud.size * 0.4, 0, Math.PI * 2);
        ctx.arc(cloud.x - cloud.size * 0.3, cloud.y, cloud.size * 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    }

    // Draw wind effect if active
    if (difficulty.hasWind) {
      ctx.strokeStyle = difficulty.timeOfDay === 'night' ? '#CCCCCC' : '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.3;
      for (let i = 0; i < 5; i++) {
        const y = (canvas.height / 6) * (i + 1);
        const offset = Math.sin((state.frameCount + i * 20) * 0.05) * 30;
        ctx.beginPath();
        ctx.moveTo(0, y + offset);
        ctx.lineTo(canvas.width, y + offset - 20);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    // Draw pipes with moving animation if enabled
    state.pipes.forEach((pipe: any) => {
      // Pipe color based on time of day
      let pipeColor = '#4CAF50';
      let pipeStroke = '#388E3C';
      
      if (difficulty.timeOfDay === 'evening') {
        pipeColor = '#FF8C00';
        pipeStroke = '#FF6347';
      } else if (difficulty.timeOfDay === 'night') {
        pipeColor = '#4169E1';
        pipeStroke = '#191970';
      }

      // Add glow effect for moving pipes
      if (pipe.isMoving) {
        ctx.shadowColor = pipeColor;
        ctx.shadowBlur = 10;
      }

      // Top pipe
      ctx.fillStyle = pipeColor;
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
      ctx.strokeStyle = pipeStroke;
      ctx.lineWidth = 3;
      ctx.strokeRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);

      // Bottom pipe
      ctx.fillRect(pipe.x, pipe.bottomY, PIPE_WIDTH, canvas.height - pipe.bottomY);
      ctx.strokeRect(pipe.x, pipe.bottomY, PIPE_WIDTH, canvas.height - pipe.bottomY);

      // Pipe caps with enhanced color
      const capColor = difficulty.timeOfDay === 'night' ? '#6495ED' : '#66BB6A';
      ctx.fillStyle = capColor;
      ctx.fillRect(pipe.x - 5, pipe.topHeight - 30, PIPE_WIDTH + 10, 30);
      ctx.fillRect(pipe.x - 5, pipe.bottomY, PIPE_WIDTH + 10, 30);

      // Reset shadow
      ctx.shadowBlur = 0;
    });

    // Draw bird with enhanced visibility for different times
    const birdImage = new Image();
    birdImage.src = getBirdImage();
    
    ctx.save();
    
    // Add glow effect for night time
    if (difficulty.timeOfDay === 'night') {
      ctx.shadowColor = '#FFFF00';
      ctx.shadowBlur = 15;
    }
    
    ctx.translate(state.bird.x + BIRD_SIZE/2, state.bird.y + BIRD_SIZE/2);
    ctx.rotate(state.bird.rotation * Math.PI / 180);
    ctx.drawImage(birdImage, -BIRD_SIZE/2, -BIRD_SIZE/2, BIRD_SIZE, BIRD_SIZE);
    ctx.restore();

    // Draw ground with time-based color
    let groundColor = '#8B4513';
    if (difficulty.timeOfDay === 'evening') groundColor = '#654321';
    if (difficulty.timeOfDay === 'night') groundColor = '#2F1B14';
    
    ctx.fillStyle = groundColor;
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);

    // Draw time of day indicator
    ctx.fillStyle = difficulty.timeOfDay === 'night' ? '#FFFFFF' : '#000000';
    ctx.font = 'bold 16px Arial';
    ctx.globalAlpha = 0.7;
    ctx.fillText(`${difficulty.timeOfDay.charAt(0).toUpperCase() + difficulty.timeOfDay.slice(1)} - Level ${Math.floor(state.score / 5) + 1}`, 10, 30);
    ctx.globalAlpha = 1;

    // Show game mode indicator - FIXED: smaller font size
    ctx.fillStyle = difficulty.timeOfDay === 'night' ? '#FFFFFF' : '#000000';
    ctx.font = 'bold 10px Arial'; // Reduced from 14px to 10px
    ctx.globalAlpha = 0.6;
    ctx.fillText(`${gameMode.toUpperCase()} MODE`, 10, canvas.height - 30);
    ctx.globalAlpha = 1;
  }, [getBirdImage, canvasRef, gameStateRef, gameMode]);

  return { draw };
};
