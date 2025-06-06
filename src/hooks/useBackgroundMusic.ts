
import { useEffect, useRef } from 'react';

export const useBackgroundMusic = (musicEnabled: boolean) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/sounds/background/Flappy Pi Main Theme Song.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
    }

    const audio = audioRef.current;

    if (musicEnabled) {
      audio.play().catch(error => {
        console.log('Audio play failed:', error);
      });
    } else {
      audio.pause();
    }

    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, [musicEnabled]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
};
