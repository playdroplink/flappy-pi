
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ShopHeader from './shop/ShopHeader';
import BirdSkinCard from './shop/BirdSkinCard';
import ShopInfoSection from './shop/ShopInfoSection';
import { Button } from '@/components/ui/button';
import { Crown, Zap, Infinity, Calendar } from 'lucide-react';
import { gameBackendService } from '@/services/gameBackendService';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAdSystem } from '@/hooks/useAdSystem';
import { useToast } from '@/hooks/use-toast';

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
      
      // Simulate Pi payment process
      setTimeout(async () => {
        try {
          // Record purchase in backend
          const result = await gameBackendService.makePurchase(
            profile.pi_user_id,
            'bird_skin',
            skin.id,
            0, // Pi payments don't deduct coins
            `pi_tx_${Date.now()}` // Mock Pi transaction ID
          );

          if (result.success) {
            setSelectedBirdSkin(skin.id);
            localStorage.setItem('flappypi-skin', skin.id);
            
            const ownedSkins = JSON.parse(localStorage.getItem('flappypi-owned-skins') || '["default"]');
            if (!ownedSkins.includes(skin.id)) {
              ownedSkins.push(skin.id);
              localStorage.setItem('flappypi-owned-skins', JSON.stringify(ownedSkins));
            }
            
            await refreshProfile(); // Refresh profile data
            
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
        // Make purchase through backend
        const result = await gameBackendService.makePurchase(
          profile.pi_user_id,
          'bird_skin',
          skin.id,
          skin.coinPrice
        );

        if (result.success) {
          // Update local state
          setCoins(result.remaining_coins || 0);
          localStorage.setItem('flappypi-coins', (result.remaining_coins || 0).toString());
          
          setSelectedBirdSkin(skin.id);
          localStorage.setItem('flappypi-skin', skin.id);
          
          const ownedSkins = JSON.parse(localStorage.getItem('flappypi-owned-skins') || '["default"]');
          if (!ownedSkins.includes(skin.id)) {
            ownedSkins.push(skin.id);
            localStorage.setItem('flappypi-owned-skins', JSON.stringify(ownedSkins));
          }
          
          await refreshProfile(); // Refresh profile data
          
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
          {/* Pi Premium Subscription Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center">
              <Crown className="mr-2 h-5 w-5 text-purple-600" />
              Pi Premium Subscription
              <span className="ml-2 text-sm bg-purple-100 px-2 py-1 rounded text-purple-700">
                Remove Ads
              </span>
            </h3>
            
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
              {adSystem.isAdFree ? (
                /* Active subscription */
                <div className="text-center">
                  <div className="text-4xl mb-3">✨</div>
                  <h4 className="text-xl font-bold text-purple-700 mb-2">Premium Active!</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    You're enjoying ad-free gaming right now!
                  </p>
                  
                  {adSystem.adFreeTimeRemaining && (
                    <div className="bg-white rounded-lg p-3 border border-purple-200 mb-4">
                      <div className="flex items-center justify-center space-x-2 mb-1">
                        <Calendar className="h-4 w-4 text-purple-600" />
                        <span className="font-semibold text-sm">Time Remaining</span>
                      </div>
                      <p className="text-purple-700 text-lg font-bold">
                        {adSystem.adFreeTimeRemaining.days}d {adSystem.adFreeTimeRemaining.hours}h
                      </p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 gap-2 text-sm text-left">
                    <div className="flex items-center space-x-2 text-green-600">
                      <Infinity className="h-4 w-4" />
                      <span>Continue games unlimited</span>
                    </div>
                    <div className="flex items-center space-x-2 text-green-600">
                      <Zap className="h-4 w-4" />
                      <span>No mandatory ads</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Purchase offer */
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-gray-800">Remove Pi Ads</h4>
                      <p className="text-gray-600 text-sm">
                        Skip all mandatory ads and continue unlimited
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">10 Pi</div>
                      <div className="text-sm text-gray-500">per month</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3 mb-4 text-sm">
                    <div className="flex items-center space-x-3">
                      <Infinity className="h-5 w-5 text-green-500" />
                      <span>Continue games unlimited without watching ads</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Zap className="h-5 w-5 text-green-500" />
                      <span>No mandatory ads every 2 games</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-green-500" />
                      <span>30 days of ad-free gaming</span>
                    </div>
                  </div>
                  
                  <Button
                    onClick={adSystem.purchaseAdFree}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 rounded-lg py-3 font-bold"
                  >
                    <Crown className="mr-2 h-5 w-5" />
                    💎 Subscribe with Pi (10 Pi/month)
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Bird Characters Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center">
              🐦 Bird Characters
              <span className="ml-2 text-sm bg-purple-100 px-2 py-1 rounded text-purple-700">
                Premium Skins
              </span>
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {birdSkins.map((skin) => (
                <BirdSkinCard
                  key={skin.id}
                  skin={skin}
                  selectedBirdSkin={selectedBirdSkin}
                  coins={coins}
                  isOwned={isOwned(skin.id)}
                  onSelectSkin={setSelectedBirdSkin}
                  onPiPayment={handlePiPayment}
                  onCoinPurchase={handleCoinPurchase}
                />
              ))}
            </div>
          </div>

          <ShopInfoSection />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShopModal;
