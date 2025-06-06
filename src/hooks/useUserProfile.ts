
import { useState, useEffect } from 'react';
import { gameBackendService, UserProfile } from '@/services/gameBackendService';
import { useToast } from '@/hooks/use-toast';
import { usePiAuth } from '@/hooks/usePiAuth';

interface UseUserProfileReturn {
  profile: UserProfile | null;
  loading: boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  initializeProfile: (piUserId?: string, username?: string) => Promise<void>;
}

export const useUserProfile = (): UseUserProfileReturn => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = usePiAuth(); // Use Pi auth instead of Supabase auth

  const initializeProfile = async (piUserId?: string, username?: string) => {
    if (!user) {
      console.log('No authenticated Pi user, skipping profile initialization');
      return;
    }

    setLoading(true);
    try {
      const userId = piUserId || user.uid;
      const userDisplayName = username || user.username || 'Player';
      
      // Try to get existing profile - Note: This might not work without proper backend
      // For now, we'll create a mock profile based on Pi user data
      let existingProfile: UserProfile = {
        pi_user_id: userId,
        username: userDisplayName,
        total_coins: parseInt(localStorage.getItem('flappypi-coins') || '0'),
        selected_bird_skin: localStorage.getItem('flappypi-skin') || 'default',
        music_enabled: localStorage.getItem('flappypi-music') !== 'false'
      };
      
      setProfile(existingProfile);
      
      // Store in localStorage for quick access
      localStorage.setItem('flappypi-profile', JSON.stringify(existingProfile));
    } catch (error) {
      console.error('Error initializing profile:', error);
      toast({
        title: "Profile Error",
        description: "Failed to initialize user profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile || !user) return;
    
    setLoading(true);
    try {
      // Update the local profile
      const updatedProfile = { ...profile, ...updates };
      setProfile(updatedProfile);
      localStorage.setItem('flappypi-profile', JSON.stringify(updatedProfile));
      
      // Also update individual localStorage items for backward compatibility
      if (updates.total_coins !== undefined) {
        localStorage.setItem('flappypi-coins', updates.total_coins.toString());
      }
      if (updates.selected_bird_skin !== undefined) {
        localStorage.setItem('flappypi-skin', updates.selected_bird_skin);
      }
      if (updates.music_enabled !== undefined) {
        localStorage.setItem('flappypi-music', updates.music_enabled.toString());
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // For now, just reload from localStorage
      const savedProfile = localStorage.getItem('flappypi-profile');
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        if (parsedProfile.pi_user_id === user.uid) {
          setProfile(parsedProfile);
        }
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize profile when Pi user becomes available
  useEffect(() => {
    if (user && !profile) {
      // Try to load from localStorage first
      const savedProfile = localStorage.getItem('flappypi-profile');
      if (savedProfile) {
        try {
          const parsedProfile = JSON.parse(savedProfile);
          // Verify this profile belongs to the current user
          if (parsedProfile.pi_user_id === user.uid) {
            setProfile(parsedProfile);
            return;
          }
        } catch (error) {
          console.error('Error parsing saved profile:', error);
        }
      }
      
      // Initialize new profile
      initializeProfile();
    } else if (!user) {
      // Clear profile when user logs out
      setProfile(null);
      localStorage.removeItem('flappypi-profile');
    }
  }, [user]);

  return {
    profile,
    loading,
    updateProfile,
    refreshProfile,
    initializeProfile
  };
};
