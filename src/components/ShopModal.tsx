
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ShopHeader from './shop/ShopHeader';
import ShopInfoSection from './shop/ShopInfoSection';
import { Crown } from 'lucide-react';
import { gameBackendService } from '@/services/gameBackendService';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAdSystem } from '@/hooks/useAdSystem';
import { useToast } from '@/hooks/use-toast';
import { useShopSubscriptions } from '@/hooks/useShopSubscriptions';
import EliteSubscriptionSection from './shop/EliteSubscriptionSection';
import AllSkinsSubscriptionSection from './shop/AllSkinsSubscriptionSection';
import AdFreeSubscriptionSection from './shop/AdFreeSubscriptionSection';
import BirdCharactersSection from './shop/BirdCharactersSection';

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  coins: number;
  setCoins: (coins: number) => void;
  selectedBirdSkin: string;
  setSelectedBirdSkin: (skin: string) => void;
}

const ShopModal: React.FC<ShopModalProps> = ({
  isOpen,
  onClose,
  coins,
  setCoins,
  selectedBirdSkin,
  setSelectedBirdSkin
}) => {
  const { profile, refreshProfile } = useUserProfile();
  const { toast } = useToast();
  const adSystem = useAdSystem();
  const { allSkinsSubscription, eliteSubscription, checkSubscriptions } = useShopSubscriptions();

  // Check for subscriptions status
  useEffect(() => {
    if (isOpen) {
      checkSubscriptions();
    }
  }, [isOpen, checkSubscriptions]);

  const birdSkins = [
    { 
      id: 'default', 
      name: 'Blue Buddy', 
      piPrice: 0,
      coinPrice: 0,
      priceType: 'free' as const,
      image: '/lovable-uploads/8ad9f53d-d0aa-4231-9042-d1890a6f997f.png',
      owned: true 
    },
    { 
      id: 'green', 
      name: 'Emerald Flyer', 
      piPrice: 10,
      coinPrice: 10000,
      priceType: 'premium' as const,
      image: '/lovable-uploads/b2ccab90-dff7-4e09-9564-3cdd075c6793.png',
      owned: false 
    },
    { 
      id: 'red', 
      name: 'Ruby Racer', 
      piPrice: 10,
      coinPrice: 10000,
      priceType: 'premium' as const,
      image: '/lovable-uploads/3a780914-6faf-4deb-81ab-ce1f4b059984.png',
      owned: false 
    },
    { 
      id: 'elite-violet', 
      name: 'Elite Violet Champion', 
      piPrice: 0,
      coinPrice: 0,
      priceType: 'elite' as const,
      image: '/lovable-uploads/d139217c-21c4-42bd-ba26-18c96c98f9b1.png',
      owned: false,
      eliteOnly: true
    },
    { 
      id: 'elite-eagle', 
      name: 'Elite Eagle Warrior', 
      piPrice: 0,
      coinPrice: 0,
      priceType: 'elite' as const,
      image: '/lovable-uploads/9acde8f5-e27f-412c-9e12-d5f8a64c4ef2.png',
      owned: false,
      eliteOnly: true
    },
    { 
      id: 'elite-royal', 
      name: 'Elite Royal Guardian', 
      piPrice: 0,
      coinPrice: 0,
      priceType: 'elite' as const,
      image: '/lovable-uploads/9553da41-d31b-473b-9951-87e3a0e5987c.png',
      owned: false,
      eliteOnly: true
    },
  ];

  const handleAllSkinsSubscription = async () => {
    try {
      console.log('Purchasing All Skins Subscription - 15 Pi for 30 days');
      
      setTimeout(async () => {
        try {
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + 30);
          
          const subscriptionData = {
            isActive: true,
            expiresAt: expiryDate.toISOString(),
            purchasedAt: new Date().toISOString()
          };
          
          localStorage.setItem('flappypi-all-skins-subscription', JSON.stringify(subscriptionData));
          
          const daysRemaining = 30;
          checkSubscriptions();
          
          await refreshProfile();
          
          toast({
            title: "All Skins Unlocked! ✨",
            description: "You now have access to all standard bird skins for 30 days!"
          });
        } catch (error) {
          console.error('Error processing All Skins subscription:', error);
          toast({
            title: "Purchase Failed",
            description: "Failed to process All Skins subscription",
            variant: "destructive"
          });
        }
      }, 1500);
      
    } catch (error) {
      console.error('All Skins subscription failed:', error);
      toast({
        title: "Purchase Failed",
        description: "All Skins subscription could not be processed",
        variant: "destructive"
      });
    }
  };

  const handleEliteSubscription = async () => {
    try {
      console.log('Purchasing Elite Pack - 20 Pi per month');
      
      setTimeout(async () => {
        try {
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + 30);
          
          const subscriptionData = {
            isActive: true,
            expiresAt: expiryDate.toISOString(),
            purchasedAt: new Date().toISOString()
          };
          
          localStorage.setItem('flappypi-elite-subscription', JSON.stringify(subscriptionData));
          localStorage.setItem('flappypi-elite-badge', 'true');
          
          checkSubscriptions();
          
          await refreshProfile();
          
          toast({
            title: "Elite Pack Activated! 👑",
            description: "You're now an Elite member with exclusive skins and badge!"
          });
        } catch (error) {
          console.error('Error processing Elite subscription:', error);
          toast({
            title: "Purchase Failed",
            description: "Failed to process Elite subscription",
            variant: "destructive"
          });
        }
      }, 1500);
      
    } catch (error) {
      console.error('Elite subscription failed:', error);
      toast({
        title: "Purchase Failed",
        description: "Elite subscription could not be processed",
        variant: "destructive"
      });
    }
  };

  const handlePiPayment = async (skin: any) => {
    if (!profile) {
      toast({
        title: "Error",
        description: "User profile not available",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log(`Initiating Pi payment for ${skin.name} - ${skin.piPrice} Pi`);
      
      setTimeout(async () => {
        try {
          const result = await gameBackendService.makePurchase(
            profile.pi_user_id,
            'bird_skin',
            skin.id,
            0,
            `pi_tx_${Date.now()}`
          );

          if (result.success) {
            setSelectedBirdSkin(skin.id);
            localStorage.setItem('flappypi-skin', skin.id);
            
            const ownedSkins = JSON.parse(localStorage.getItem('flappypi-owned-skins') || '["default"]');
            if (!ownedSkins.includes(skin.id)) {
              ownedSkins.push(skin.id);
              localStorage.setItem('flappypi-owned-skins', JSON.stringify(ownedSkins));
            }
            
            await refreshProfile();
            
            toast({
              title: "Purchase Successful! 🎉",
              description: `Successfully purchased ${skin.name} with Pi!`
            });
          } else {
            toast({
              title: "Purchase Failed",
              description: result.error || "Failed to complete Pi purchase",
              variant: "destructive"
            });
          }
        } catch (error) {
          console.error('Error processing Pi payment:', error);
          toast({
            title: "Payment Error",
            description: "Failed to process Pi payment",
            variant: "destructive"
          });
        }
      }, 1500);
      
    } catch (error) {
      console.error('Pi payment failed:', error);
      toast({
        title: "Payment Failed",
        description: "Pi payment could not be processed",
        variant: "destructive"
      });
    }
  };

  const handleCoinPurchase = async (skin: any) => {
    if (!profile) {
      toast({
        title: "Error",
        description: "User profile not available",
        variant: "destructive"
      });
      return;
    }

    if (coins >= skin.coinPrice) {
      try {
        const result = await gameBackendService.makePurchase(
          profile.pi_user_id,
          'bird_skin',
          skin.id,
          skin.coinPrice
        );

        if (result.success) {
          setCoins(result.remaining_coins || 0);
          localStorage.setItem('flappypi-coins', (result.remaining_coins || 0).toString());
          
          setSelectedBirdSkin(skin.id);
          localStorage.setItem('flappypi-skin', skin.id);
          
          const ownedSkins = JSON.parse(localStorage.getItem('flappypi-owned-skins') || '["default"]');
          if (!ownedSkins.includes(skin.id)) {
            ownedSkins.push(skin.id);
            localStorage.setItem('flappypi-owned-skins', JSON.stringify(ownedSkins));
          }
          
          await refreshProfile();
          
          toast({
            title: "Purchase Successful! 🎉",
            description: `Successfully purchased ${skin.name} with coins!`
          });
        } else {
          toast({
            title: "Purchase Failed",
            description: result.error || "Failed to complete purchase",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error making coin purchase:', error);
        toast({
          title: "Purchase Error",
          description: "Failed to process coin purchase",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Insufficient Coins",
        description: `You need ${skin.coinPrice - coins} more coins.`,
        variant: "destructive"
      });
    }
  };

  const isOwned = (skinId: string) => {
    // Check if user has elite subscription for elite skins
    const skin = birdSkins.find(s => s.id === skinId);
    if (skin?.eliteOnly && eliteSubscription.isActive) {
      return true;
    }
    
    // Check if user has all skins subscription
    if (allSkinsSubscription.isActive || eliteSubscription.isActive) {
      return true;
    }
    
    const ownedSkins = JSON.parse(localStorage.getItem('flappypi-owned-skins') || '["default"]');
    return ownedSkins.includes(skinId);
  };

  const hasAnySubscription = allSkinsSubscription.isActive || eliteSubscription.isActive;

  const handlePurchaseAdFree = async () => {
    try {
      const success = await adSystem.purchaseAdFree();
      if (success) {
        toast({
          title: "Premium Activated! 💎",
          description: "You now have ad-free gaming for 30 days!"
        });
      }
    } catch (error) {
      console.error('Error purchasing ad-free subscription:', error);
      toast({
        title: "Purchase Failed",
        description: "Failed to process ad-free subscription",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-gray-300">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl text-gray-800 flex items-center justify-center space-x-2">
            <span>🛍️ Pi Shop</span>
            {eliteSubscription.isActive && (
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                <Crown className="h-3 w-3 mr-1" />
                ELITE
              </div>
            )}
          </DialogTitle>
          <ShopHeader coins={coins} />
        </DialogHeader>

        <div className="space-y-6">
          {/* Elite Pack Subscription Section */}
          <EliteSubscriptionSection 
            eliteSubscription={eliteSubscription}
            handleEliteSubscription={handleEliteSubscription}
          />

          {/* All Skins Subscription Section */}
          <AllSkinsSubscriptionSection 
            allSkinsSubscription={allSkinsSubscription}
            eliteSubscription={eliteSubscription}
            handleAllSkinsSubscription={handleAllSkinsSubscription}
          />

          {/* Pi Premium Subscription Section */}
          <AdFreeSubscriptionSection 
            adSystem={adSystem}
            handlePurchaseAdFree={handlePurchaseAdFree}
          />

          {/* Bird Characters Section */}
          <BirdCharactersSection 
            birdSkins={birdSkins}
            selectedBirdSkin={selectedBirdSkin}
            hasAnySubscription={hasAnySubscription}
            eliteSubscription={eliteSubscription}
            isOwned={isOwned}
            setSelectedBirdSkin={setSelectedBirdSkin}
            handlePiPayment={handlePiPayment}
            handleCoinPurchase={handleCoinPurchase}
            coins={coins}
          />

          <ShopInfoSection />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShopModal;
