
import { useRef, useCallback, useEffect } from 'react';

export const useSoundEffects = () => {
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  const isMuted = useRef<boolean>(false);
  const isInitialized = useRef<boolean>(false);

  const initializeSound = useCallback((key: string, src: string) => {
    if (!audioRefs.current[key]) {
      const audio = new Audio(src);
      audio.preload = 'auto';
      audio.volume = 0.6;
      
      // Handle loading errors gracefully
      audio.addEventListener('error', () => {
        console.warn(`Failed to load sound: ${key}`);
      });
      
      audioRefs.current[key] = audio;
    }
  }, []);

  const playSound = useCallback((key: string, volume = 0.6) => {
    if (isMuted.current) return;
    
    const audio = audioRefs.current[key];
    if (audio) {
      try {
        audio.currentTime = 0;
        audio.volume = volume;
        const playPromise = audio.play();
        
        if (playPromise) {
          playPromise.catch(() => {
            // Ignore play errors - common on mobile
          });
        }
      } catch (error) {
        // Ignore sound errors
      }
    }
  }, []);

  // Initialize all game sounds with correct paths
  const initializeGameSounds = useCallback(() => {
    if (isInitialized.current) return;
    
    console.log('Initializing game sounds...');
    
    // Initialize with fallback sounds if main ones don't exist
    initializeSound('wing', '/assets/audio/sfx_wing.wav');
    initializeSound('point', '/assets/audio/sfx_point.wav');
    initializeSound('hit', '/assets/audio/sfx_hit.wav');
    initializeSound('die', '/assets/audio/sfx_die.wav');
    initializeSound('swoosh', '/assets/audio/sfx_swooshing.wav');
    initializeSound('heart', '/assets/audio/sfx_heart.wav'); // New heart pickup sound
    
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
