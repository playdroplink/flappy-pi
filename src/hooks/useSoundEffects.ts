
import { useRef, useCallback, useEffect } from 'react';

export const useSoundEffects = () => {
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  const isMuted = useRef<boolean>(false);
  const isInitialized = useRef<boolean>(false);

  const initializeSound = useCallback((key: string, basePath: string) => {
    if (!audioRefs.current[key]) {
      const audio = new Audio();
      
      // Try multiple formats for better compatibility
      const formats = ['wav', 'mp3', 'ogg'];
      let formatIndex = 0;

      const tryNextFormat = () => {
        if (formatIndex >= formats.length) {
          console.warn(`Failed to load sound: ${key}`);
          return;
        }

        const format = formats[formatIndex];
        audio.src = `${basePath}.${format}`;
        
        audio.addEventListener('loadeddata', () => {
          audio.preload = 'auto';
          audio.volume = 0.6;
          audioRefs.current[key] = audio;
          console.log(`Sound loaded: ${key} (${format})`);
        }, { once: true });

        audio.addEventListener('error', () => {
          console.log(`Format ${format} failed for ${key}, trying next...`);
          formatIndex++;
          tryNextFormat();
        }, { once: true });

        audio.load();
      };

      tryNextFormat();
    }
  }, []);

  const playSound = useCallback((key: string, volume = 0.6) => {
    if (isMuted.current) return;
    
    const audio = audioRefs.current[key];
    if (audio) {
      try {
        // Clone the audio for overlapping sounds
        const audioClone = audio.cloneNode() as HTMLAudioElement;
        audioClone.volume = volume;
        audioClone.currentTime = 0;
        
        const playPromise = audioClone.play();
        if (playPromise) {
          playPromise.catch(() => {
            // Ignore play errors - common on mobile without interaction
          });
        }
      } catch (error) {
        // Ignore sound errors to prevent crashes
      }
    }
  }, []);

  // Initialize all game sounds with correct paths and fallbacks
  const initializeGameSounds = useCallback(() => {
    if (isInitialized.current) return;
    
    console.log('Initializing enhanced game sounds...');
    
    // Initialize with multiple format fallbacks
    initializeSound('wing', '/assets/audio/sfx_wing');
    initializeSound('point', '/assets/audio/sfx_point');
    initializeSound('hit', '/assets/audio/sfx_hit');
    initializeSound('die', '/assets/audio/sfx_die');
    initializeSound('swoosh', '/assets/audio/sfx_swooshing');
    initializeSound('heart', '/assets/audio/sfx_heart');
    
    isInitialized.current = true;
  }, [initializeSound]);

  // Enable audio on first user interaction (required for mobile)
  const enableAudio = useCallback(() => {
    Object.values(audioRefs.current).forEach(audio => {
      if (audio.paused) {
        audio.play().then(() => {
          audio.pause();
          audio.currentTime = 0;
        }).catch(() => {
          // Ignore
        });
      }
    });
  }, []);

  useEffect(() => {
    const handleFirstInteraction = () => {
      enableAudio();
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('click', handleFirstInteraction);
    };

    document.addEventListener('touchstart', handleFirstInteraction, { once: true });
    document.addEventListener('click', handleFirstInteraction, { once: true });

    return () => {
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('click', handleFirstInteraction);
    };
  }, [enableAudio]);

  // Sound effect functions with appropriate volume levels
  const playWingFlap = useCallback(() => playSound('wing', 0.4), [playSound]);
  const playPoint = useCallback(() => playSound('point', 0.7), [playSound]);
  const playHit = useCallback(() => playSound('hit', 0.8), [playSound]);
  const playDie = useCallback(() => playSound('die', 0.7), [playSound]);
  const playSwoosh = useCallback(() => playSound('swoosh', 0.5), [playSound]);
  const playHeartPickup = useCallback(() => playSound('heart', 0.6), [playSound]);

  const toggleMute = useCallback(() => {
    isMuted.current = !isMuted.current;
    return isMuted.current;
  }, []);

  const setMuted = useCallback((muted: boolean) => {
    isMuted.current = muted;
  }, []);

  return {
    initializeGameSounds,
    playWingFlap,
    playPoint,
    playHit,
    playDie,
    playSwoosh,
    playHeartPickup,
    toggleMute,
    setMuted,
    isMuted: () => isMuted.current
  };
};
