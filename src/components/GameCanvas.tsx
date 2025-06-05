import React, { useRef, useEffect, useCallback } from 'react';

interface Pipe {
  x: number;
  y: number;
  passed: boolean;
}

type GameMode = 'classic' | 'endless' | 'challenge';

interface GameCanvasProps {
  gameState: 'menu' | 'playing' | 'gameOver' | 'paused';
  gameMode: GameMode;
  level: number;
  onCollision: () => void;
  onGameOver: (score: number) => void;
  onScoreUpdate: (score: number) => void;
  birdSkin: string;
  musicEnabled: boolean;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ 
  gameState, 
  gameMode,
  level,
  onCollision,
  onGameOver, 
  onScoreUpdate,
  birdSkin,
  musicEnabled 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number>();
  const birdRef = useRef({
    x: 100,
    y: 200,
    velocity: 0,
    rotation: 0,
    bounceOffset: 0,
    bounceSpeed: 0.05
  });
  const pipesRef = useRef<Pipe[]>([]);
  const scoreRef = useRef(0);
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);
  const tapIndicatorsRef = useRef<Array<{x: number, y: number, time: number}>>([]);
  const coinAnimationsRef = useRef<Array<{x: number, y: number, time: number}>>([]);
  const birdImageRef = useRef<HTMLImageElement | null>(null);
  const gameStartTimeRef = useRef<number>(0);
  const lastAdTimeRef = useRef<number>(0);
  const backgroundOffsetRef = useRef(0);

  const BIRD_SIZE = 35;
  const PIPE_WIDTH = 120; // Increased from 65 to 120 for larger pipes
  const BASE_PIPE_GAP = 160;
  const GRAVITY = 0.6;
  const FLAP_STRENGTH = -10;
  const BASE_PIPE_SPEED = 2.5;
  const AD_INTERVAL = 8000; // 8 seconds
  const PIPE_SPAWN_DELAY = 2000; // 2 seconds before first pipe

  // Load bird character image based on skin
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      birdImageRef.current = img;
    };
    
    // Use different bird images based on skin
    switch (birdSkin) {
      case 'green':
        img.src = '/lovable-uploads/b2ccab90-dff7-4e09-9564-3cdd075c6793.png';
        break;
      case 'red':
        img.src = '/lovable-uploads/3a780914-6faf-4deb-81ab-ce1f4b059984.png';
        break;
      default: // blue/default
        img.src = '/lovable-uploads/8ad9f53d-d0aa-4231-9042-d1890a6f997f.png';
    }
  }, [birdSkin]);

  // Dynamic difficulty based on game mode and level
  const getDifficulty = useCallback(() => {
    let speedMultiplier = 1 + (level - 1) * 0.15;
    let gapReduction = 0;

    switch (gameMode) {
      case 'challenge':
        speedMultiplier *= 1.8;
        gapReduction = 40;
        break;
      case 'endless':
        gapReduction = Math.min(level * 3, 50);
        break;
      default: // classic
        gapReduction = Math.min(level * 8, 35);
    }

    return {
      pipeSpeed: BASE_PIPE_SPEED * speedMultiplier,
      pipeGap: Math.max(BASE_PIPE_GAP - gapReduction, 110)
    };
  }, [gameMode, level]);

  const resetGame = useCallback(() => {
    birdRef.current = { x: 100, y: 200, velocity: 0, rotation: 0, bounceOffset: 0, bounceSpeed: 0.05 };
    pipesRef.current = [];
    scoreRef.current = 0;
    tapIndicatorsRef.current = [];
    coinAnimationsRef.current = [];
    gameStartTimeRef.current = Date.now();
    lastAdTimeRef.current = Date.now();
    backgroundOffsetRef.current = 0;
    onScoreUpdate(0);
  }, [onScoreUpdate]);

  // Initialize and manage background music
  useEffect(() => {
    if (musicEnabled && !backgroundMusicRef.current) {
      const audio = new Audio('/public/sounds/background/Flappy Pi Main Theme Song.mp3');
      audio.loop = true;
      audio.volume = 0.3;
      backgroundMusicRef.current = audio;
      
      if (gameState === 'playing') {
        audio.play().catch(console.log);
      }
    }
    
    if (backgroundMusicRef.current) {
      if (musicEnabled && gameState === 'playing') {
        backgroundMusicRef.current.play().catch(console.log);
      } else {
        backgroundMusicRef.current.pause();
      }
    }

    return () => {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current = null;
      }
    };
  }, [musicEnabled, gameState]);

  const createPipe = (x: number) => {
    const { pipeGap } = getDifficulty();
    const minY = 80;
    const maxY = 280;
    const y = Math.random() * (maxY - minY) + minY;
    return { x, y, passed: false };
  };

  const handleInput = useCallback((clientX?: number, clientY?: number) => {
    if (gameState === 'playing') {
      birdRef.current.velocity = FLAP_STRENGTH;
      birdRef.current.rotation = -0.4;
      
      // Add tap indicator
      const canvas = canvasRef.current;
      if (canvas && clientX !== undefined && clientY !== undefined) {
        const rect = canvas.getBoundingClientRect();
        tapIndicatorsRef.current.push({
          x: clientX - rect.left,
          y: clientY - rect.top,
          time: Date.now()
        });
      }
      
      console.log('Flap sound effect');
    }
  }, [gameState]);

  // Check if bird hits ground or ceiling (game over conditions)
  const checkGroundCeilingCollision = (bird: typeof birdRef.current, canvas: HTMLCanvasElement) => {
    return bird.y + BIRD_SIZE >= canvas.height - 60 || bird.y <= 0;
  };

  // Check if bird hits pipe (but don't end game, just bounce back or lose life)
  const checkPipeCollision = (bird: typeof birdRef.current, pipe: Pipe) => {
    const { pipeGap } = getDifficulty();
    
    if (bird.x + BIRD_SIZE > pipe.x && bird.x < pipe.x + PIPE_WIDTH) {
      if (bird.y < pipe.y || bird.y + BIRD_SIZE > pipe.y + pipeGap) {
        return true;
      }
    }
    return false;
  };

  const drawScrollingBackground = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Sky gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');  // Sky blue
    gradient.addColorStop(0.3, '#87CEFA');
    gradient.addColorStop(0.7, '#4682B4');
    gradient.addColorStop(1, '#1e40af');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Scrolling clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    for (let i = 0; i < 8; i++) {
      const x = (i * 200 + backgroundOffsetRef.current * 0.2) % (canvas.width + 120);
      const y = 30 + i * 20;
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.arc(x + 15, y, 25, 0, Math.PI * 2);
      ctx.arc(x + 30, y, 18, 0, Math.PI * 2);
      ctx.fill();
    }

    // Scrolling mountain silhouettes
    ctx.fillStyle = 'rgba(34, 139, 34, 0.3)';
    ctx.beginPath();
    for (let x = 0; x < canvas.width + 100; x += 50) {
      const offsetX = x - (backgroundOffsetRef.current * 0.1) % (canvas.width + 100);
      const mountainHeight = 100 + Math.sin(x * 0.01) * 50;
      ctx.lineTo(offsetX, canvas.height - 60 - mountainHeight);
    }
    ctx.lineTo(canvas.width, canvas.height - 60);
    ctx.lineTo(0, canvas.height - 60);
    ctx.closePath();
    ctx.fill();
  };

  const drawEnhancedGround = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Ground with texture
    const groundGradient = ctx.createLinearGradient(0, canvas.height - 60, 0, canvas.height);
    groundGradient.addColorStop(0, '#8FBC8F');
    groundGradient.addColorStop(0.3, '#228B22');
    groundGradient.addColorStop(0.7, '#006400');
    groundGradient.addColorStop(1, '#013220');
    
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, canvas.height - 60, canvas.width, 60);
    
    // Scrolling grass texture
    ctx.fillStyle = '#32CD32';
    for (let i = 0; i < canvas.width; i += 10) {
      const offsetX = i - (backgroundOffsetRef.current * 0.5) % 20;
      const grassHeight = Math.random() * 12 + 4;
      ctx.fillRect(offsetX, canvas.height - 60, 3, -grassHeight);
      ctx.fillRect(offsetX + 5, canvas.height - 60, 2, -(grassHeight * 0.7));
    }

    // Small flowers
    for (let i = 0; i < canvas.width; i += 80) {
      const offsetX = i - (backgroundOffsetRef.current * 0.3) % 100;
      ctx.fillStyle = '#FF69B4';
      ctx.beginPath();
      ctx.arc(offsetX, canvas.height - 50, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawEnhancedPipes = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, pipes: Pipe[]) => {
    const { pipeGap } = getDifficulty();
    
    pipes.forEach(pipe => {
      // Enhanced 3D pipe effect with multiple gradients for larger pipes
      const pipeGradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + PIPE_WIDTH, 0);
      pipeGradient.addColorStop(0, '#228B22');
      pipeGradient.addColorStop(0.15, '#32CD32');
      pipeGradient.addColorStop(0.3, '#90EE90');
      pipeGradient.addColorStop(0.5, '#32CD32');
      pipeGradient.addColorStop(0.7, '#228B22');
      pipeGradient.addColorStop(0.85, '#006400');
      pipeGradient.addColorStop(1, '#013220');
      
      // Enhanced shadow effect for larger pipes
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(pipe.x + 6, 6, PIPE_WIDTH, pipe.y);
      ctx.fillRect(pipe.x + 6, pipe.y + pipeGap + 6, PIPE_WIDTH, canvas.height - pipe.y - pipeGap - 60);
      
      // Main pipe body with enhanced gradient
      ctx.fillStyle = pipeGradient;
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.y);
      ctx.fillRect(pipe.x, pipe.y + pipeGap, PIPE_WIDTH, canvas.height - pipe.y - pipeGap - 60);
      
      // Enhanced pipe borders
      ctx.strokeStyle = '#006400';
      ctx.lineWidth = 3;
      ctx.strokeRect(pipe.x, 0, PIPE_WIDTH, pipe.y);
      ctx.strokeRect(pipe.x, pipe.y + pipeGap, PIPE_WIDTH, canvas.height - pipe.y - pipeGap - 60);

      // Enhanced pipe caps with 3D effect for larger pipes
      const capGradient = ctx.createLinearGradient(pipe.x - 12, 0, pipe.x + PIPE_WIDTH + 12, 0);
      capGradient.addColorStop(0, '#006400');
      capGradient.addColorStop(0.2, '#228B22');
      capGradient.addColorStop(0.4, '#32CD32');
      capGradient.addColorStop(0.6, '#90EE90');
      capGradient.addColorStop(0.8, '#228B22');
      capGradient.addColorStop(1, '#013220');
      
      ctx.fillStyle = capGradient;
      // Larger top cap
      ctx.fillRect(pipe.x - 12, pipe.y - 40, PIPE_WIDTH + 24, 40);
      ctx.strokeStyle = '#013220';
      ctx.lineWidth = 3;
      ctx.strokeRect(pipe.x - 12, pipe.y - 40, PIPE_WIDTH + 24, 40);
      
      // Larger bottom cap
      ctx.fillRect(pipe.x - 12, pipe.y + pipeGap, PIPE_WIDTH + 24, 40);
      ctx.strokeRect(pipe.x - 12, pipe.y + pipeGap, PIPE_WIDTH + 24, 40);

      // Enhanced pipe texture lines for larger pipes
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 5; i++) {
        const lineX = pipe.x + (PIPE_WIDTH / 6) * (i + 1);
        ctx.beginPath();
        ctx.moveTo(lineX, 0);
        ctx.lineTo(lineX, pipe.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(lineX, pipe.y + pipeGap);
        ctx.lineTo(lineX, canvas.height - 60);
        ctx.stroke();
      }

      // Add decorative rivets for larger pipes
      ctx.fillStyle = '#013220';
      for (let i = 0; i < 3; i++) {
        const rivetY = (pipe.y / 4) * (i + 1);
        ctx.beginPath();
        ctx.arc(pipe.x + PIPE_WIDTH / 4, rivetY, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(pipe.x + (PIPE_WIDTH * 3) / 4, rivetY, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Bottom pipe rivets
        const bottomRivetY = pipe.y + pipeGap + ((canvas.height - pipe.y - pipeGap - 60) / 4) * (i + 1);
        ctx.beginPath();
        ctx.arc(pipe.x + PIPE_WIDTH / 4, bottomRivetY, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(pipe.x + (PIPE_WIDTH * 3) / 4, bottomRivetY, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  };

  const drawBouncyBird = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    
    // Enhanced bouncy motion - always active
    birdRef.current.bounceOffset += birdRef.current.bounceSpeed;
    if (birdRef.current.bounceOffset > 1 || birdRef.current.bounceOffset < -1) {
      birdRef.current.bounceSpeed *= -1;
    }
    
    // More pronounced bouncy effect
    const bounceY = Math.sin(Date.now() * 0.004) * 12;
    const centerX = birdRef.current.x + BIRD_SIZE / 2;
    const centerY = birdRef.current.y + BIRD_SIZE / 2 + bounceY;
    
    ctx.translate(centerX, centerY);
    
    // Gentle rotation for flying effect
    const flyRotation = gameState === 'playing' ? 
      birdRef.current.rotation : 
      Math.sin(Date.now() * 0.003) * 0.1;
    ctx.rotate(flyRotation);
    
    // Bird shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(3, 3, BIRD_SIZE / 2, BIRD_SIZE / 2.5, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Wing flap animation
    const wingFlap = Math.sin(Date.now() * 0.015) * 0.2;
    
    if (birdImageRef.current) {
      // Scale effect for wing flapping
      ctx.scale(1 + wingFlap * 0.1, 1 + wingFlap * 0.05);
      ctx.drawImage(
        birdImageRef.current,
        -BIRD_SIZE / 2,
        -BIRD_SIZE / 2,
        BIRD_SIZE,
        BIRD_SIZE
      );
    } else {
      // Fallback bird if image doesn't load
      const birdGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, BIRD_SIZE / 2);
      birdGradient.addColorStop(0, '#4DD0E1');
      birdGradient.addColorStop(0.7, '#26C6DA');
      birdGradient.addColorStop(1, '#00BCD4');
      
      ctx.fillStyle = birdGradient;
      ctx.beginPath();
      ctx.ellipse(0, 0, BIRD_SIZE / 2, BIRD_SIZE / 2.5, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  };

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { pipeSpeed, pipeGap } = getDifficulty();
    const currentTime = Date.now();

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameState === 'playing') {
      // Update background scroll
      backgroundOffsetRef.current += pipeSpeed;

      // Update bird physics
      birdRef.current.velocity += GRAVITY;
      birdRef.current.y += birdRef.current.velocity;
      birdRef.current.rotation = Math.min(birdRef.current.rotation + 0.08, 0.6);

      // Check for ad display (every 8 seconds)
      if (currentTime - lastAdTimeRef.current > AD_INTERVAL) {
        console.log('Show ad overlay for 3 seconds');
        lastAdTimeRef.current = currentTime;
      }

      // Check ground/ceiling collision (game over)
      if (checkGroundCeilingCollision(birdRef.current, canvas)) {
        console.log('Ground/Ceiling collision - Game Over');
        onGameOver(scoreRef.current);
        return;
      }

      // Update pipes
      pipesRef.current.forEach((pipe) => {
        pipe.x -= pipeSpeed;

        // Check if bird passed pipe
        if (!pipe.passed && birdRef.current.x > pipe.x + PIPE_WIDTH) {
          pipe.passed = true;
          scoreRef.current++;
          onScoreUpdate(scoreRef.current);
          
          // Add coin animation
          coinAnimationsRef.current.push({
            x: pipe.x + PIPE_WIDTH / 2,
            y: pipe.y + pipeGap / 2,
            time: Date.now()
          });
          
          console.log('Score sound effect');
        }

        // Check pipe collision
        if (checkPipeCollision(birdRef.current, pipe)) {
          console.log('Pipe collision - Game Over');
          onGameOver(scoreRef.current);
          return;
        }
      });

      // Remove off-screen pipes
      pipesRef.current = pipesRef.current.filter(pipe => pipe.x + PIPE_WIDTH > 0);

      // Add new pipes with increased spacing for larger pipes
      const timeSinceStart = currentTime - gameStartTimeRef.current;
      if (timeSinceStart > PIPE_SPAWN_DELAY) {
        if (pipesRef.current.length === 0 || pipesRef.current[pipesRef.current.length - 1].x < canvas.width - 400) { // Increased spacing from 300 to 400
          pipesRef.current.push(createPipe(canvas.width));
        }
      }
    }

    // Draw enhanced background
    drawScrollingBackground(ctx, canvas);

    // Draw enhanced pipes
    drawEnhancedPipes(ctx, canvas, pipesRef.current);

    // Draw bouncy bird
    drawBouncyBird(ctx);

    // Draw enhanced ground
    drawEnhancedGround(ctx, canvas);

    // Draw tap indicators
    const currentTimeForAnimations = Date.now();
    tapIndicatorsRef.current = tapIndicatorsRef.current.filter(tap => {
      const age = currentTimeForAnimations - tap.time;
      if (age > 800) return false;
      
      const alpha = 1 - (age / 800);
      const scale = 1 + (age / 400);
      
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(tap.x, tap.y);
      ctx.scale(scale, scale);
      
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('TAP!', 0, 4);
      
      ctx.restore();
      return true;
    });

    // Draw coin animations
    coinAnimationsRef.current = coinAnimationsRef.current.filter(coin => {
      const age = currentTimeForAnimations - coin.time;
      if (age > 1000) return false;
      
      const alpha = 1 - (age / 1000);
      const y = coin.y - (age * 0.1);
      
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fbbf24';
      ctx.fillText('🪙+1', coin.x, y);
      ctx.restore();
      
      return true;
    });

    if (gameState === 'playing' && scoreRef.current === 0 && Date.now() - gameStartTimeRef.current < PIPE_SPAWN_DELAY) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('TAP TO FLY! 🐦', canvas.width / 2, canvas.height / 2 - 50);
      
      const handY = canvas.height / 2 + Math.sin(Date.now() * 0.005) * 10;
      ctx.font = '30px Arial';
      ctx.fillText('👆', canvas.width / 2, handY);
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, gameMode, level, onCollision, onGameOver, onScoreUpdate, getDifficulty]);

  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    } else if (gameState === 'menu') {
      resetGame();
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, gameLoop, resetGame]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleInput();
      }
    };

    const handleClick = (e: MouseEvent) => {
      handleInput(e.clientX, e.clientY);
    };

    const handleTouch = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (touch) {
        handleInput(touch.clientX, touch.clientY);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('click', handleClick);
      canvas.addEventListener('touchstart', handleTouch);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      if (canvas) {
        canvas.removeEventListener('click', handleClick);
        canvas.removeEventListener('touchstart', handleTouch);
      }
    };
  }, [handleInput]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={400}
      className="absolute inset-0 w-full h-full cursor-pointer touch-none select-none"
      style={{ imageRendering: 'pixelated' }}
    />
  );
};

export default GameCanvas;
