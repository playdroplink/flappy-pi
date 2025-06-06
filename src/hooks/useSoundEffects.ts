
import { useRef, useCallback } from 'react';

export const useSoundEffects = () => {
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  const initializeSound = useCallback((key: string, src: string) => {
    if (!audioRefs.current[key]) {
      audioRefs.current[key] = new Audio(src);
      audioRefs.current[key].preload = 'auto';
    }
  }, []);

  const playSound = useCallback((key: string, volume = 0.5) => {
    const audio = audioRefs.current[key];
    if (audio) {
      audio.currentTime = 0;
      audio.volume = volume;
      audio.play().catch(console.error);
    }
  }, []);

  // Initialize all game sounds
  const initializeGameSounds = useCallback(() => {
    initializeSound('wing', '/assets/audio/sfx_wing.wav');
    initializeSound('point', '/assets/audio/sfx_point.wav');
    initializeSound('hit', '/assets/audio/sfx_hit.wav');
    initializeSound('die', '/assets/audio/sfx_die.wav');
    initializeSound('swoosh', '/assets/audio/sfx_swooshing.wav');
  }, [initializeSound]);

  const playWingFlap = useCallback(() => playSound('wing', 0.3), [playSound]);
  const playPoint = useCallback(() => playSound('point', 0.5), [playSound]);
  const playHit = useCallback(() => playSound('hit', 0.7), [playSound]);
  const playDie = useCallback(() => playSound('die', 0.6), [playSound]);
  const playSwoosh = useCallback(() => playSound('swoosh', 0.4), [playSound]);

  return {
    initializeGameSounds,
    playWingFlap,
    playPoint,
    playHit,
    playDie,
    playSwoosh
  };
};
