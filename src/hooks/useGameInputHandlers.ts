
import { useEffect } from 'react';

interface UseGameInputHandlersProps {
  gameState: 'menu' | 'playing' | 'gameOver' | 'paused';
  jump: () => void;
  playWingFlap: () => void;
}

export const useGameInputHandlers = ({ gameState, jump, playWingFlap }: UseGameInputHandlersProps) => {
  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleInput = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      playWingFlap();
      jump();
    };

    // Add multiple input listeners for better compatibility
    document.addEventListener('click', handleInput);
    document.addEventListener('touchstart', handleInput);
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        handleInput(e);
      }
    });

    return () => {
      document.removeEventListener('click', handleInput);
      document.removeEventListener('touchstart', handleInput);
      document.removeEventListener('keydown', handleInput);
    };
  }, [jump, gameState, playWingFlap]);
};
