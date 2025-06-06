import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { piNetworkService } from '@/services/piNetworkService';
import { gameBackendService } from '@/services/gameBackendService';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

interface PaymentResult {
  success: boolean;
  paymentId?: string;
  error?: string;
}

export const usePiPayments = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPiAvailable, setIsPiAvailable] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated, signInWithPi } = useSupabaseAuth();

  // Check if Pi is available on this platform
  useEffect(() => {
    const checkPiAvailability = async () => {
      try {
        await piNetworkService.initialize();
        setIsPiAvailable(true);
      } catch (error) {
        console.error('Pi SDK not available:', error);
        setIsPiAvailable(false);
      }
    };
    
    checkPiAvailability();
  }, []);

  const authenticateUser = async (): Promise<boolean> => {
    if (isAuthenticated) {
      return true;
    }

    try {
      setIsProcessing(true);
      
      if (!isPiAvailable) {
        toast({
          title: "Pi Network Unavailable",
          description: "Pi Network is not available on this platform or browser.",
          variant: "destructive"
        });
        return false;
      }
      
      const success = await signInWithPi();
      return success;
    } catch (error) {
      console.error('Pi authentication error:', error);
      toast({
        title: "Authentication Error",
        description: "Failed to connect to Pi Network",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const purchaseAdFreeSubscription = async (): Promise<PaymentResult> => {
    if (!isAuthenticated) {
      const authSuccess = await authenticateUser();
      if (!authSuccess) {
        return { success: false, error: 'Authentication required' };
      }
    }

    try {
      setIsProcessing(true);
      
      const paymentId = await piNetworkService.purchasePremiumSubscription();

      // Update local storage for immediate UI feedback
      const adFreeUntil = new Date();
      adFreeUntil.setMonth(adFreeUntil.getMonth() + 1);
      
      localStorage.setItem('flappypi-ad-free', JSON.stringify({
        active: true,
        expiresAt: adFreeUntil.toISOString(),
        paymentId
      }));
      
      toast({
        title: "Premium Subscription Activated! 🎉",
        description: "Enjoy 30 days of ad-free gaming with Pi payment!"
      });
      
      return { success: true, paymentId };
    } catch (error) {
      console.error('Pi payment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      return { success: false, error: errorMessage };
    } finally {
      setIsProcessing(false);
    }
  };

  const purchaseBirdSkin = async (skinId: string, price: number): Promise<PaymentResult> => {
    if (!isAuthenticated) {
      const authSuccess = await authenticateUser();
      if (!authSuccess) {
        return { success: false, error: 'Authentication required' };
      }
    }

    try {
      setIsProcessing(true);
      
      const paymentId = await piNetworkService.purchaseBirdSkin(skinId, `${skinId} Bird Skin`);

      // Update local storage for immediate UI feedback
      const ownedSkins = JSON.parse(localStorage.getItem('flappypi-owned-skins') || '["default"]');
      if (!ownedSkins.includes(skinId)) {
        ownedSkins.push(skinId);
        localStorage.setItem('flappypi-owned-skins', JSON.stringify(ownedSkins));
      }
      
      toast({
        title: "Bird Skin Purchased! 🐦",
        description: `You now own the ${skinId} bird skin!`
      });
      
      return { success: true, paymentId };
    } catch (error) {
      console.error('Pi payment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      return { success: false, error: errorMessage };
    } finally {
      setIsProcessing(false);
    }
  };

  const purchaseAdRemoval = async (): Promise<PaymentResult> => {
    if (!isAuthenticated) {
      const authSuccess = await authenticateUser();
      if (!authSuccess) {
        return { success: false, error: 'Authentication required' };
      }
    }

    try {
      setIsProcessing(true);
      
      const paymentId = await piNetworkService.purchaseAdRemoval();

      // Update local storage for immediate UI feedback
      localStorage.setItem('flappypi-ad-free-permanent', JSON.stringify({
        active: true,
        paymentId,
        purchasedAt: new Date().toISOString()
      }));
      
      toast({
        title: "Ads Removed Forever! 🎉",
        description: "You will never see ads again in Flappy Pi!"
      });
      
      return { success: true, paymentId };
    } catch (error) {
      console.error('Pi payment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      return { success: false, error: errorMessage };
    } finally {
      setIsProcessing(false);
    }
  };

  const shareScore = (score: number, level: number): void => {
    piNetworkService.shareScore(score, level);
  };

  return {
    isProcessing,
    isAuthenticated,
    isPiAvailable,
    authenticateUser,
    purchaseAdFreeSubscription,
    purchaseBirdSkin,
    purchaseAdRemoval,
    shareScore
  };
};
