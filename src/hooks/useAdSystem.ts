
import { useState, useEffect } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useToast } from '@/hooks/use-toast';
import { gameBackendService } from '@/services/gameBackendService';
import { usePiPayments } from '@/hooks/usePiPayments';

interface AdSystemState {
  gameCount: number;
  adFreeUntil: string | null;
  showMandatoryAd: boolean;
  canContinueWithoutAd: boolean;
}

export const useAdSystem = () => {
  const [adSystemState, setAdSystemState] = useState<AdSystemState>({
    gameCount: 0,
    adFreeUntil: null,
    showMandatoryAd: false,
    canContinueWithoutAd: false
  });
  const { profile, updateProfile } = useUserProfile();
  const { toast } = useToast();
  const { purchaseAdFreeSubscription } = usePiPayments();

  // Load ad system state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('flappypi-ad-system');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        setAdSystemState(parsedState);
      } catch (error) {
        console.error('Error parsing ad system state:', error);
      }
    }
  }, []);

  // Save ad system state to localStorage
  const saveAdSystemState = (newState: AdSystemState) => {
    setAdSystemState(newState);
    localStorage.setItem('flappypi-ad-system', JSON.stringify(newState));
  };

  // Check if user has ad-free subscription
  const isAdFree = () => {
    if (!adSystemState.adFreeUntil) return false;
    return new Date() < new Date(adSystemState.adFreeUntil);
  };

  // Increment game count and check for mandatory ads
  const incrementGameCount = () => {
    if (isAdFree()) return;

    const newGameCount = adSystemState.gameCount + 1;
    const showMandatoryAd = newGameCount % 2 === 0; // Show ad every 2 games

    saveAdSystemState({
      ...adSystemState,
      gameCount: newGameCount,
      showMandatoryAd,
      canContinueWithoutAd: isAdFree()
    });
  };

  // Reset game count after ad is watched
  const resetAdCounter = () => {
    saveAdSystemState({
      ...adSystemState,
      showMandatoryAd: false
    });
  };

  // Purchase ad-free subscription using Pi Network
  const purchaseAdFreeWithPi = async (): Promise<boolean> => {
    try {
      const result = await purchaseAdFreeSubscription();
      
      if (result.success) {
        // Set ad-free period for 1 month
        const adFreeUntil = new Date();
        adFreeUntil.setMonth(adFreeUntil.getMonth() + 1);
        
        saveAdSystemState({
          ...adSystemState,
          adFreeUntil: adFreeUntil.toISOString(),
          showMandatoryAd: false,
          canContinueWithoutAd: true
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Pi payment failed:', error);
      return false;
    }
  };

  // Legacy coin-based purchase (fallback)
  const purchaseAdFree = async (): Promise<boolean> => {
    if (!profile) {
      toast({
        title: "Error",
        description: "User profile not available",
        variant: "destructive"
      });
      return false;
    }

    try {
      console.log('Initiating coin-based ad-free subscription - 500 coins');
      
      const result = await gameBackendService.makePurchase(
        profile.pi_user_id,
        'power_up',
        'ad_free_month',
        500, // 500 coins for ad-free month
        `coin_tx_adfree_${Date.now()}`
      );

      if (result.success) {
        // Set ad-free period for 1 month
        const adFreeUntil = new Date();
        adFreeUntil.setMonth(adFreeUntil.getMonth() + 1);
        
        saveAdSystemState({
          ...adSystemState,
          adFreeUntil: adFreeUntil.toISOString(),
          showMandatoryAd: false,
          canContinueWithoutAd: true
        });
        
        toast({
          title: "Ad-Free Subscription Activated! 🎉",
          description: "No ads for 1 month with coin payment!"
        });
        
        return true;
      } else {
        toast({
          title: "Purchase Failed",
          description: result.error || "Failed to purchase ad-free subscription",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Error processing coin payment:', error);
      toast({
        title: "Payment Error",
        description: "Failed to process coin payment",
        variant: "destructive"
      });
      return false;
    }
  };

  // Check if user should see mandatory ad on game over
  const shouldShowMandatoryAd = () => {
    return adSystemState.showMandatoryAd && !isAdFree();
  };

  // Check if user can continue without watching ad (ad-free subscription)
  const canContinueWithoutAd = () => {
    return isAdFree();
  };

  // Get ad-free time remaining
  const getAdFreeTimeRemaining = () => {
    if (!adSystemState.adFreeUntil) return null;
    
    const remaining = new Date(adSystemState.adFreeUntil).getTime() - new Date().getTime();
    if (remaining <= 0) return null;
    
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return { days, hours };
  };

  return {
    gameCount: adSystemState.gameCount,
    isAdFree: isAdFree(),
    shouldShowMandatoryAd: shouldShowMandatoryAd(),
    canContinueWithoutAd: canContinueWithoutAd(),
    adFreeTimeRemaining: getAdFreeTimeRemaining(),
    incrementGameCount,
    resetAdCounter,
    purchaseAdFree,
    purchaseAdFreeWithPi
  };
};
