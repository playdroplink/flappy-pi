import { useState, useEffect } from 'react';
import { gameBackendService, UserProfile } from '@/services/gameBackendService';
import { purchaseStateService, PurchaseState } from '@/services/purchaseStateService';
import { subscriptionService } from '@/services/subscriptionService';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseAuth } from './useSupabaseAuth';

interface UseUserProfileReturn {
  profile: UserProfile | null;
  purchaseState: PurchaseState | null;
  loading: boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshPurchaseState: () => Promise<void>;
  initializeProfile: (piUserId?: string, username?: string) => Promise<void>;
  hasPremium: boolean;
  isAdFree: boolean;
  ownedSkins: string[];
  hasActiveSubscription: boolean;
  subscriptionStatus: string;
  // Auth methods
  signInWithPi: () => Promise<boolean>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

export const useUserProfile = (): UseUserProfileReturn => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [purchaseState, setPurchaseState] = useState<PurchaseState | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user, session, loading: authLoading, signInWithPi, signOut } = useSupabaseAuth();

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
    if (!user?.id) return;

    try {
      const state = await purchaseStateService.getPurchaseState(user.id);
      setPurchaseState(state);
      
      // Update localStorage for immediate UI feedback
      localStorage.setItem('flappypi-purchase-state', JSON.stringify(state));
    } catch (error) {
      console.error('Error refreshing purchase state:', error);
    }
  };

  const checkSubscriptionExpiry = async () => {
    if (!user?.id) return;

    try {
      // Check if subscriptions need to be expired
      await subscriptionService.expireSubscriptions();
    } catch (error) {
      console.error('Error checking subscription expiry:', error);
    }
  };

  const initializeProfile = async (piUserId?: string, username?: string) => {
    // If user is not authenticated, don't initialize profile
    if (!user?.id) {
      console.log('No authenticated user, skipping profile initialization');
      return;
    }

    setLoading(true);
    try {
      // Use the authenticated user's ID and metadata
      const userId = user.id;
      const userUsername = user.user_metadata?.username || `Player_${userId.slice(0, 8)}`;
      
      // Try to get existing profile
      let existingProfile = await gameBackendService.getUserProfile(userId);
      
      if (!existingProfile) {
        // Create new profile
        const newProfile = {
          pi_user_id: userId,
          username: userUsername,
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
        
        // Load purchase state and check subscription expiry
        await Promise.all([
          refreshPurchaseState(),
          checkSubscriptionExpiry()
        ]);
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
    if (!profile || !user?.id) return;
    
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
    if (!profile || !user?.id) return;
    
    setLoading(true);
    try {
      const refreshedProfile = await gameBackendService.getUserProfile(profile.pi_user_id);
      if (refreshedProfile) {
        setProfile(refreshedProfile);
        localStorage.setItem('flappypi-profile', JSON.stringify(refreshedProfile));
        
        // Also refresh purchase state and check subscription expiry
        await Promise.all([
          refreshPurchaseState(),
          checkSubscriptionExpiry()
        ]);
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize profile when user authentication state changes
  useEffect(() => {
    if (user && !authLoading) {
      initializeProfile();
    } else if (!user && !authLoading) {
      // Clear profile when user signs out
      setProfile(null);
      setPurchaseState(null);
      localStorage.removeItem('flappypi-profile');
      localStorage.removeItem('flappypi-purchase-state');
    }
  }, [user, authLoading]);

  // Computed properties for easier access
  const hasPremium = purchaseState?.hasPremium || false;
  const isAdFree = purchaseState?.isAdFree || false;
  const ownedSkins = purchaseState?.ownedSkins || ['default'];
  
  // New subscription-related computed properties
  const hasActiveSubscription = profile?.subscription_status === 'active';
  const subscriptionStatus = profile?.subscription_status || 'none';

  return {
    profile,
    purchaseState,
    loading: loading || authLoading,
    updateProfile,
    refreshProfile,
    refreshPurchaseState,
    initializeProfile,
    hasPremium,
    isAdFree,
    ownedSkins,
    hasActiveSubscription,
    subscriptionStatus,
    // Auth methods
    signInWithPi,
    signOut,
    isAuthenticated: !!user
  };
};
