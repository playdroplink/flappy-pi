
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { piNetworkService } from '@/services/piNetworkService';
import { gameBackendService } from '@/services/gameBackendService';
import { useUserProfile } from '@/hooks/useUserProfile';

interface PaymentResult {
  success: boolean;
  paymentId?: string;
  error?: string;
}

export const usePiPayments = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const { profile, refreshProfile } = useUserProfile();

  const authenticateUser = async (): Promise<boolean> => {
    try {
      setIsProcessing(true);
      const user = await piNetworkService.authenticate();
      
      if (user) {
        setIsAuthenticated(true);
        toast({
          title: "Pi Authentication Successful! 🎉",
          description: `Welcome ${user.username}! You can now use Pi payments.`
        });
        return true;
      } else {
        toast({
          title: "Authentication Failed",
          description: "Could not authenticate with Pi Network",
          variant: "destructive"
        });
        return false;
      }
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
      
      const paymentId = await piNetworkService.createPayment(
        10, // 10 Pi for ad-free subscription
        "Flappy Pi - 1 Month Ad-Free Subscription",
        {
          item_type: 'subscription',
          item_id: 'ad_free_month',
          duration: '30_days'
        }
      );

      // Process payment through backend
      if (profile) {
        const result = await gameBackendService.makePurchase(
          profile.pi_user_id,
          'power_up',
          'ad_free_month',
          0, // Pi payments don't deduct coins
          paymentId
        );

        if (result.success) {
          await refreshProfile();
          toast({
            title: "Ad-Free Subscription Activated! 🎉",
            description: "Enjoy 30 days of ad-free gaming with Pi payment!"
          });
          return { success: true, paymentId };
        } else {
          toast({
            title: "Purchase Failed",
            description: result.error || "Could not process purchase",
            variant: "destructive"
          });
          return { success: false, error: result.error };
        }
      }

      return { success: false, error: 'User profile not available' };
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
      
      const paymentId = await piNetworkService.createPayment(
        price,
        `Flappy Pi - ${skinId} Bird Skin`,
        {
          item_type: 'bird_skin',
          item_id: skinId,
          category: 'bird_skin'
        }
      );

      // Process payment through backend
      if (profile) {
        const result = await gameBackendService.makePurchase(
          profile.pi_user_id,
          'bird_skin',
          skinId,
          0, // Pi payments don't deduct coins
          paymentId
        );

        if (result.success) {
          await refreshProfile();
          toast({
            title: "Bird Skin Purchased! 🐦",
            description: `You now own the ${skinId} bird skin!`
          });
          return { success: true, paymentId };
        } else {
          toast({
            title: "Purchase Failed",
            description: result.error || "Could not process purchase",
            variant: "destructive"
          });
          return { success: false, error: result.error };
        }
      }

      return { success: false, error: 'User profile not available' };
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
    authenticateUser,
    purchaseAdFreeSubscription,
    purchaseBirdSkin,
    shareScore
  };
};
