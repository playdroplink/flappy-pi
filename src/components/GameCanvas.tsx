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
    rotation: 0
  });
  const pipesRef = useRef<Pipe[]>([]);
  const scoreRef = useRef(0);
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);
  const tapIndicatorsRef = useRef<Array<{x: number, y: number, time: number}>>([]);
  const coinAnimationsRef = useRef<Array<{x: number, y: number, time: number}>>([]);

  const BIRD_SIZE = 35;
  const PIPE_WIDTH = 65;
  const BASE_PIPE_GAP = 160;
  const GRAVITY = 0.6;
  const FLAP_STRENGTH = -10;
  const BASE_PIPE_SPEED = 2.5;

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

  const getBirdColor = useCallback(() => {
    switch (birdSkin) {
      case 'red': return '#ef4444';
      case 'blue': return '#3b82f6';
      case 'gold': return '#f59e0b';
      case 'purple': return '#8b5cf6';
      default: return '#fbbf24';
    }
  }, [birdSkin]);

  const resetGame = useCallback(() => {
    birdRef.current = { x: 100, y: 200, velocity: 0, rotation: 0 };
    pipesRef.current = [];
    scoreRef.current = 0;
    tapIndicatorsRef.current = [];
    coinAnimationsRef.current = [];
    onScoreUpdate(0);
  }, [onScoreUpdate]);

  // Initialize background music
  useEffect(() => {
    if (musicEnabled && !backgroundMusicRef.current) {
      // Create audio context for background music (placeholder)
      console.log('Background music would start here');
    } else if (!musicEnabled && backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
    }
  }, [musicEnabled]);

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

  const checkCollision = (bird: typeof birdRef.current, pipe: Pipe, canvas: HTMLCanvasElement) => {
    const { pipeGap } = getDifficulty();
    
    // Check collision with ground or ceiling
    if (bird.y + BIRD_SIZE >= canvas.height - 60 || bird.y <= 0) {
      return true;
    }

    // Check collision with pipe
    if (bird.x + BIRD_SIZE > pipe.x && bird.x < pipe.x + PIPE_WIDTH) {
      if (bird.y < pipe.y || bird.y + BIRD_SIZE > pipe.y + pipeGap) {
        return true;
      }
    }

    return false;
  };

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { pipeSpeed, pipeGap } = getDifficulty();

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameState === 'playing') {
      // Update bird
      birdRef.current.velocity += GRAVITY;
      birdRef.current.y += birdRef.current.velocity;
      birdRef.current.rotation = Math.min(birdRef.current.rotation + 0.08, 0.6);

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

        // Check collision
        if (checkCollision(birdRef.current, pipe, canvas)) {
          console.log('Collision sound effect');
          onCollision();
          return;
        }
      });

      // Remove off-screen pipes
      pipesRef.current = pipesRef.current.filter(pipe => pipe.x + PIPE_WIDTH > 0);

      // Add new pipes
      if (pipesRef.current.length === 0 || pipesRef.current[pipesRef.current.length - 1].x < canvas.width - 250) {
        pipesRef.current.push(createPipe(canvas.width));
      }
    }

    // Draw sky gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#8B5CF6');
    gradient.addColorStop(0.3, '#A855F7');
    gradient.addColorStop(0.7, '#7C3AED');
    gradient.addColorStop(1, '#6D28D9');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw floating clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    for (let i = 0; i < 6; i++) {
      const x = (i * 180 + Date.now() * 0.03) % (canvas.width + 120);
      const y = 40 + i * 25;
      ctx.beginPath();
      ctx.arc(x, y, 18, 0, Math.PI * 2);
      ctx.arc(x + 12, y, 22, 0, Math.PI * 2);
      ctx.arc(x + 24, y, 16, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw enhanced pipes with 3D effect
    pipesRef.current.forEach(pipe => {
      // Pipe gradient
      const pipeGradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + PIPE_WIDTH, 0);
      pipeGradient.addColorStop(0, '#16a34a');
      pipeGradient.addColorStop(0.5, '#22c55e');
      pipeGradient.addColorStop(1, '#15803d');
      
      ctx.fillStyle = pipeGradient;
      ctx.strokeStyle = '#14532d';
      ctx.lineWidth = 3;
      
      // Top pipe with shadow
      ctx.fillRect(pipe.x + 2, 2, PIPE_WIDTH, pipe.y);
      ctx.fillStyle = '#16a34a';
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.y);
      ctx.strokeRect(pipe.x, 0, PIPE_WIDTH, pipe.y);
      
      // Bottom pipe with shadow
      ctx.fillStyle = pipeGradient;
      ctx.fillRect(pipe.x + 2, pipe.y + pipeGap + 2, PIPE_WIDTH, canvas.height - pipe.y - pipeGap - 60);
      ctx.fillStyle = '#16a34a';
      ctx.fillRect(pipe.x, pipe.y + pipeGap, PIPE_WIDTH, canvas.height - pipe.y - pipeGap - 60);
      ctx.strokeRect(pipe.x, pipe.y + pipeGap, PIPE_WIDTH, canvas.height - pipe.y - pipeGap - 60);

      // Enhanced pipe caps with 3D effect
      const capGradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + PIPE_WIDTH + 10, 0);
      capGradient.addColorStop(0, '#22c55e');
      capGradient.addColorStop(0.5, '#16a34a');
      capGradient.addColorStop(1, '#15803d');
      
      ctx.fillStyle = capGradient;
      ctx.fillRect(pipe.x - 6, pipe.y - 25, PIPE_WIDTH + 12, 25);
      ctx.strokeRect(pipe.x - 6, pipe.y - 25, PIPE_WIDTH + 12, 25);
      ctx.fillRect(pipe.x - 6, pipe.y + pipeGap, PIPE_WIDTH + 12, 25);
      ctx.strokeRect(pipe.x - 6, pipe.y + pipeGap, PIPE_WIDTH + 12, 25);
    });

    // Draw enhanced bird with more detail
    ctx.save();
    ctx.translate(birdRef.current.x + BIRD_SIZE / 2, birdRef.current.y + BIRD_SIZE / 2);
    ctx.rotate(birdRef.current.rotation);
    
    // Bird shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.ellipse(2, 2, BIRD_SIZE / 2, BIRD_SIZE / 2.5, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Bird body gradient
    const birdGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, BIRD_SIZE / 2);
    birdGradient.addColorStop(0, getBirdColor());
    birdGradient.addColorStop(0.7, getBirdColor());
    birdGradient.addColorStop(1, '#d97706');
    
    ctx.fillStyle = birdGradient;
    ctx.beginPath();
    ctx.ellipse(0, 0, BIRD_SIZE / 2, BIRD_SIZE / 2.5, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Bird wing (animated)
    const wingOffset = Math.sin(Date.now() * 0.02) * 3;
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.ellipse(-8, wingOffset, 8, 12, -0.3, 0, Math.PI * 2);
    ctx.fill();
    
    // Bird eye with shine
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(-6, -6, 7, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(-4, -6, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Eye shine
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(-3, -7, 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Enhanced beak
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.moveTo(BIRD_SIZE / 2 - 6, -2);
    ctx.lineTo(BIRD_SIZE / 2 + 8, 0);
    ctx.lineTo(BIRD_SIZE / 2 - 2, 6);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();

    // Draw tap indicators
    const currentTime = Date.now();
    tapIndicatorsRef.current = tapIndicatorsRef.current.filter(tap => {
      const age = currentTime - tap.time;
      if (age > 800) return false;
      
      const alpha = 1 - (age / 800);
      const scale = 1 + (age / 400);
      
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(tap.x, tap.y);
      ctx.scale(scale, scale);
      
      // Ripple effect
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.stroke();
      
      // TAP text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('TAP!', 0, 4);
      
      ctx.restore();
      return true;
    });

    // Draw coin animations
    coinAnimationsRef.current = coinAnimationsRef.current.filter(coin => {
      const age = currentTime - coin.time;
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

    // Draw enhanced ground with grass texture
    const groundGradient = ctx.createLinearGradient(0, canvas.height - 60, 0, canvas.height);
    groundGradient.addColorStop(0, '#16a34a');
    groundGradient.addColorStop(0.5, '#15803d');
    groundGradient.addColorStop(1, '#14532d');
    
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, canvas.height - 60, canvas.width, 60);
    
    // Grass details
    ctx.fillStyle = '#22c55e';
    for (let i = 0; i < canvas.width; i += 15) {
      const grassHeight = Math.random() * 8 + 4;
      ctx.fillRect(i, canvas.height - 60, 2, -grassHeight);
    }

    // Show tap instruction for new players
    if (gameState === 'playing' && scoreRef.current === 0) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('TAP TO FLY! 🐦', canvas.width / 2, canvas.height / 2 - 50);
      
      // Animated hand pointer
      const handY = canvas.height / 2 + Math.sin(Date.now() * 0.005) * 10;
      ctx.font = '30px Arial';
      ctx.fillText('👆', canvas.width / 2, handY);
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, gameMode, level, onCollision, onScoreUpdate, getBirdColor, getDifficulty]);

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
