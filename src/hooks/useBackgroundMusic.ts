
import { useEffect, useRef, useState } from 'react';

interface UseBackgroundMusicProps {
  musicEnabled: boolean;
  gameState: 'menu' | 'playing' | 'gameOver' | 'paused';
}

export const useBackgroundMusic = ({ musicEnabled, gameState }: UseBackgroundMusicProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMobileAudioUnlocked, setIsMobileAudioUnlocked] = useState(false);

  // Function to unlock audio on mobile
  const unlockAudio = () => {
    if (audioRef.current && !isMobileAudioUnlocked) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          audioRef.current?.pause();
          setIsMobileAudioUnlocked(true);
        }).catch(() => {
          // Audio play failed, will try again on next user interaction
        });
      }
    }
  };

  useEffect(() => {
    // Initialize audio
    if (!audioRef.current) {
      audioRef.current = new Audio('/sounds/background/Flappy Pi Main Theme Song.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
      audioRef.current.preload = 'auto';
    }

    const audio = audioRef.current;

    // Add event listeners for mobile audio unlock
    const handleUserInteraction = () => {
      unlockAudio();
    };

    // Add listeners for common user interactions
    document.addEventListener('touchstart', handleUserInteraction, { once: true });
    document.addEventListener('click', handleUserInteraction, { once: true });

    if (musicEnabled && (gameState === 'playing' || gameState === 'menu')) {
      if (isMobileAudioUnlocked || !('ontouchstart' in window)) {
        audio.play().catch(error => {
          console.log('Audio play failed:', error);
        });
      }
    } else {
      audio.pause();
    }

    return () => {
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
      if (audio) {
        audio.pause();
      }
    };
  }, [musicEnabled, gameState, isMobileAudioUnlocked]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
};
