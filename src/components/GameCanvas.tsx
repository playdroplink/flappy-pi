
import React, { useRef, useEffect, useState, useCallback } from 'react';

interface GameCanvasProps {
  gameState: 'menu' | 'playing' | 'gameOver' | 'paused';
  gameMode: 'classic' | 'endless' | 'challenge';
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
  const [score, setScore] = useState(0);

  // Game constants with difficulty progression
  const GRAVITY = 0.4;
  const JUMP_FORCE = -8;
  const BIRD_SIZE = 40;
  const PIPE_WIDTH = 120;
  const PIPE_GAP_BASE = 200; // Base gap size
  const PIPE_SPEED_BASE = 2; // Base speed
  const PIPE_SPAWN_RATE_BASE = 120; // Base spawn rate (frames)

  // Difficulty progression based on score
  const getDifficulty = (currentScore: number) => {
    if (currentScore < 5) {
      // Easy - first 5 points
      return {
        pipeGap: PIPE_GAP_BASE + 50, // Larger gap
        pipeSpeed: PIPE_SPEED_BASE * 0.8, // Slower speed
        spawnRate: PIPE_SPAWN_RATE_BASE + 30 // Less frequent spawning
      };
    } else if (currentScore < 15) {
      // Medium - 5-15 points
      return {
        pipeGap: PIPE_GAP_BASE,
        pipeSpeed: PIPE_SPEED_BASE,
        spawnRate: PIPE_SPAWN_RATE_BASE
      };
    } else {
      // Hard - 15+ points
      return {
        pipeGap: PIPE_GAP_BASE - 30, // Smaller gap
        pipeSpeed: PIPE_SPEED_BASE * 1.2, // Faster speed
        spawnRate: PIPE_SPAWN_RATE_BASE - 20 // More frequent spawning
      };
    }
  };

  // Game state
  const gameStateRef = useRef({
    bird: { x: 100, y: 200, velocity: 0, rotation: 0 },
    pipes: [] as Array<{ x: number; topHeight: number; bottomY: number; passed: boolean }>,
    frameCount: 0,
    score: 0,
    lastPipeSpawn: 0
  });

  const getBirdImage = useCallback(() => {
    const birdImages = {
      'default': '/lovable-uploads/8ad9f53d-d0aa-4231-9042-d1890a6f997f.png',
      'green': '/lovable-uploads/b2ccab90-dff7-4e09-9564-3cdd075c6793.png',
      'red': '/lovable-uploads/3a780914-6faf-4deb-81ab-ce1f4b059984.png'
    };
    return birdImages[birdSkin] || birdImages['default'];
  }, [birdSkin]);

  const resetGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    gameStateRef.current = {
      bird: { x: 100, y: canvas.height / 2, velocity: 0, rotation: 0 },
      pipes: [],
      frameCount: 0,
      score: 0,
      lastPipeSpawn: 0
    };
    setScore(0);
    onScoreUpdate(0);
  }, [onScoreUpdate]);

  const jump = useCallback(() => {
    if (gameState === 'playing') {
      gameStateRef.current.bird.velocity = JUMP_FORCE;
    }
  }, [gameState]);

  const checkCollisions = useCallback((canvas: HTMLCanvasElement) => {
    const { bird, pipes } = gameStateRef.current;
    
    // Pipe collisions - more precise collision detection
    for (const pipe of pipes) {
      // Check if bird is within pipe's x range
      if (
        bird.x + BIRD_SIZE > pipe.x &&
        bird.x < pipe.x + PIPE_WIDTH
      ) {
        // Check collision with top pipe or bottom pipe
        if (bird.y < pipe.topHeight || bird.y + BIRD_SIZE > pipe.bottomY) {
          return true;
        }
      }
    }

    return false;
  }, []);

  const updateGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || gameState !== 'playing') return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = gameStateRef.current;
    const difficulty = getDifficulty(state.score);

    // Update bird physics
    state.bird.velocity += GRAVITY;
    state.bird.y += state.bird.velocity;
    state.bird.rotation = Math.min(Math.max(state.bird.velocity * 3, -30), 90);

    // Spawn new pipes based on difficulty
    if (state.frameCount - state.lastPipeSpawn > difficulty.spawnRate) {
      const pipeHeight = Math.random() * (canvas.height - difficulty.pipeGap - 100) + 50;
      state.pipes.push({
        x: canvas.width,
        topHeight: pipeHeight,
        bottomY: pipeHeight + difficulty.pipeGap,
        passed: false
      });
      state.lastPipeSpawn = state.frameCount;
    }

    // Update pipes and check for scoring
    state.pipes = state.pipes.filter(pipe => {
      pipe.x -= difficulty.pipeSpeed;
      
      // Score when bird passes the center of the pipe
      if (!pipe.passed && state.bird.x > pipe.x + PIPE_WIDTH / 2) {
        pipe.passed = true;
        state.score++;
        setScore(state.score);
        onScoreUpdate(state.score);
        console.log('Score updated:', state.score);
      }
      
      return pipe.x > -PIPE_WIDTH;
    });

    // Check collisions AFTER updating positions
    if (checkCollisions(canvas)) {
      console.log('Collision detected! Game Over');
      onCollision();
      return;
    }

    state.frameCount++;
  }, [gameState, checkCollisions, onCollision, onScoreUpdate]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#98D8E8');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const state = gameStateRef.current;

    // Draw pipes
    state.pipes.forEach(pipe => {
      // Top pipe
      ctx.fillStyle = '#4CAF50';
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
      ctx.strokeStyle = '#388E3C';
      ctx.lineWidth = 3;
      ctx.strokeRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);

      // Bottom pipe
      ctx.fillRect(pipe.x, pipe.bottomY, PIPE_WIDTH, canvas.height - pipe.bottomY);
      ctx.strokeRect(pipe.x, pipe.bottomY, PIPE_WIDTH, canvas.height - pipe.bottomY);

      // Pipe caps
      ctx.fillStyle = '#66BB6A';
      ctx.fillRect(pipe.x - 5, pipe.topHeight - 30, PIPE_WIDTH + 10, 30);
      ctx.fillRect(pipe.x - 5, pipe.bottomY, PIPE_WIDTH + 10, 30);
    });

    // Draw bird
    const birdImage = new Image();
    birdImage.src = getBirdImage();
    
    ctx.save();
    ctx.translate(state.bird.x + BIRD_SIZE/2, state.bird.y + BIRD_SIZE/2);
    ctx.rotate(state.bird.rotation * Math.PI / 180);
    ctx.drawImage(birdImage, -BIRD_SIZE/2, -BIRD_SIZE/2, BIRD_SIZE, BIRD_SIZE);
    ctx.restore();

    // Draw ground
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
  }, [getBirdImage]);

  const gameLoop = useCallback(() => {
    updateGame();
    draw();
    
    if (gameState === 'playing') {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
  }, [updateGame, draw, gameState]);

  // Handle input
  useEffect(() => {
    const handleClick = () => jump();
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };

    if (gameState === 'playing') {
      window.addEventListener('click', handleClick);
      window.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [jump, gameState]);

  // Game loop management
  useEffect(() => {
    if (gameState === 'playing') {
      resetGame();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, gameLoop, resetGame]);

  // Canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full bg-gradient-to-b from-sky-400 to-sky-600 touch-none"
      style={{ 
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none'
      }}
    />
  );
};

export default GameCanvas;
