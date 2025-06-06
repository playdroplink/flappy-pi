import { useState, useEffect } from 'react';
import { gameBackendService, UserProfile } from '@/services/gameBackendService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

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
  const { user, session } = useAuth();

  const initializeProfile = async (piUserId?: string, username?: string) => {
    if (!user || !session) {
      console.log('No authenticated user, skipping profile initialization');
      return;
    }

    setLoading(true);
    try {
      const userId = user.id;
      const userDisplayName = username || user.user_metadata?.username || user.email?.split('@')[0] || 'Player';
      
      // Try to get existing profile
      let existingProfile = await gameBackendService.getUserProfile();
      
      if (!existingProfile) {
        // Create new profile
        const newProfile = {
          pi_user_id: userId,
          username: userDisplayName,
          total_coins: 0,
          selected_bird_skin: 'default',
          music_enabled: true
        };
        
        existingProfile = await gameBackendService.upsertUserProfile(newProfile);
      }
      
      setProfile(existingProfile);
      
      // Store in localStorage for quick access
      if (existingProfile) {
        localStorage.setItem('flappypi-profile', JSON.stringify(existingProfile));
      }
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
      const updatedProfile = await gameBackendService.upsertUserProfile({
        ...profile,
        ...updates
      });
      
      if (updatedProfile) {
        setProfile(updatedProfile);
        localStorage.setItem('flappypi-profile', JSON.stringify(updatedProfile));
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
      const refreshedProfile = await gameBackendService.getUserProfile();
      if (refreshedProfile) {
        setProfile(refreshedProfile);
        localStorage.setItem('flappypi-profile', JSON.stringify(refreshedProfile));
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize profile when user becomes available
  useEffect(() => {
    if (user && session && !profile) {
      // Try to load from localStorage first
      const savedProfile = localStorage.getItem('flappypi-profile');
      if (savedProfile) {
        try {
          const parsedProfile = JSON.parse(savedProfile);
          // Verify this profile belongs to the current user
          if (parsedProfile.pi_user_id === user.id) {
            setProfile(parsedProfile);
            // Refresh from database in background
            refreshProfile();
            return;
          }
        } catch (error) {
          console.error('Error parsing saved profile:', error);
        }
      }
      
      // Initialize new profile or load from database
      initializeProfile();
    } else if (!user) {
      // Clear profile when user logs out
      setProfile(null);
      localStorage.removeItem('flappypi-profile');
    }
  }, [user, session]);

  return {
    profile,
    loading,
    updateProfile,
    refreshProfile,
    initializeProfile
  };
};
