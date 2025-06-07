
import { useRef, useEffect, useCallback, useState } from 'react';

interface UseAudioManagerProps {
  musicEnabled: boolean;
  gameState: 'menu' | 'playing' | 'gameOver' | 'paused';
}

export const useAudioManager = ({ musicEnabled, gameState }: UseAudioManagerProps) => {
  const backgroundMusic = useRef<HTMLAudioElement | null>(null);
  const soundEffects = useRef<{ [key: string]: HTMLAudioElement }>({});
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  // Initialize all audio files
  const initializeAudio = useCallback(() => {
    // Initialize background music
    if (!backgroundMusic.current) {
      backgroundMusic.current = new Audio('/sounds/background/Flappy Pi Main Theme Song.mp3');
      backgroundMusic.current.loop = true;
      backgroundMusic.current.volume = 0.3;
      backgroundMusic.current.preload = 'auto';
    }

    // Initialize sound effects using the actual GitHub assets
    const soundFiles = {
      wing: '/assets/audio/sfx_wing.wav',
      point: '/assets/audio/sfx_point.wav',
      hit: '/assets/audio/sfx_hit.wav',
      die: '/assets/audio/sfx_die.wav',
      swoosh: '/assets/audio/sfx_swooshing.wav'
    };

    Object.entries(soundFiles).forEach(([key, path]) => {
      if (!soundEffects.current[key]) {
        const audio = new Audio(path);
        audio.preload = 'auto';
        audio.volume = 0.6;
        soundEffects.current[key] = audio;
      }
    });
  }, []);

  // Unlock audio on first user interaction
  const unlockAudio = useCallback(() => {
    if (audioUnlocked) return;

    // Play and immediately pause a silent audio to unlock
    const testAudio = new Audio();
    testAudio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
    testAudio.volume = 0.01;
    
    const playPromise = testAudio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        testAudio.pause();
        setAudioUnlocked(true);
        console.log('Audio unlocked successfully');
      }).catch(() => {
        console.log('Audio unlock failed');
      });
    }
  }, [audioUnlocked]);

  // Play sound effect
  const playSound = useCallback((soundKey: string, volume = 0.6) => {
    if (!audioUnlocked) return;
    
    const audio = soundEffects.current[soundKey];
    if (audio) {
      try {
        const audioClone = audio.cloneNode() as HTMLAudioElement;
        audioClone.volume = volume;
        audioClone.currentTime = 0;
        
        const playPromise = audioClone.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Ignore play errors to prevent crashes
          });
        }
      } catch (error) {
        // Ignore sound errors
      }
    }
  }, [audioUnlocked]);

  // Initialize audio on mount
  useEffect(() => {
    initializeAudio();
    
    // Add interaction listeners for audio unlock
    const handleInteraction = () => {
      unlockAudio();
    };

    document.addEventListener('touchstart', handleInteraction, { once: true });
    document.addEventListener('click', handleInteraction, { once: true });
    document.addEventListener('keydown', handleInteraction, { once: true });

    return () => {
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, [initializeAudio, unlockAudio]);

  // Handle background music
  useEffect(() => {
    if (!backgroundMusic.current || !audioUnlocked) return;

    if (musicEnabled && (gameState === 'playing' || gameState === 'menu')) {
      const playPromise = backgroundMusic.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          console.log('Background music play failed');
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
      Object.values(soundEffects.current).forEach(audio => {
        audio.pause();
      });
      soundEffects.current = {};
    };
  }, []);

  return {
    audioUnlocked,
    playWingFlap: () => playSound('wing', 0.4),
    playPoint: () => playSound('point', 0.7),
    playHit: () => playSound('hit', 0.8),
    playDie: () => playSound('die', 0.7),
    playSwoosh: () => playSound('swoosh', 0.5)
  };
};
