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
  const backgroundCache = useRef<{ theme: string; colors: any } | null>(null);
  const groundOffset = useRef(0);
  const starField = useRef<Array<{x: number, y: number, size: number, twinkle: number}>>([]);

  const getDifficultyOptimized = useCallback((score: number) => {
    if (difficultyCache.current && difficultyCache.current.score === score) {
      return difficultyCache.current.difficulty;
    }
    
    const difficulty = getDifficultyByUserChoice(userDifficulty, score, gameMode);
    difficultyCache.current = { score, difficulty };
    return difficulty;
  }, [gameMode, userDifficulty]);

  const getBackgroundColorsOptimized = useCallback((theme: string) => {
    if (backgroundCache.current && backgroundCache.current.theme === theme) {
      return backgroundCache.current.colors;
    }
    
    const colors = getBackgroundGradient(theme);
    backgroundCache.current = { theme, colors };
    return colors;
  }, []);

  const initializeStarField = useCallback((canvas: HTMLCanvasElement) => {
    if (starField.current.length === 0) {
      for (let i = 0; i < 100; i++) {
        starField.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.8, // Don't place stars too low
          size: Math.random() * 2 + 0.5,
          twinkle: Math.random() * Math.PI * 2
        });
      }
    }
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
    const backgroundColors = getBackgroundColorsOptimized(difficulty.backgroundTheme);
    
    const BIRD_SIZE = 32;
    const GROUND_HEIGHT = 40;

    // Clear canvas with beautiful gradient background based on level
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, backgroundColors.top);
    gradient.addColorStop(0.7, backgroundColors.middle || backgroundColors.top);
    gradient.addColorStop(1, backgroundColors.bottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars for night and space themes
    if (difficulty.hasStars) {
      initializeStarField(canvas);
      ctx.fillStyle = difficulty.backgroundTheme === 'space' ? '#FFFFFF' : '#FFFFCC';
      
      starField.current.forEach((star, index) => {
        const twinkle = Math.sin(state.frameCount * 0.02 + star.twinkle) * 0.3 + 0.7;
        ctx.globalAlpha = twinkle;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Move stars slowly for parallax effect
        star.x -= difficulty.backgroundScrollSpeed * 0.1;
        if (star.x < -10) {
          star.x = canvas.width + 10;
          star.y = Math.random() * canvas.height * 0.8;
        }
      });
      ctx.globalAlpha = 1;
    }

    // Draw nebula effect for space theme
    if (difficulty.hasNebulaEffect) {
      const nebulaGradient = ctx.createRadialGradient(
        canvas.width * 0.7, canvas.height * 0.3, 0,
        canvas.width * 0.7, canvas.height * 0.3, canvas.width * 0.6
      );
      nebulaGradient.addColorStop(0, 'rgba(138, 43, 226, 0.1)');
      nebulaGradient.addColorStop(0.5, 'rgba(75, 0, 130, 0.05)');
      nebulaGradient.addColorStop(1, 'rgba(25, 25, 112, 0.02)');
      
      ctx.fillStyle = nebulaGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw animated clouds with theme-appropriate colors (only if enabled)
    if (difficulty.hasClouds && state.clouds) {
      state.clouds.forEach((cloud: any) => {
        // Cloud color based on theme
        let cloudColor = '#FFFFFF';
        if (difficulty.backgroundTheme === 'evening') cloudColor = '#E8B4FF';
        else if (difficulty.backgroundTheme === 'sunset') cloudColor = '#FFE4B5';
        else if (difficulty.backgroundTheme === 'night') cloudColor = '#696969';
        
        // Cloud shadow
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(cloud.x + 3, cloud.y + 3, cloud.size / 2, 0, Math.PI * 2);
        ctx.arc(cloud.x + cloud.size * 0.3 + 3, cloud.y + 3, cloud.size * 0.4, 0, Math.PI * 2);
        ctx.arc(cloud.x - cloud.size * 0.3 + 3, cloud.y + 3, cloud.size * 0.4, 0, Math.PI * 2);
        ctx.fill();
        
        // Cloud
        ctx.fillStyle = cloudColor;
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

    // Draw bird with enhanced respawn positioning
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
    if (state.gameStarted) {
      // Subtle flapping animation when game is active
      flapOffset = Math.sin(state.frameCount * 0.2) * 1.5;
    } else {
      // Gentle floating animation when waiting to start
      flapOffset = Math.sin(state.frameCount * 0.1) * 2;
    }
    
    // Ensure bird stays in safe spawn position until game starts
    const birdX = state.gameStarted ? state.bird.x : 80;
    const birdY = state.gameStarted ? state.bird.y + flapOffset : state.bird.y + flapOffset;
    
    ctx.translate(birdX, birdY);
    ctx.rotate(state.bird.rotation * Math.PI / 180);
    
    // Draw bird sprite with precise dimensions
    ctx.drawImage(birdImage, -BIRD_SIZE/2, -BIRD_SIZE/2, BIRD_SIZE, BIRD_SIZE);
    ctx.restore();

    // Enhanced "Tap to Start" overlay
    if (!state.gameStarted && state.initialized) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Main title
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Tap to Start!', canvas.width / 2, canvas.height / 2);
      
      // Subtitle with instructions
      ctx.font = '16px Arial';
      ctx.fillText('Touch the screen or press space to begin flying', canvas.width / 2, canvas.height / 2 + 40);
      
      // Theme indicator
      ctx.font = '14px Arial';
      const themeText = `${difficulty.backgroundTheme.charAt(0).toUpperCase() + difficulty.backgroundTheme.slice(1)} Theme`;
      ctx.fillText(themeText, canvas.width / 2, canvas.height / 2 + 60);
      
      // Animated "Get Ready" pulse effect
      const pulseAlpha = 0.5 + Math.sin(state.frameCount * 0.1) * 0.3;
      ctx.fillStyle = `rgba(255, 255, 255, ${pulseAlpha})`;
      ctx.font = '12px Arial';
      ctx.fillText('Get Ready!', canvas.width / 2, canvas.height / 2 + 80);
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
  }, [getBirdImage, canvasRef, gameStateRef, gameMode, getDifficultyOptimized, getBackgroundColorsOptimized, initializeStarField]);

  return { draw };
};
