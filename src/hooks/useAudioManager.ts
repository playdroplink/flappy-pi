
import { useRef, useCallback, useEffect, useState } from 'react';

interface AudioFile {
  src: string;
  audio: HTMLAudioElement;
  loaded: boolean;
}

interface UseAudioManagerProps {
  musicEnabled: boolean;
  gameState: 'menu' | 'playing' | 'gameOver' | 'paused';
}

export const useAudioManager = ({ musicEnabled, gameState }: UseAudioManagerProps) => {
  const audioFiles = useRef<Map<string, AudioFile>>(new Map());
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const audioContext = useRef<AudioContext | null>(null);
  const backgroundMusic = useRef<HTMLAudioElement | null>(null);

  // Initialize Web Audio API for better compatibility
  const initializeAudioContext = useCallback(() => {
    if (!audioContext.current) {
      try {
        audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        console.log('Audio context initialized');
      } catch (error) {
        console.warn('Web Audio API not supported, falling back to HTML5 audio');
      }
    }
  }, []);

  // Preload audio files with multiple format support
  const preloadAudio = useCallback((key: string, basePath: string) => {
    const audio = new Audio();
    
    // Try multiple formats for better compatibility
    const formats = ['mp3', 'ogg', 'wav'];
    let formatIndex = 0;

    const tryNextFormat = () => {
      if (formatIndex >= formats.length) {
        console.warn(`Failed to load audio: ${key}`);
        return;
      }

      const format = formats[formatIndex];
      audio.src = `${basePath}.${format}`;
      
      audio.addEventListener('loadeddata', () => {
        audioFiles.current.set(key, {
          src: audio.src,
          audio: audio,
          loaded: true
        });
        console.log(`Audio loaded: ${key} (${format})`);
      }, { once: true });

      audio.addEventListener('error', () => {
        formatIndex++;
        tryNextFormat();
      }, { once: true });

      audio.load();
    };

    tryNextFormat();
  }, []);

  // Unlock audio on first user interaction
  const unlockAudio = useCallback(() => {
    if (audioUnlocked) return;

    const testAudio = new Audio();
    testAudio.src = 'data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAABOW';
    
    const playPromise = testAudio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        testAudio.pause();
        testAudio.currentTime = 0;
        setAudioUnlocked(true);
        console.log('Audio unlocked successfully');
        
        // Initialize audio context after unlock
        initializeAudioContext();
        if (audioContext.current?.state === 'suspended') {
          audioContext.current.resume();
        }
      }).catch(() => {
        console.log('Audio unlock failed, will try again on next interaction');
      });
    }
  }, [audioUnlocked, initializeAudioContext]);

  // Initialize background music with format fallbacks
  const initializeBackgroundMusic = useCallback(() => {
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
  }, []);

  // Play sound effect with fallback handling
  const playSound = useCallback((key: string, volume = 0.6) => {
    if (!audioUnlocked) {
      console.log('Audio not unlocked yet');
      return;
    }

    const audioFile = audioFiles.current.get(key);
    if (!audioFile || !audioFile.loaded) {
      console.warn(`Audio not loaded: ${key}`);
      return;
    }

    try {
      const audio = audioFile.audio.cloneNode() as HTMLAudioElement;
      audio.volume = volume;
      audio.currentTime = 0;
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          console.log(`Failed to play sound: ${key}`);
        });
      }
    } catch (error) {
      console.warn(`Error playing sound ${key}:`, error);
    }
  }, [audioUnlocked]);

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
  }, [preloadAudio, initializeBackgroundMusic, unlockAudio]);

  // Handle background music
  useEffect(() => {
    if (!backgroundMusic.current || !audioUnlocked) return;

    if (musicEnabled && (gameState === 'playing' || gameState === 'menu')) {
      backgroundMusic.current.play().catch(() => {
        console.log('Background music play failed');
      });
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
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  return {
    playSound,
    audioUnlocked,
    playWingFlap: () => playSound('wing', 0.4),
    playPoint: () => playSound('point', 0.7),
    playHit: () => playSound('hit', 0.8),
    playDie: () => playSound('die', 0.7),
    playSwoosh: () => playSound('swoosh', 0.5),
    playHeartPickup: () => playSound('heart', 0.6)
  };
};
