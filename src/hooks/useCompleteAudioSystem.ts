
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
}

export const useCompleteAudioSystem = (): AudioSystem => {
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  const backgroundMusic = useRef<HTMLAudioElement | null>(null);
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicVolume, setMusicVolumeState] = useState(0.3);
  const [sfxVolume, setSfxVolumeState] = useState(0.6);

  // Initialize all audio files
  const initializeAudio = useCallback(() => {
    console.log('🎵 Initializing complete audio system...');
    
    // Sound effects with multiple format fallbacks
    const soundEffects = [
      { key: 'wing', path: '/assets/audio/sfx_wing' },
      { key: 'point', path: '/assets/audio/sfx_point' },
      { key: 'hit', path: '/assets/audio/sfx_hit' },
      { key: 'die', path: '/assets/audio/sfx_die' },
      { key: 'swoosh', path: '/assets/audio/sfx_swooshing' },
      { key: 'heart', path: '/assets/audio/sfx_heart' }
    ];

    soundEffects.forEach(({ key, path }) => {
      const audio = new Audio();
      const formats = ['wav', 'mp3', 'ogg'];
      let formatIndex = 0;

      const tryNextFormat = () => {
        if (formatIndex >= formats.length) {
          console.warn(`Failed to load sound: ${key}`);
          return;
        }

        const format = formats[formatIndex];
        audio.src = `${path}.${format}`;
        
        audio.addEventListener('loadeddata', () => {
          audio.preload = 'auto';
          audio.volume = sfxVolume;
          audioRefs.current[key] = audio;
          console.log(`✅ Sound loaded: ${key} (${format})`);
        }, { once: true });

        audio.addEventListener('error', () => {
          console.log(`❌ Format ${format} failed for ${key}, trying next...`);
          formatIndex++;
          tryNextFormat();
        }, { once: true });

        audio.load();
      };

      tryNextFormat();
    });

    // Background music
    if (!backgroundMusic.current) {
      backgroundMusic.current = new Audio();
      const musicFormats = ['mp3', 'ogg'];
      let musicFormatIndex = 0;

      const tryNextMusicFormat = () => {
        if (musicFormatIndex >= musicFormats.length) {
          console.warn('Failed to load background music');
          return;
        }

        const format = musicFormats[musicFormatIndex];
        backgroundMusic.current!.src = `/sounds/background/Flappy Pi Main Theme Song.${format}`;
        
        backgroundMusic.current!.addEventListener('loadeddata', () => {
          backgroundMusic.current!.loop = true;
          backgroundMusic.current!.volume = musicVolume;
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
  }, [musicVolume, sfxVolume]);

  // Audio unlock function
  const unlockAudio = useCallback(() => {
    if (isAudioUnlocked) return;

    console.log('🔓 Attempting to unlock audio...');
    
    // Create and play silent audio to unlock
    const silentAudio = new Audio();
    silentAudio.src = 'data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAABOW';
    silentAudio.volume = 0.01;
    
    const playPromise = silentAudio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        silentAudio.pause();
        silentAudio.currentTime = 0;
        setIsAudioUnlocked(true);
        console.log('✅ Audio unlocked successfully');
        
        // Start background music if enabled
        const musicEnabled = localStorage.getItem('flappypi-music') !== 'false';
        if (musicEnabled && backgroundMusic.current) {
          const musicPlayPromise = backgroundMusic.current.play();
          if (musicPlayPromise !== undefined) {
            musicPlayPromise.then(() => {
              setIsMusicPlaying(true);
              console.log('🎵 Background music started');
            }).catch(error => {
              console.log('Background music failed to start:', error);
            });
          }
        }
      }).catch(error => {
        console.log('Audio unlock failed:', error);
      });
    }
  }, [isAudioUnlocked]);

  // Play sound effect
  const playSound = useCallback((key: string, customVolume?: number) => {
    if (!isAudioUnlocked) {
      console.log('Audio not unlocked, attempting unlock...');
      unlockAudio();
      return;
    }

    const audio = audioRefs.current[key];
    if (!audio) {
      console.warn(`Sound not found: ${key}`);
      return;
    }

    try {
      const audioClone = audio.cloneNode() as HTMLAudioElement;
      audioClone.volume = customVolume !== undefined ? customVolume : sfxVolume;
      audioClone.currentTime = 0;
      
      const playPromise = audioClone.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log(`Failed to play sound: ${key}`, error);
        });
      }
    } catch (error) {
      console.warn(`Error playing sound ${key}:`, error);
    }
  }, [isAudioUnlocked, sfxVolume, unlockAudio]);

  // Background music controls
  const toggleBackgroundMusic = useCallback(() => {
    if (!backgroundMusic.current || !isAudioUnlocked) return;

    if (isMusicPlaying) {
      backgroundMusic.current.pause();
      setIsMusicPlaying(false);
      localStorage.setItem('flappypi-music', 'false');
      console.log('🔇 Background music paused');
    } else {
      const playPromise = backgroundMusic.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsMusicPlaying(true);
          localStorage.setItem('flappypi-music', 'true');
          console.log('🎵 Background music resumed');
        }).catch(error => {
          console.log('Failed to resume background music:', error);
        });
      }
    }
  }, [isMusicPlaying, isAudioUnlocked]);

  const setMusicVolume = useCallback((volume: number) => {
    setMusicVolumeState(volume);
    if (backgroundMusic.current) {
      backgroundMusic.current.volume = volume;
    }
    localStorage.setItem('flappypi-music-volume', volume.toString());
  }, []);

  const setSfxVolume = useCallback((volume: number) => {
    setSfxVolumeState(volume);
    Object.values(audioRefs.current).forEach(audio => {
      audio.volume = volume;
    });
    localStorage.setItem('flappypi-sfx-volume', volume.toString());
  }, []);

  // Initialize audio system
  useEffect(() => {
    initializeAudio();
    
    // Load saved volume settings
    const savedMusicVolume = localStorage.getItem('flappypi-music-volume');
    const savedSfxVolume = localStorage.getItem('flappypi-sfx-volume');
    
    if (savedMusicVolume) {
      setMusicVolume(parseFloat(savedMusicVolume));
    }
    if (savedSfxVolume) {
      setSfxVolume(parseFloat(savedSfxVolume));
    }

    // Add event listeners for user interaction
    const handleFirstInteraction = () => {
      unlockAudio();
    };

    document.addEventListener('touchstart', handleFirstInteraction, { once: true });
    document.addEventListener('click', handleFirstInteraction, { once: true });
    document.addEventListener('keydown', handleFirstInteraction, { once: true });

    return () => {
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [initializeAudio, unlockAudio, setMusicVolume, setSfxVolume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      if (backgroundMusic.current) {
        backgroundMusic.current.pause();
        backgroundMusic.current.src = '';
      }
    };
  }, []);

  return {
    playWingFlap: () => playSound('wing', 0.4),
    playPoint: () => playSound('point', 0.7),
    playHit: () => playSound('hit', 0.8),
    playDie: () => playSound('die', 0.7),
    playSwoosh: () => playSound('swoosh', 0.5),
    playHeartPickup: () => playSound('heart', 0.6),
    toggleBackgroundMusic,
    setMusicVolume,
    setSfxVolume,
    isAudioUnlocked,
    isMusicPlaying,
    unlockAudio
  };
};
