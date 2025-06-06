
import { useEffect, useRef, useState } from 'react';

interface UseBackgroundMusicProps {
  musicEnabled: boolean;
  gameState: 'menu' | 'playing' | 'gameOver' | 'paused';
}

export const useBackgroundMusic = ({ musicEnabled, gameState }: UseBackgroundMusicProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMobileAudioUnlocked, setIsMobileAudioUnlocked] = useState(false);
  const [volume, setVolume] = useState(0.3);

  // Function to unlock audio on mobile with multiple format support
  const unlockAudio = () => {
    if (audioRef.current && !isMobileAudioUnlocked) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          audioRef.current?.pause();
          setIsMobileAudioUnlocked(true);
          console.log('Mobile audio unlocked');
        }).catch(() => {
          console.log('Audio unlock failed, will try again');
        });
      }
    }
  };

  useEffect(() => {
    // Initialize audio with multiple format fallbacks
    if (!audioRef.current) {
      audioRef.current = new Audio();
      
      // Try multiple formats for better compatibility
      const formats = ['mp3', 'ogg'];
      let formatIndex = 0;

      const tryNextFormat = () => {
        if (formatIndex >= formats.length) {
          console.warn('Failed to load background music - no supported format found');
          return;
        }

        const format = formats[formatIndex];
        audioRef.current!.src = `/sounds/background/Flappy Pi Main Theme Song.${format}`;
        
        audioRef.current!.addEventListener('loadeddata', () => {
          audioRef.current!.loop = true;
          audioRef.current!.volume = volume;
          audioRef.current!.preload = 'auto';
          console.log(`Background music loaded successfully (${format})`);
        }, { once: true });

        audioRef.current!.addEventListener('error', () => {
          console.log(`Format ${format} failed, trying next...`);
          formatIndex++;
          tryNextFormat();
        }, { once: true });

        audioRef.current!.load();
      };

      tryNextFormat();
    }

    const audio = audioRef.current;

    // Add event listeners for mobile audio unlock
    const handleUserInteraction = () => {
      unlockAudio();
    };

    // Add listeners for common user interactions
    document.addEventListener('touchstart', handleUserInteraction, { once: true });
    document.addEventListener('click', handleUserInteraction, { once: true });
    document.addEventListener('keydown', handleUserInteraction, { once: true });

    // Play/pause based on settings and game state
    if (musicEnabled && (gameState === 'playing' || gameState === 'menu')) {
      if (isMobileAudioUnlocked || !('ontouchstart' in window)) {
        audio.play().catch(() => {
          console.log('Audio play failed - user interaction required');
        });
      }
    } else {
      audio.pause();
    }

    return () => {
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, [musicEnabled, gameState, isMobileAudioUnlocked, volume]);

  const setMusicVolume = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play().catch(() => {
          console.log('Failed to resume music');
        });
      } else {
        audioRef.current.pause();
      }
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return {
    setMusicVolume,
    toggleMusic,
    isUnlocked: isMobileAudioUnlocked
  };
};
