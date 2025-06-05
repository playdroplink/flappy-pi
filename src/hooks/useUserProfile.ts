
import { useState, useEffect } from 'react';
import { gameBackendService, UserProfile } from '@/services/gameBackendService';
import { useToast } from '@/hooks/use-toast';

interface UseUserProfileReturn {
  profile: UserProfile | null;
  loading: boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  initializeProfile: (piUserId: string, username: string) => Promise<void>;
}

export const useUserProfile = (): UseUserProfileReturn => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Generate a mock Pi user ID for demo purposes
  const generateMockPiUser = () => {
    const usernames = ['PiFlyer', 'SkyMaster', 'BirdLegend', 'CloudChaser', 'WingCommander', 'PiExplorer'];
    const randomUsername = usernames[Math.floor(Math.random() * usernames.length)];
    const randomId = Math.random().toString(36).substr(2, 9);
    return {
      piUserId: `pi_user_${randomId}`,
      username: `${randomUsername}_${randomId.substr(0, 4)}`
    };
  };

  const initializeProfile = async (piUserId?: string, username?: string) => {
    setLoading(true);
    try {
      // Use provided credentials or generate mock ones
      const mockUser = piUserId && username ? { piUserId, username } : generateMockPiUser();
      
      // Try to get existing profile
      let existingProfile = await gameBackendService.getUserProfile(mockUser.piUserId);
      
      if (!existingProfile) {
        // Create new profile
        const newProfile = {
          pi_user_id: mockUser.piUserId,
          username: mockUser.username,
          total_coins: 0,
          selected_bird_skin: 'default',
          music_enabled: true
        };
        
        existingProfile = await gameBackendService.upsertUserProfile(newProfile);
      }
      
      setProfile(existingProfile);
      
      // Store in localStorage for persistence
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
    if (!profile) return;
    
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
    if (!profile) return;
    
    setLoading(true);
    try {
      const refreshedProfile = await gameBackendService.getUserProfile(profile.pi_user_id);
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

  // Load profile from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('flappypi-profile');
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        setProfile(parsedProfile);
        // Refresh from database in background
        refreshProfile();
      } catch (error) {
        console.error('Error parsing saved profile:', error);
        // Initialize new profile if saved data is corrupted
        initializeProfile();
      }
    } else {
      // No saved profile, initialize new one
      initializeProfile();
    }
  }, []);

  return {
    profile,
    loading,
    updateProfile,
    refreshProfile,
    initializeProfile
  };
};
