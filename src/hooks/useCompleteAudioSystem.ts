
import { useRef, useCallback, useState, useEffect } from 'react';

interface AudioSystem {
  playWingFlap: () => void;
  playPoint: () => void;
  playHit: () => void;
  playDie: () => void;
  playSwoosh: () => void;
  playHeartPickup: () => void;
  toggleBackgroundMusic: () => void;
  setMusicVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;
  isAudioUnlocked: boolean;
  isMusicPlaying: boolean;
  unlockAudio: () => void;
  initializeGameSounds: () => void;
}

export const useCompleteAudioSystem = (): AudioSystem => {
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  const backgroundMusic = useRef<HTMLAudioElement | null>(null);
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicVolume, setMusicVolumeState] = useState(0.3);
  const [sfxVolume, setSfxVolumeState] = useState(0.6);
  const isInitialized = useRef(false);

  // Production-ready audio initialization with comprehensive fallbacks
  const initializeGameSounds = useCallback(() => {
    if (isInitialized.current) return;
    
    console.log('🎵 Initializing production audio system...');
    
    // Sound effects with comprehensive fallback system
    const soundEffects = [
      { key: 'wing', path: '/sounds/sfx/wing' },
      { key: 'point', path: '/sounds/sfx/point' },
      { key: 'hit', path: '/sounds/sfx/hit' },
      { key: 'die', path: '/sounds/sfx/die' },
      { key: 'swoosh', path: '/sounds/sfx/swoosh' },
      { key: 'heart', path: '/sounds/sfx/heart' }
    ];

    soundEffects.forEach(({ key, path }) => {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.volume = sfxVolume;
      
      // Try multiple formats for maximum compatibility
      const formats = ['wav', 'mp3', 'ogg'];
      let formatIndex = 0;

      const tryNextFormat = () => {
        if (formatIndex >= formats.length) {
          console.warn(`⚠️ Failed to load sound: ${key} - creating silent fallback`);
          // Create working silent audio element
          audio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';
          audioRefs.current[key] = audio;
          return;
        }

        const format = formats[formatIndex];
        audio.src = `${path}.${format}`;
        
        audio.addEventListener('loadeddata', () => {
          audioRefs.current[key] = audio;
          console.log(`✅ Sound loaded: ${key} (${format})`);
        }, { once: true });

        audio.addEventListener('error', () => {
          console.log(`❌ Format ${format} failed for ${key}, trying next...`);
          formatIndex++;
          tryNextFormat();
        }, { once: true });

        // Set timeout to try next format if current takes too long
        setTimeout(() => {
          if (!audioRefs.current[key]) {
            formatIndex++;
            tryNextFormat();
          }
        }, 3000);

        audio.load();
      };

      tryNextFormat();
    });

    // Background music with fallback
    if (!backgroundMusic.current) {
      backgroundMusic.current = new Audio();
      backgroundMusic.current.loop = true;
      backgroundMusic.current.volume = musicVolume;
      
      const musicFormats = ['mp3', 'ogg', 'wav'];
      let musicFormatIndex = 0;

      const tryNextMusicFormat = () => {
        if (musicFormatIndex >= musicFormats.length) {
          console.warn('⚠️ Failed to load background music - creating silent fallback');
          backgroundMusic.current!.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';
          return;
        }

        const format = musicFormats[musicFormatIndex];
        backgroundMusic.current!.src = `/sounds/music/background.${format}`;
        
        backgroundMusic.current!.addEventListener('loadeddata', () => {
          console.log(`✅ Background music loaded (${format})`);
        }, { once: true });

        backgroundMusic.current!.addEventListener('error', () => {
          console.log(`❌ Music format ${format} failed, trying next...`);
          musicFormatIndex++;
          tryNextMusicFormat();
        }, { once: true });

        backgroundMusic.current!.load();
      };

      tryNextMusicFormat();
    }

    isInitialized.current = true;
  }, [sfxVolume, musicVolume]);

  // Mobile-optimized audio unlock
  const unlockAudio = useCallback(async () => {
    console.log('🔓 Attempting audio unlock for mobile...');
    
    try {
      // Create a short silent audio to unlock the audio context
      const silentAudio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=');
      silentAudio.volume = 0.1;
      
      await silentAudio.play();
      silentAudio.pause();
      
      setIsAudioUnlocked(true);
      console.log('✅ Audio successfully unlocked');
      
      // Try to unlock all existing audio elements
      Object.values(audioRefs.current).forEach(async (audio) => {
        try {
          if (audio.paused) {
            const originalVolume = audio.volume;
            audio.volume = 0.01;
            await audio.play();
            audio.pause();
            audio.currentTime = 0;
            audio.volume = originalVolume;
          }
        } catch (error) {
          // Ignore individual audio unlock failures
        }
      });
      
    } catch (error) {
      console.log('❌ Audio unlock failed:', error);
    }
  }, []);

  // Auto-unlock audio on first user interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!isAudioUnlocked) {
        unlockAudio();
      }
    };

    // Listen for multiple interaction types
    const events = ['touchstart', 'touchend', 'click', 'keydown'];
    events.forEach(event => {
      document.addEventListener(event, handleFirstInteraction, { once: true, passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleFirstInteraction);
      });
    };
  }, [unlockAudio, isAudioUnlocked]);

  // Safe audio playback with error handling
  const playSafeAudio = useCallback((key: string, volume = 0.6) => {
    try {
      const audio = audioRefs.current[key];
      if (audio && isAudioUnlocked) {
        // Clone for overlapping sounds
        const audioClone = audio.cloneNode() as HTMLAudioElement;
        audioClone.volume = Math.min(volume, 1);
        audioClone.currentTime = 0;
        
        const playPromise = audioClone.play();
        if (playPromise) {
          playPromise.catch((error) => {
            console.log(`🔇 Sound playback failed for ${key}:`, error.message);
          });
        }
      }
    } catch (error) {
      console.log(`🔇 Error playing sound ${key}:`, error);
    }
  }, [isAudioUnlocked]);

  // Background music controls
  const toggleBackgroundMusic = useCallback(() => {
    try {
      if (!backgroundMusic.current || !isAudioUnlocked) return;
      
      if (isMusicPlaying) {
        backgroundMusic.current.pause();
        setIsMusicPlaying(false);
      } else {
        const playPromise = backgroundMusic.current.play();
        if (playPromise) {
          playPromise.then(() => {
            setIsMusicPlaying(true);
          }).catch((error) => {
            console.log('🔇 Background music playback failed:', error.message);
          });
        }
      }
    } catch (error) {
      console.log('🔇 Error toggling background music:', error);
    }
  }, [isMusicPlaying, isAudioUnlocked]);

  const setMusicVolume = useCallback((volume: number) => {
    setMusicVolumeState(volume);
    if (backgroundMusic.current) {
      backgroundMusic.current.volume = volume;
    }
  }, []);

  const setSfxVolume = useCallback((volume: number) => {
    setSfxVolumeState(volume);
    Object.values(audioRefs.current).forEach(audio => {
      audio.volume = volume;
    });
  }, []);

  // Production-ready sound effect functions
  const playWingFlap = useCallback(() => playSafeAudio('wing', 0.4), [playSafeAudio]);
  const playPoint = useCallback(() => playSafeAudio('point', 0.7), [playSafeAudio]);
  const playHit = useCallback(() => playSafeAudio('hit', 0.8), [playSafeAudio]);
  const playDie = useCallback(() => playSafeAudio('die', 0.7), [playSafeAudio]);
  const playSwoosh = useCallback(() => playSafeAudio('swoosh', 0.5), [playSafeAudio]);
  const playHeartPickup = useCallback(() => playSafeAudio('heart', 0.6), [playSafeAudio]);

  return {
    initializeGameSounds,
    playWingFlap,
    playPoint,
    playHit,
    playDie,
    playSwoosh,
    playHeartPickup,
    toggleBackgroundMusic,
    setMusicVolume,
    setSfxVolume,
    isAudioUnlocked,
    isMusicPlaying,
    unlockAudio
  };
};
