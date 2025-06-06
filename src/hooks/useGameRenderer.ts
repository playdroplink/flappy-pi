import { useCallback, useRef } from 'react';
import { getDifficultyByUserChoice, getBackgroundGradient } from '../utils/gameDifficulty';

interface UseGameRendererProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  gameStateRef: React.MutableRefObject<any>;
  birdSkin: string;
  gameMode: 'classic' | 'endless' | 'challenge';
  userDifficulty?: 'easy' | 'medium' | 'hard';
}

export const useGameRenderer = ({ 
  canvasRef, 
  gameStateRef, 
  birdSkin, 
  gameMode,
  userDifficulty = 'medium'
}: UseGameRendererProps) => {
  const difficultyCache = useRef<{ score: number; difficulty: any } | null>(null);
  const backgroundCache = useRef<{ timeOfDay: string; colors: any } | null>(null);
  const groundOffset = useRef(0);

  const getDifficultyOptimized = useCallback((score: number) => {
    if (difficultyCache.current && difficultyCache.current.score === score) {
      return difficultyCache.current.difficulty;
    }
    
    const difficulty = getDifficultyByUserChoice(userDifficulty, score, gameMode);
    difficultyCache.current = { score, difficulty };
    return difficulty;
  }, [gameMode, userDifficulty]);

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
    return birdImages[birdSkin] || birdImages['default'];
  }, [birdSkin]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = gameStateRef.current;
    const difficulty = getDifficultyOptimized(state.score);
    const backgroundColors = getBackgroundColorsOptimized(difficulty.timeOfDay);
    
    const BIRD_SIZE = 32;
    const GROUND_HEIGHT = 40;

    // Clear canvas with beautiful gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, backgroundColors.top);
    gradient.addColorStop(0.7, backgroundColors.middle || backgroundColors.top);
    gradient.addColorStop(1, backgroundColors.bottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw animated clouds with shadows (only if game started or for atmosphere)
    if (difficulty.hasClouds && state.clouds) {
      state.clouds.forEach((cloud: any) => {
        // Cloud shadow
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(cloud.x + 3, cloud.y + 3, cloud.size / 2, 0, Math.PI * 2);
        ctx.arc(cloud.x + cloud.size * 0.3 + 3, cloud.y + 3, cloud.size * 0.4, 0, Math.PI * 2);
        ctx.arc(cloud.x - cloud.size * 0.3 + 3, cloud.y + 3, cloud.size * 0.4, 0, Math.PI * 2);
        ctx.fill();
        
        // Cloud
        ctx.fillStyle = difficulty.timeOfDay === 'night' ? '#444444' : '#FFFFFF';
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.size / 2, 0, Math.PI * 2);
        ctx.arc(cloud.x + cloud.size * 0.3, cloud.y, cloud.size * 0.4, 0, Math.PI * 2);
        ctx.arc(cloud.x - cloud.size * 0.3, cloud.y, cloud.size * 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    }

    // Draw wind effect if active (only when game started)
    if (difficulty.hasWind && state.gameStarted) {
      ctx.strokeStyle = difficulty.timeOfDay === 'night' ? '#CCCCCC' : '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.4;
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

    // Draw pipes with correct dynamic sizing (only when game started)
    if (state.gameStarted) {
      state.pipes.forEach((pipe: any) => {
        const pipeWidth = pipe.width || difficulty.pipeWidth;
        
        // Pipe colors based on time of day
        let pipeGradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipeWidth, 0);
        
        if (difficulty.timeOfDay === 'evening') {
          pipeGradient.addColorStop(0, '#4CAF50');
          pipeGradient.addColorStop(1, '#388E3C');
        } else if (difficulty.timeOfDay === 'night') {
          pipeGradient.addColorStop(0, '#2E7D32');
          pipeGradient.addColorStop(1, '#1B5E20');
        } else {
          pipeGradient.addColorStop(0, '#4CAF50');
          pipeGradient.addColorStop(1, '#388E3C');
        }

        // Pipe shadows with correct width
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(pipe.x + 2, 2, pipeWidth, pipe.topHeight);
        ctx.fillRect(pipe.x + 2, pipe.bottomY + 2, pipeWidth, canvas.height - pipe.bottomY);

        // Add glow effect for moving pipes
        if (pipe.isMoving) {
          ctx.shadowColor = '#4CAF50';
          ctx.shadowBlur = 8;
        }

        // Top pipe
        ctx.fillStyle = pipeGradient;
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);

        // Bottom pipe  
        ctx.fillRect(pipe.x, pipe.bottomY, pipeWidth, canvas.height - pipe.bottomY);

        // Pipe caps with enhanced styling and correct width
        const capGradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipeWidth, 0);
        capGradient.addColorStop(0, '#66BB6A');
        capGradient.addColorStop(1, '#4CAF50');
        
        ctx.fillStyle = capGradient;
        ctx.fillRect(pipe.x - 4, pipe.topHeight - 20, pipeWidth + 8, 20);
        ctx.fillRect(pipe.x - 4, pipe.bottomY, pipeWidth + 8, 20);

        // Reset shadow
        ctx.shadowBlur = 0;
      });
    }

    // Draw bird with precise sprite rendering
    const birdImage = new Image();
    birdImage.src = getBirdImage();
    
    ctx.save();
    
    // Add glow effect for night time
    if (difficulty.timeOfDay === 'night') {
      ctx.shadowColor = '#FFFF00';
      ctx.shadowBlur = 12;
    }
    
    // Different animation based on game state
    let flapOffset = 0;
    if (state.gameStarted) {
      // Subtle flapping animation when game is active
      flapOffset = Math.sin(state.frameCount * 0.2) * 1.5;
    } else {
      // Gentle floating animation when waiting
      flapOffset = Math.sin(state.frameCount * 0.1) * 2;
    }
    
    ctx.translate(state.bird.x, state.bird.y + flapOffset);
    ctx.rotate(state.bird.rotation * Math.PI / 180);
    
    // Draw bird sprite with precise dimensions
    ctx.drawImage(birdImage, -BIRD_SIZE/2, -BIRD_SIZE/2, BIRD_SIZE, BIRD_SIZE);
    ctx.restore();

    // Show "Tap to Start" message when game hasn't started
    if (!state.gameStarted && state.initialized) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Tap to Start!', canvas.width / 2, canvas.height / 2);
      
      ctx.font = '16px Arial';
      ctx.fillText('Touch the screen or press space to begin flying', canvas.width / 2, canvas.height / 2 + 40);
    }

    // Draw smooth scrolling ground with NO flickering
    groundOffset.current += state.gameStarted ? 2 : 0.5; // Slower scroll when not started
    if (groundOffset.current >= 50) groundOffset.current = 0;
    
    const groundGradient = ctx.createLinearGradient(0, canvas.height - GROUND_HEIGHT, 0, canvas.height);
    if (difficulty.timeOfDay === 'evening') {
      groundGradient.addColorStop(0, '#8B4513');
      groundGradient.addColorStop(1, '#654321');
    } else if (difficulty.timeOfDay === 'night') {
      groundGradient.addColorStop(0, '#2F1B14');
      groundGradient.addColorStop(1, '#1A0F0A');
    } else {
      groundGradient.addColorStop(0, '#8B4513');
      groundGradient.addColorStop(1, '#5D2F0C');
    }
    
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, canvas.height - GROUND_HEIGHT, canvas.width, GROUND_HEIGHT);
    
    // Add ground texture pattern for seamless scrolling
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    for (let x = -groundOffset.current; x < canvas.width; x += 50) {
      ctx.fillRect(x, canvas.height - GROUND_HEIGHT, 2, GROUND_HEIGHT);
    }

    // Buildings/cityscape in background (optimized rendering)
    if (state.frameCount % 2 === 0) {
      ctx.fillStyle = difficulty.timeOfDay === 'night' ? 'rgba(50,50,50,0.8)' : 'rgba(100,100,100,0.6)';
      for (let i = 0; i < 5; i++) {
        const buildingX = (canvas.width / 5) * i;
        const buildingHeight = 50 + Math.sin(buildingX * 0.01 + state.frameCount * 0.001) * 30;
        ctx.fillRect(buildingX, canvas.height - GROUND_HEIGHT - buildingHeight, canvas.width / 5, buildingHeight);
      }
    }
  }, [getBirdImage, canvasRef, gameStateRef, gameMode, getDifficultyOptimized, getBackgroundColorsOptimized]);

  return { draw };
};
