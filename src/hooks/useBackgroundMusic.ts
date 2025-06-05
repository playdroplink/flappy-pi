
import { useEffect, useRef } from 'react';

interface UseBackgroundMusicProps {
  musicEnabled: boolean;
  gameState: 'menu' | 'playing' | 'gameOver' | 'paused';
}

export const useBackgroundMusic = ({ musicEnabled, gameState }: UseBackgroundMusicProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio
    if (!audioRef.current) {
      audioRef.current = new Audio('/sounds/background/Flappy Pi Main Theme Song.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
    }

    const audio = audioRef.current;

    if (musicEnabled && (gameState === 'playing' || gameState === 'menu')) {
      audio.play().catch(error => {
        console.log('Audio play failed:', error);
      });
    } else {
      audio.pause();
    }

    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, [musicEnabled, gameState]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
};
