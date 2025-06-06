
import { useEffect, useRef, useCallback } from 'react';

interface UseGameLoopManagerProps {
  gameState: 'menu' | 'playing' | 'gameOver' | 'paused';
  gameStateRef: React.MutableRefObject<any>;
  updateGame: () => void;
  draw: () => void;
  resetGame: (canvasHeight: number) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  resetVisuals?: () => void;
}

export const useGameLoopManager = ({
  gameState,
  gameStateRef,
  updateGame,
  draw,
  resetGame,
  canvasRef,
  resetVisuals
}: UseGameLoopManagerProps) => {
  const animationFrameRef = useRef<number>();
  const lastResetState = useRef<string>('');
  const isResetting = useRef<boolean>(false);
  const cleanupTimeoutRef = useRef<number>();

  const gameLoop = useCallback(() => {
    if (gameState === 'playing') {
      updateGame();
    }
    draw();
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, updateGame, draw]);

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      
      console.log('📐 Canvas resized:', canvas.width, 'x', canvas.height);
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [canvasRef]);

  const killAllAnimations = useCallback(() => {
    console.log('🛑 Killing all animations and timers');
    
    // Cancel any pending animation frames
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }
    
    // Clear any pending timeouts
    if (cleanupTimeoutRef.current) {
      clearTimeout(cleanupTimeoutRef.current);
      cleanupTimeoutRef.current = undefined;
    }
    
    console.log('✅ All animations and timers killed');
  }, []);

  const performCompleteReset = useCallback(() => {
    if (isResetting.current) {
      console.log('⚠️ Reset already in progress, skipping');
      return;
    }
    
    isResetting.current = true;
    console.log('🔄 Starting COMPLETE game reset with full cleanup...');
    
    // Step 1: Kill all animations and timers
    killAllAnimations();
    
    const canvas = canvasRef.current;
    if (canvas) {
      // Step 2: Reset game state completely
      resetGame(canvas.height);
      
      // Step 3: Reset visual state
      if (resetVisuals) {
        console.log('🎨 Resetting visual systems');
        resetVisuals();
      }
      
      // Step 4: Clear canvas for clean start
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      
      // Step 5: Restart animation loop after cleanup delay
      cleanupTimeoutRef.current = window.setTimeout(() => {
        console.log('🔄 Restarting animation loop after cleanup');
        animationFrameRef.current = requestAnimationFrame(gameLoop);
        isResetting.current = false;
        console.log('✅ Complete reset finished - game ready');
      }, 150); // Slightly longer delay for thorough cleanup
    } else {
      isResetting.current = false;
    }
  }, [resetGame, canvasRef, resetVisuals, gameLoop, killAllAnimations]);

  // Setup canvas on mount
  useEffect(() => {
    const cleanup = setupCanvas();
    return cleanup;
  }, [setupCanvas]);

  // Handle game state transitions with complete reset
  useEffect(() => {
    const currentState = gameState;
    const lastState = lastResetState.current;
    
    console.log('🎮 Game state transition:', lastState, '->', currentState);
    
    // Trigger complete reset when transitioning to playing
    if (currentState === 'playing' && lastState !== 'playing') {
      console.log('🚀 Triggering complete reset for new game');
      performCompleteReset();
    }
    
    lastResetState.current = currentState;
  }, [gameState, performCompleteReset]);

  // Main animation loop management
  useEffect(() => {
    if (!isResetting.current && gameStateRef.current?.initialized) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      killAllAnimations();
    };
  }, [gameLoop, gameStateRef, killAllAnimations]);

  // Initialize game state when canvas is ready
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && gameStateRef.current) {
      gameStateRef.current.initialized = true;
      console.log('✅ Game state initialized');
    }
  }, [canvasRef, gameStateRef]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('🧹 GameLoopManager cleanup');
      killAllAnimations();
    };
  }, [killAllAnimations]);
};
