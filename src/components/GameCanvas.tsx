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

  const BIRD_SIZE = 30;
  const PIPE_WIDTH = 60;
  const BASE_PIPE_GAP = 150;
  const GRAVITY = 0.5;
  const FLAP_STRENGTH = -8;
  const BASE_PIPE_SPEED = 2;

  // Dynamic difficulty based on game mode and level
  const getDifficulty = useCallback(() => {
    let speedMultiplier = 1 + (level - 1) * 0.1;
    let gapReduction = 0;

    switch (gameMode) {
      case 'challenge':
        speedMultiplier *= 1.5;
        gapReduction = 30;
        break;
      case 'endless':
        gapReduction = Math.min(level * 2, 40);
        break;
      default: // classic
        gapReduction = Math.min(level * 5, 30);
    }

    return {
      pipeSpeed: BASE_PIPE_SPEED * speedMultiplier,
      pipeGap: Math.max(BASE_PIPE_GAP - gapReduction, 100)
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
    const minY = 50;
    const maxY = 250;
    const y = Math.random() * (maxY - minY) + minY;
    return { x, y, passed: false };
  };

  const handleInput = useCallback(() => {
    if (gameState === 'playing') {
      birdRef.current.velocity = FLAP_STRENGTH;
      birdRef.current.rotation = -0.3;
      // Play flap sound effect here
      console.log('Flap sound effect');
    }
  }, [gameState]);

  const checkCollision = (bird: typeof birdRef.current, pipe: Pipe, canvas: HTMLCanvasElement) => {
    const { pipeGap } = getDifficulty();
    
    // Check collision with ground or ceiling
    if (bird.y + BIRD_SIZE >= canvas.height - 50 || bird.y <= 0) {
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
      birdRef.current.rotation = Math.min(birdRef.current.rotation + 0.05, 0.5);

      // Update pipes
      pipesRef.current.forEach((pipe) => {
        pipe.x -= pipeSpeed;

        // Check if bird passed pipe
        if (!pipe.passed && birdRef.current.x > pipe.x + PIPE_WIDTH) {
          pipe.passed = true;
          scoreRef.current++;
          onScoreUpdate(scoreRef.current);
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
      if (pipesRef.current.length === 0 || pipesRef.current[pipesRef.current.length - 1].x < canvas.width - 200) {
        pipesRef.current.push(createPipe(canvas.width));
      }
    }

    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#98D8E8');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 5; i++) {
      const x = (i * 200 + Date.now() * 0.02) % (canvas.width + 100);
      const y = 50 + i * 30;
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.arc(x + 15, y, 25, 0, Math.PI * 2);
      ctx.arc(x + 30, y, 20, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw pipes
    ctx.fillStyle = '#22c55e';
    ctx.strokeStyle = '#16a34a';
    ctx.lineWidth = 3;
    
    pipesRef.current.forEach(pipe => {
      // Top pipe
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.y);
      ctx.strokeRect(pipe.x, 0, PIPE_WIDTH, pipe.y);
      
      // Bottom pipe
      ctx.fillRect(pipe.x, pipe.y + pipeGap, PIPE_WIDTH, canvas.height - pipe.y - pipeGap - 50);
      ctx.strokeRect(pipe.x, pipe.y + pipeGap, PIPE_WIDTH, canvas.height - pipe.y - pipeGap - 50);

      // Pipe caps
      ctx.fillRect(pipe.x - 5, pipe.y - 20, PIPE_WIDTH + 10, 20);
      ctx.strokeRect(pipe.x - 5, pipe.y - 20, PIPE_WIDTH + 10, 20);
      ctx.fillRect(pipe.x - 5, pipe.y + pipeGap, PIPE_WIDTH + 10, 20);
      ctx.strokeRect(pipe.x - 5, pipe.y + pipeGap, PIPE_WIDTH + 10, 20);
    });

    // Draw bird
    ctx.save();
    ctx.translate(birdRef.current.x + BIRD_SIZE / 2, birdRef.current.y + BIRD_SIZE / 2);
    ctx.rotate(birdRef.current.rotation);
    
    // Bird body
    ctx.fillStyle = getBirdColor();
    ctx.beginPath();
    ctx.ellipse(0, 0, BIRD_SIZE / 2, BIRD_SIZE / 2.5, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Bird eye
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(-5, -5, 6, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(-3, -5, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Bird beak
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(BIRD_SIZE / 2 - 5, 0);
    ctx.lineTo(BIRD_SIZE / 2 + 5, 0);
    ctx.lineTo(BIRD_SIZE / 2 - 2, 8);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();

    // Draw ground
    ctx.fillStyle = '#10b981';
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

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

    const handleClick = () => {
      handleInput();
    };

    window.addEventListener('keydown', handleKeyPress);
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('click', handleClick);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      if (canvas) {
        canvas.removeEventListener('click', handleClick);
      }
    };
  }, [handleInput]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={400}
      className="absolute inset-0 w-full h-full cursor-pointer"
      style={{ imageRendering: 'pixelated' }}
    />
  );
};

export default GameCanvas;
