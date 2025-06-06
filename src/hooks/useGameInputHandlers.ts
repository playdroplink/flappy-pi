
import { useEffect, useRef } from 'react';

interface UseGameInputHandlersProps {
  gameState: 'menu' | 'playing' | 'gameOver' | 'paused';
  jump: () => void;
  playWingFlap: () => void;
}

export const useGameInputHandlers = ({ gameState, jump, playWingFlap }: UseGameInputHandlersProps) => {
  const inputHandlersRef = useRef<{
    handleClick?: (e: MouseEvent) => void;
    handleKeyPress?: (e: KeyboardEvent) => void;
  }>({});

  useEffect(() => {
    // Force cleanup of any existing handlers
    if (inputHandlersRef.current.handleClick) {
      window.removeEventListener('click', inputHandlersRef.current.handleClick);
      window.removeEventListener('mousedown', inputHandlersRef.current.handleClick);
      window.removeEventListener('touchstart', inputHandlersRef.current.handleClick);
    }
    if (inputHandlersRef.current.handleKeyPress) {
      window.removeEventListener('keydown', inputHandlersRef.current.handleKeyPress);
    }

    if (gameState === 'playing') {
      const handleClick = (e: MouseEvent | TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        playWingFlap();
        jump();
      };
      
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.code === 'Space') {
          e.preventDefault();
          e.stopPropagation();
          playWingFlap();
          jump();
        }
      };

      inputHandlersRef.current = { handleClick, handleKeyPress };
      
      window.addEventListener('click', handleClick);
      window.addEventListener('mousedown', handleClick);
      window.addEventListener('touchstart', handleClick);
      window.addEventListener('keydown', handleKeyPress);
    } else {
      inputHandlersRef.current = {};
    }

    return () => {
      if (inputHandlersRef.current.handleClick) {
        window.removeEventListener('click', inputHandlersRef.current.handleClick);
        window.removeEventListener('mousedown', inputHandlersRef.current.handleClick);
        window.removeEventListener('touchstart', inputHandlersRef.current.handleClick);
      }
      if (inputHandlersRef.current.handleKeyPress) {
        window.removeEventListener('keydown', inputHandlersRef.current.handleKeyPress);
      }
    };
  }, [jump, gameState, playWingFlap]);
};
