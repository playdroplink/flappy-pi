
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ShopHeader from './shop/ShopHeader';
import ShopInfoSection from './shop/ShopInfoSection';
import { gameBackendService } from '@/services/gameBackendService';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useToast } from '@/hooks/use-toast';
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
      piPrice: 25,
      coinPrice: 25000,
      priceType: 'elite' as const,
      image: '/lovable-uploads/d139217c-21c4-42bd-ba26-18c96c98f9b1.png',
      owned: false,
      eliteOnly: false
    },
    { 
      id: 'elite-eagle', 
      name: 'Elite Eagle Warrior', 
      piPrice: 25,
      coinPrice: 25000,
      priceType: 'elite' as const,
      image: '/lovable-uploads/9acde8f5-e27f-412c-9e12-d5f8a64c4ef2.png',
      owned: false,
      eliteOnly: false
    },
    { 
      id: 'elite-royal', 
      name: 'Elite Royal Guardian', 
      piPrice: 30,
      coinPrice: 30000,
      priceType: 'elite' as const,
      image: '/lovable-uploads/9553da41-d31b-473b-9951-87e3a0e5987c.png',
      owned: false,
      eliteOnly: false
    },
  ];

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
      
      // Simulate Pi Network payment processing
      toast({
        title: "Processing Pi Payment",
        description: `Processing ${skin.piPrice} Pi payment for ${skin.name}...`
      });
      
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
              description: `Successfully purchased ${skin.name} with ${skin.piPrice} Pi!`
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
    const ownedSkins = JSON.parse(localStorage.getItem('flappypi-owned-skins') || '["default"]');
    return ownedSkins.includes(skinId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-gray-300">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl text-gray-800 flex items-center justify-center space-x-2">
            <span>🛍️ Pi Shop</span>
          </DialogTitle>
          <ShopHeader coins={coins} />
        </DialogHeader>

        <div className="space-y-6">
          {/* Subscription Plans Link */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-800">Pi Premium Packs</h3>
                <p className="text-sm text-gray-600">One-time purchases with instant rewards</p>
              </div>
              <Button
                onClick={() => {
                  onClose();
                  window.location.href = '/subscription-plans';
                }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                View Plans
              </Button>
            </div>
          </div>

          {/* Bird Characters Section */}
          <BirdCharactersSection 
            birdSkins={birdSkins}
            selectedBirdSkin={selectedBirdSkin}
            hasAnySubscription={false}
            eliteSubscription={{ 
              isActive: false, 
              expiresAt: null, 
              daysRemaining: 0 
            }}
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
