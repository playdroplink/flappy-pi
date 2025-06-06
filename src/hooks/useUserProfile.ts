
import { useState, useEffect } from 'react';
import { gameBackendService, UserProfile } from '@/services/gameBackendService';
import { purchaseStateService, PurchaseState } from '@/services/purchaseStateService';
import { useToast } from '@/hooks/use-toast';

interface UseUserProfileReturn {
  profile: UserProfile | null;
  purchaseState: PurchaseState | null;
  loading: boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshPurchaseState: () => Promise<void>;
  initializeProfile: (piUserId: string, username: string) => Promise<void>;
  hasPremium: boolean;
  isAdFree: boolean;
  ownedSkins: string[];
}

export const useUserProfile = (): UseUserProfileReturn => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [purchaseState, setPurchaseState] = useState<PurchaseState | null>(null);
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

  const refreshPurchaseState = async () => {
    if (!profile?.pi_user_id) return;

    try {
      const state = await purchaseStateService.getPurchaseState(profile.pi_user_id);
      setPurchaseState(state);
      
      // Update localStorage for immediate UI feedback
      localStorage.setItem('flappypi-purchase-state', JSON.stringify(state));
    } catch (error) {
      console.error('Error refreshing purchase state:', error);
    }
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
        
        // Load purchase state
        await refreshPurchaseState();
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
        
        // Also refresh purchase state
        await refreshPurchaseState();
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
    const savedPurchaseState = localStorage.getItem('flappypi-purchase-state');
    
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        setProfile(parsedProfile);
        
        // Load cached purchase state if available
        if (savedPurchaseState) {
          try {
            const parsedPurchaseState = JSON.parse(savedPurchaseState);
            setPurchaseState(parsedPurchaseState);
          } catch (error) {
            console.error('Error parsing saved purchase state:', error);
          }
        }
        
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

  // Computed properties for easier access
  const hasPremium = purchaseState?.hasPremium || false;
  const isAdFree = purchaseState?.isAdFree || false;
  const ownedSkins = purchaseState?.ownedSkins || ['default'];

  return {
    profile,
    purchaseState,
    loading,
    updateProfile,
    refreshProfile,
    refreshPurchaseState,
    initializeProfile,
    hasPremium,
    isAdFree,
    ownedSkins
  };
};
