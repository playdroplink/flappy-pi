
import { useState, useEffect } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';

export const useGameSettings = () => {
  const [selectedBirdSkin, setSelectedBirdSkin] = useState('default');
  const [musicEnabled, setMusicEnabled] = useState(true);
  const { profile, updateProfile } = useUserProfile();

  useEffect(() => {
    // Load saved data from localStorage (fallback)
    const savedSkin = localStorage.getItem('flappypi-skin');
    const savedMusic = localStorage.getItem('flappypi-music');
    
    if (savedSkin) setSelectedBirdSkin(savedSkin);
    if (savedMusic) setMusicEnabled(savedMusic === 'true');
  }, []);

  // Sync with user profile when available
  useEffect(() => {
    if (profile) {
      setSelectedBirdSkin(profile.selected_bird_skin);
      setMusicEnabled(profile.music_enabled);
      
      // Update localStorage to match profile
      localStorage.setItem('flappypi-skin', profile.selected_bird_skin);
      localStorage.setItem('flappypi-music', profile.music_enabled.toString());
    }
  }, [profile]);

  // Update bird skin and sync with backend
  const updateBirdSkin = async (skin: string) => {
    setSelectedBirdSkin(skin);
    localStorage.setItem('flappypi-skin', skin);
    
    // Update in backend if profile exists
    if (profile) {
      await updateProfile({ selected_bird_skin: skin });
    }
  };

  // Update music setting and sync with backend
  const updateMusicEnabled = async (enabled: boolean) => {
    setMusicEnabled(enabled);
    localStorage.setItem('flappypi-music', enabled.toString());
    
    // Update in backend if profile exists
    if (profile) {
      await updateProfile({ music_enabled: enabled });
    }
  };

  return {
    selectedBirdSkin,
    musicEnabled,
    setSelectedBirdSkin: updateBirdSkin,
    setMusicEnabled: updateMusicEnabled
  };
};
