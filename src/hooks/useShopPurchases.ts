
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { gameBackendService } from '@/services/gameBackendService';
import { useUserProfile } from '@/hooks/useUserProfile';
import { BIRD_SKINS, POWER_UPS } from '@/constants/shopData';

export const useShopPurchases = (coins: number, setCoins: (coins: number) => void) => {
  const [ownedSkins, setOwnedSkins] = useState<string[]>(['default']);
  const [ownedPowerUps, setOwnedPowerUps] = useState<string[]>([]);
  const { profile } = useUserProfile();

  const handleSkinPurchase = async (skinId: string, cost: number) => {
    if (coins < cost) {
      toast({
        title: "Not enough coins! 💸",
        description: `You need ${cost - coins} more coins. Watch an ad to earn some!`,
        variant: "destructive"
      });
      return;
    }

    if (!profile) {
      toast({
        title: "Error",
        description: "User profile not available",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await gameBackendService.makePurchase(
        profile.pi_user_id,
        "bird_skin",
        skinId
      );

      if (result.success) {
        setCoins(coins - cost);
        setOwnedSkins([...ownedSkins, skinId]);
        
        toast({
          title: "Purchase Successful! 🎉",
          description: `You've unlocked the ${BIRD_SKINS.find(s => s.id === skinId)?.name}!`
        });
      } else {
        toast({
          title: "Purchase Failed",
          description: result.error || "Failed to purchase skin",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Purchase error:', error);
      toast({
        title: "Purchase Error",
        description: "Something went wrong with your purchase",
        variant: "destructive"
      });
    }
  };

  const handlePowerUpPurchase = async (powerUpId: string, cost: number) => {
    if (coins < cost) {
      toast({
        title: "Not enough coins! 💸",
        description: `You need ${cost - coins} more coins. Watch an ad to earn some!`,
        variant: "destructive"
      });
      return;
    }

    if (!profile) {
      toast({
        title: "Error",
        description: "User profile not available",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await gameBackendService.makePurchase(
        profile.pi_user_id,
        "power_up",
        powerUpId
      );

      if (result.success) {
        setCoins(coins - cost);
        setOwnedPowerUps([...ownedPowerUps, powerUpId]);
        
        toast({
          title: "Purchase Successful! ⚡",
          description: `You've unlocked the ${POWER_UPS.find(p => p.id === powerUpId)?.name}!`
        });
      } else {
        toast({
          title: "Purchase Failed",
          description: result.error || "Failed to purchase power-up",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Purchase error:', error);
      toast({
        title: "Purchase Error",
        description: "Something went wrong with your purchase",
        variant: "destructive"
      });
    }
  };

  return {
    ownedSkins,
    ownedPowerUps,
    handleSkinPurchase,
    handlePowerUpPurchase,
    setOwnedSkins,
    setOwnedPowerUps
  };
};
