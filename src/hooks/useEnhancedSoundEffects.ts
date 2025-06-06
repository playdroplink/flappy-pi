import { useAudioManager } from './useAudioManager';

interface UseEnhancedSoundEffectsProps {
  musicEnabled: boolean;
  gameState: 'menu' | 'playing' | 'gameOver' | 'paused';
}

export const useEnhancedSoundEffects = ({ 
  musicEnabled, 
  gameState 
}: UseEnhancedSoundEffectsProps) => {
  const audioManager = useAudioManager({ musicEnabled, gameState });

  return {
    ...audioManager,
    // Keep the same interface as the original hook
    initializeGameSounds: () => {
      console.log('Enhanced sound system initialized');
    },
    toggleMute: () => {
      // This could be enhanced to actually mute all sounds
      console.log('Toggle mute (enhanced version)');
      return false;
    },
    setMuted: (muted: boolean) => {
      console.log('Set muted:', muted);
    },
    isMuted: () => false
  };
};
