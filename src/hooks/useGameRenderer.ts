
import { useCallback, useRef } from 'react';
import { getDifficulty, getBackgroundGradient } from '../utils/gameDifficulty';

interface UseGameRendererProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  gameStateRef: React.MutableRefObject<any>;
  birdSkin: string;
  gameMode: 'classic' | 'endless' | 'challenge';
}

export const useGameRenderer = ({ canvasRef, gameStateRef, birdSkin, gameMode }: UseGameRendererProps) => {
  const difficultyCache = useRef<{ score: number; difficulty: any } | null>(null);
  const backgroundCache = useRef<{ timeOfDay: string; colors: any } | null>(null);
  const imageCache = useRef<{ [key: string]: HTMLImageElement }>({});

  const getDifficultyOptimized = useCallback((score: number) => {
    if (difficultyCache.current && difficultyCache.current.score === score) {
      return difficultyCache.current.difficulty;
    }
    
    const difficulty = getDifficulty(score, gameMode);
    difficultyCache.current = { score, difficulty };
    return difficulty;
  }, [gameMode]);

  const getBackgroundColorsOptimized = useCallback((timeOfDay: string) => {
    if (backgroundCache.current && backgroundCache.current.timeOfDay === timeOfDay) {
      return backgroundCache.current.colors;
    }
    
    const colors = getBackgroundGradient(timeOfDay);
    backgroundCache.current = { timeOfDay, colors };
    return colors;
  }, []);

  const getBirdImage = useCallback(() => {
    const birdImages = {
      'default': '/lovable-uploads/8ad9f53d-d0aa-4231-9042-d1890a6f997f.png',
      'green': '/lovable-uploads/b2ccab90-dff7-4e09-9564-3cdd075c6793.png',
      'red': '/lovable-uploads/3a780914-6faf-4deb-81ab-ce1f4b059984.png'
    };
    
    const imagePath = birdImages[birdSkin] || birdImages['default'];
    
    if (!imageCache.current[imagePath]) {
      const img = new Image();
      img.src = imagePath;
      imageCache.current[imagePath] = img;
    }
    
    return imageCache.current[imagePath];
  }, [birdSkin]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = gameStateRef.current;
    if (!state) return;
    
    const difficulty = getDifficultyOptimized(state.score);
    const backgroundColors = getBackgroundColorsOptimized(difficulty.timeOfDay);
    const BIRD_SIZE = 25;
    const PIPE_WIDTH = 120;

    // Enhanced background with smoother gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, backgroundColors.top);
    gradient.addColorStop(0.6, backgroundColors.middle || backgroundColors.top);
    gradient.addColorStop(1, backgroundColors.bottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Enhanced cloud rendering
    if (difficulty.hasClouds && state.clouds) {
      ctx.fillStyle = difficulty.timeOfDay === 'night' ? '#444444' : '#FFFFFF';
      state.clouds.forEach((cloud: any) => {
        ctx.globalAlpha = difficulty.timeOfDay === 'night' ? 0.4 : 0.8;
        ctx.beginPath();
        
        // More realistic cloud shape
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2;
          const variance = 0.3 + Math.sin(angle * 3) * 0.2;
          const x = cloud.x + Math.cos(angle) * cloud.size * variance * 0.5;
          const y = cloud.y + Math.sin(angle) * cloud.size * variance * 0.3;
          
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    }

    // Enhanced wind effect visualization
    if (difficulty.hasWind) {
      const windOpacity = 0.1 + Math.abs(Math.sin(state.frameCount * 0.02)) * 0.1;
      ctx.strokeStyle = difficulty.timeOfDay === 'night' ? '#DDDDDD' : '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.globalAlpha = windOpacity;
      
      for (let i = 0; i < 8; i++) {
        const y = (canvas.height / 9) * (i + 1);
        const offset = Math.sin((state.frameCount + i * 15) * 0.04) * 40;
        const length = 60 + Math.sin((state.frameCount + i * 10) * 0.03) * 20;
        
        ctx.beginPath();
        ctx.moveTo(offset + 20, y + offset * 0.2);
        ctx.lineTo(offset + 20 + length, y + offset * 0.2 - 15);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    // Enhanced pipe rendering with better visuals
    state.pipes.forEach((pipe: any) => {
      let pipeColor = '#4CAF50';
      let pipeStroke = '#388E3C';
      let capColor = '#66BB6A';
      
      if (difficulty.timeOfDay === 'evening') {
        pipeColor = '#FF8C00';
        pipeStroke = '#FF6347';
        capColor = '#FFA500';
      } else if (difficulty.timeOfDay === 'night') {
        pipeColor = '#4169E1';
        pipeStroke = '#191970';
        capColor = '#6495ED';
      }

      // Enhanced glow for moving pipes
      if (pipe.isMoving) {
        const glowIntensity = 5 + Math.sin(state.frameCount * 0.1) * 3;
        ctx.shadowColor = pipeColor;
        ctx.shadowBlur = glowIntensity;
      }

      // Main pipe bodies with gradient
      const pipeGradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + PIPE_WIDTH, 0);
      pipeGradient.addColorStop(0, pipeColor);
      pipeGradient.addColorStop(0.5, capColor);
      pipeGradient.addColorStop(1, pipeStroke);
      
      ctx.fillStyle = pipeGradient;
      
      // Top pipe
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
      // Bottom pipe
      ctx.fillRect(pipe.x, pipe.bottomY, PIPE_WIDTH, canvas.height - pipe.bottomY);

      // Pipe borders for definition
      ctx.strokeStyle = pipeStroke;
      ctx.lineWidth = 2;
      ctx.strokeRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
      ctx.strokeRect(pipe.x, pipe.bottomY, PIPE_WIDTH, canvas.height - pipe.bottomY);

      // Enhanced pipe caps
      ctx.fillStyle = capColor;
      const capHeight = 35;
      ctx.fillRect(pipe.x - 8, pipe.topHeight - capHeight, PIPE_WIDTH + 16, capHeight);
      ctx.fillRect(pipe.x - 8, pipe.bottomY, PIPE_WIDTH + 16, capHeight);
      
      // Cap borders
      ctx.strokeRect(pipe.x - 8, pipe.topHeight - capHeight, PIPE_WIDTH + 16, capHeight);
      ctx.strokeRect(pipe.x - 8, pipe.bottomY, PIPE_WIDTH + 16, capHeight);

      ctx.shadowBlur = 0;
    });

    // Enhanced bird rendering
    const birdImage = getBirdImage();
    
    ctx.save();
    
    // Enhanced night visibility
    if (difficulty.timeOfDay === 'night') {
      ctx.shadowColor = '#FFFF88';
      ctx.shadowBlur = 20;
    }
    
    // Bird animation and rotation
    ctx.translate(state.bird.x, state.bird.y);
    ctx.rotate(state.bird.rotation * Math.PI / 180);
    
    // Wing flap animation
    const flapOffset = Math.sin(state.frameCount * 0.3) * 2;
    ctx.drawImage(birdImage, -BIRD_SIZE/2, -BIRD_SIZE/2 + flapOffset, BIRD_SIZE, BIRD_SIZE);
    ctx.restore();

    // Enhanced ground with texture
    const groundHeight = 30;
    let groundColor = '#8B4513';
    let groundAccent = '#A0522D';
    
    if (difficulty.timeOfDay === 'evening') {
      groundColor = '#654321';
      groundAccent = '#8B4513';
    } else if (difficulty.timeOfDay === 'night') {
      groundColor = '#2F1B14';
      groundAccent = '#4A2C17';
    }
    
    const groundGradient = ctx.createLinearGradient(0, canvas.height - groundHeight, 0, canvas.height);
    groundGradient.addColorStop(0, groundAccent);
    groundGradient.addColorStop(1, groundColor);
    
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);

    // Ground texture lines
    ctx.strokeStyle = groundColor;
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const y = canvas.height - groundHeight + (i * 6);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Enhanced UI overlays with better readability
    ctx.fillStyle = difficulty.timeOfDay === 'night' ? '#FFFFFF' : '#000000';
    ctx.font = 'bold 18px Arial';
    ctx.globalAlpha = 0.8;
    
    const timeText = `${difficulty.timeOfDay.charAt(0).toUpperCase() + difficulty.timeOfDay.slice(1)} - Level ${Math.floor(state.score / 5) + 1}`;
    const textWidth = ctx.measureText(timeText).width;
    
    // Text background for better readability
    ctx.fillStyle = difficulty.timeOfDay === 'night' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)';
    ctx.fillRect(8, 8, textWidth + 16, 28);
    
    ctx.fillStyle = difficulty.timeOfDay === 'night' ? '#FFFFFF' : '#000000';
    ctx.fillText(timeText, 16, 28);
    
    // Game mode indicator
    ctx.font = 'bold 10px Arial';
    ctx.globalAlpha = 0.6;
    const modeText = `${gameMode.toUpperCase()} MODE`;
    const modeWidth = ctx.measureText(modeText).width;
    
    ctx.fillStyle = difficulty.timeOfDay === 'night' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)';
    ctx.fillRect(8, canvas.height - 55, modeWidth + 16, 20);
    
    ctx.fillStyle = difficulty.timeOfDay === 'night' ? '#FFFFFF' : '#000000';
    ctx.fillText(modeText, 16, canvas.height - 42);
    ctx.globalAlpha = 1;
  }, [getBirdImage, canvasRef, gameStateRef, gameMode, getDifficultyOptimized, getBackgroundColorsOptimized]);

  return { draw };
};
