
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { toast } = useToast();

  const enterFullscreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
        toast({
          title: "Fullscreen Mode Activated! 🎮",
          description: "Enjoy the immersive gaming experience!"
        });
      }
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
      toast({
        title: "Fullscreen Failed",
        description: "Your browser doesn't support fullscreen mode",
        variant: "destructive"
      });
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Failed to exit fullscreen:', error);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return {
    isFullscreen,
    enterFullscreen,
    exitFullscreen
  };
};
