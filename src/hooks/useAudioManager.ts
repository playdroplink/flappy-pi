
import { useRef, useEffect } from 'react';
import { useAudioContext } from './useAudioContext';
import { useAudioLoader } from './useAudioLoader';
import { useAudioPlayback } from './useAudioPlayback';

interface UseAudioManagerProps {
  musicEnabled: boolean;
  gameState: 'menu' | 'playing' | 'gameOver' | 'paused';
}

export const useAudioManager = ({ musicEnabled, gameState }: UseAudioManagerProps) => {
  const backgroundMusic = useRef<HTMLAudioElement | null>(null);
  const { audioUnlocked } = useAudioContext();
  const { preloadAudio } = useAudioLoader();
  const audioPlayback = useAudioPlayback({ audioUnlocked });

  // Initialize background music with format fallbacks
  const initializeBackgroundMusic = () => {
    if (backgroundMusic.current) return;

    backgroundMusic.current = new Audio();
    const formats = ['mp3', 'ogg'];
    let formatIndex = 0;

    const tryNextFormat = () => {
      if (formatIndex >= formats.length) {
        console.warn('Failed to load background music');
        return;
      }

      const format = formats[formatIndex];
      backgroundMusic.current!.src = `/sounds/background/Flappy Pi Main Theme Song.${format}`;
      
      backgroundMusic.current!.addEventListener('loadeddata', () => {
        backgroundMusic.current!.loop = true;
        backgroundMusic.current!.volume = 0.3;
        console.log(`Background music loaded (${format})`);
      }, { once: true });

      backgroundMusic.current!.addEventListener('error', () => {
        formatIndex++;
        tryNextFormat();
      }, { once: true });

      backgroundMusic.current!.load();
    };

    tryNextFormat();
  };

  // Initialize all game sounds
  useEffect(() => {
    console.log('Initializing audio manager...');
    
    // Preload all game sounds with fallbacks
    preloadAudio('wing', '/assets/audio/sfx_wing');
    preloadAudio('point', '/assets/audio/sfx_point');
    preloadAudio('hit', '/assets/audio/sfx_hit');
    preloadAudio('die', '/assets/audio/sfx_die');
    preloadAudio('swoosh', '/assets/audio/sfx_swooshing');
    preloadAudio('heart', '/assets/audio/sfx_heart');

    // Initialize background music
    initializeBackgroundMusic();
  }, [preloadAudio]);

  // Handle background music with proper unlocking
  useEffect(() => {
    if (!backgroundMusic.current || !audioUnlocked) return;

    if (musicEnabled && (gameState === 'playing' || gameState === 'menu')) {
      const playPromise = backgroundMusic.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log('Background music play failed:', error);
        });
      }
    } else {
      backgroundMusic.current.pause();
    }
  }, [musicEnabled, gameState, audioUnlocked]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (backgroundMusic.current) {
        backgroundMusic.current.pause();
        backgroundMusic.current = null;
      }
    };
  }, []);

  return {
    audioUnlocked,
    ...audioPlayback
  };
};
