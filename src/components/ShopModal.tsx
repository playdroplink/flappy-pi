import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ShopHeader from './shop/ShopHeader';
import BirdSkinCard from './shop/BirdSkinCard';
import ShopInfoSection from './shop/ShopInfoSection';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Crown, Zap, Infinity, Calendar, Sparkles, Star, Shield } from 'lucide-react';
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
  
  const [allSkinsSubscription, setAllSkinsSubscription] = useState<{
    isActive: boolean;
    expiresAt: string | null;
    daysRemaining: number;
  }>({
    isActive: false,
    expiresAt: null,
    daysRemaining: 0
  });
  const [eliteSubscription, setEliteSubscription] = useState<{
    isActive: boolean;
    expiresAt: string | null;
    daysRemaining: number;
  }>({
    isActive: false,
    expiresAt: null,
    daysRemaining: 0
  });

  // Check for subscriptions status
  useEffect(() => {
    const checkSubscriptions = () => {
      // Check All Skins subscription
      const allSkinsData = localStorage.getItem('flappypi-all-skins-subscription');
      if (allSkinsData) {
        const subscription = JSON.parse(allSkinsData);
        const expiryDate = new Date(subscription.expiresAt);
        const now = new Date();
        
        if (expiryDate > now) {
          const daysRemaining = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          setAllSkinsSubscription({
            isActive: true,
            expiresAt: subscription.expiresAt,
            daysRemaining
          });
        } else {
          localStorage.removeItem('flappypi-all-skins-subscription');
          setAllSkinsSubscription({
            isActive: false,
            expiresAt: null,
            daysRemaining: 0
          });
        }
      }

      // Check Elite subscription
      const eliteData = localStorage.getItem('flappypi-elite-subscription');
      if (eliteData) {
        const subscription = JSON.parse(eliteData);
        const expiryDate = new Date(subscription.expiresAt);
        const now = new Date();
        
        if (expiryDate > now) {
          const daysRemaining = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          setEliteSubscription({
            isActive: true,
            expiresAt: subscription.expiresAt,
            daysRemaining
          });
        } else {
          localStorage.removeItem('flappypi-elite-subscription');
          setEliteSubscription({
            isActive: false,
            expiresAt: null,
            daysRemaining: 0
          });
        }
      }
    };

    checkSubscriptions();
    if (isOpen) {
      checkSubscriptions();
    }
  }, [isOpen]);

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
      id: 'elite', 
      name: 'Elite Champion', 
      piPrice: 0,
      coinPrice: 0,
      priceType: 'elite' as const,
      image: '/lovable-uploads/5a55528e-3d0c-4cd3-91d9-6b8cff953b06.png',
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
          setAllSkinsSubscription({
            isActive: true,
            expiresAt: subscriptionData.expiresAt,
            daysRemaining
          });
          
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
          
          const daysRemaining = 30;
          setEliteSubscription({
            isActive: true,
            expiresAt: subscriptionData.expiresAt,
            daysRemaining
          });
          
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
            "bird_skin",
            skin.id
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
          "bird_skin",
          skin.id
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-sm max-h-[95vh] overflow-hidden bg-white border-gray-300 mx-2">
        <DialogHeader className="pb-3">
          <DialogTitle className="text-center text-xl text-gray-800 flex items-center justify-center space-x-2">
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

        <div className="overflow-y-auto max-h-[calc(95vh-140px)] space-y-4 px-1">
          {/* Elite Pack Subscription Section */}
          <Card className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Crown className="h-5 w-5 text-yellow-600" />
                <h3 className="font-bold text-gray-800 text-sm">Elite Pack</h3>
                <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded">
                  Premium
                </span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-yellow-600">20 Pi</div>
                <div className="text-xs text-gray-500">monthly</div>
              </div>
            </div>
            
            {eliteSubscription.isActive ? (
              <div className="text-center">
                <div className="text-2xl mb-2">👑</div>
                <h4 className="font-bold text-yellow-700 mb-1">Elite Active!</h4>
                <p className="text-xs text-gray-600 mb-2">
                  {eliteSubscription.daysRemaining} days remaining
                </p>
                <div className="text-xs space-y-1">
                  <div className="flex items-center justify-center space-x-1 text-green-600">
                    <Crown className="h-3 w-3" />
                    <span>Elite badge & status</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1 text-green-600">
                    <Sparkles className="h-3 w-3" />
                    <span>All skins + exclusive</span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-xs space-y-1 mb-3">
                  <div className="flex items-center space-x-2">
                    <Crown className="h-3 w-3 text-yellow-500" />
                    <span>Elite badge and special status</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-3 w-3 text-yellow-500" />
                    <span>All skins including exclusive</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-3 w-3 text-yellow-500" />
                    <span>Priority support & early features</span>
                  </div>
                </div>
                
                <Button
                  onClick={handleEliteSubscription}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0 rounded-lg py-2 font-bold text-sm"
                >
                  <Crown className="mr-1 h-4 w-4" />
                  Subscribe Elite (20 Pi/month)
                </Button>
              </div>
            )}
          </Card>

          {/* All Skins Subscription Section */}
          <Card className="p-4 bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-pink-600" />
                <h3 className="font-bold text-gray-800 text-sm">All Skins</h3>
                <span className="text-xs bg-pink-100 px-2 py-1 rounded text-pink-700">
                  30 Days
                </span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-pink-600">15 Pi</div>
                <div className="text-xs text-gray-500">one-time</div>
              </div>
            </div>
            
            {allSkinsSubscription.isActive && !eliteSubscription.isActive ? (
              <div className="text-center">
                <div className="text-2xl mb-2">✨</div>
                <h4 className="font-bold text-pink-700 mb-1">All Skins Active!</h4>
                <p className="text-xs text-gray-600 mb-2">
                  {allSkinsSubscription.daysRemaining} days remaining
                </p>
                <div className="text-xs">
                  <div className="flex items-center justify-center space-x-1 text-green-600">
                    <Sparkles className="h-3 w-3" />
                    <span>All standard skins unlocked</span>
                  </div>
                </div>
              </div>
            ) : eliteSubscription.isActive ? (
              <div className="text-center">
                <div className="text-2xl mb-2">👑</div>
                <h4 className="font-bold text-yellow-700 mb-1">Included in Elite!</h4>
                <p className="text-xs text-gray-600">
                  All skins included in your Elite subscription
                </p>
              </div>
            ) : (
              <div>
                <div className="text-xs space-y-1 mb-3">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-3 w-3 text-pink-500" />
                    <span>Access to all standard skins</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-3 w-3 text-pink-500" />
                    <span>30 days unlimited access</span>
                  </div>
                </div>
                
                <Button
                  onClick={handleAllSkinsSubscription}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-0 rounded-lg py-2 font-bold text-sm"
                >
                  <Sparkles className="mr-1 h-4 w-4" />
                  Subscribe (15 Pi/30 days)
                </Button>
              </div>
            )}
          </Card>

          {/* Pi Premium Subscription Section */}
          <Card className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Crown className="h-5 w-5 text-purple-600" />
                <h3 className="font-bold text-gray-800 text-sm">Pi Premium</h3>
                <span className="text-xs bg-purple-100 px-2 py-1 rounded text-purple-700">
                  No Ads
                </span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-purple-600">10 Pi</div>
                <div className="text-xs text-gray-500">monthly</div>
              </div>
            </div>
            
            {adSystem.isAdFree ? (
              <div className="text-center">
                <div className="text-2xl mb-2">✨</div>
                <h4 className="font-bold text-purple-700 mb-1">Premium Active!</h4>
                {adSystem.adFreeTimeRemaining && (
                  <p className="text-xs text-gray-600 mb-2">
                    {adSystem.adFreeTimeRemaining.days}d {adSystem.adFreeTimeRemaining.hours}h remaining
                  </p>
                )}
                <div className="text-xs">
                  <div className="flex items-center justify-center space-x-1 text-green-600">
                    <Zap className="h-3 w-3" />
                    <span>Ad-free gaming experience</span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-xs space-y-1 mb-3">
                  <div className="flex items-center space-x-2">
                    <Infinity className="h-3 w-3 text-green-500" />
                    <span>Continue games unlimited</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="h-3 w-3 text-green-500" />
                    <span>No mandatory ads</span>
                  </div>
                </div>
                
                <Button
                  onClick={adSystem.purchaseAdFree}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 rounded-lg py-2 font-bold text-sm"
                >
                  <Crown className="mr-1 h-4 w-4" />
                  Subscribe (10 Pi/month)
                </Button>
              </div>
            )}
          </Card>

          {/* Bird Characters Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-800 flex items-center text-sm">
                🐦 Bird Characters
              </h3>
              {eliteSubscription.isActive ? (
                <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded">
                  Elite Access
                </span>
              ) : hasAnySubscription ? (
                <span className="text-xs bg-green-100 px-2 py-1 rounded text-green-700">
                  All Unlocked
                </span>
              ) : (
                <span className="text-xs bg-purple-100 px-2 py-1 rounded text-purple-700">
                  Premium Skins
                </span>
              )}
            </div>
            <div className="space-y-3">
              {birdSkins.map((skin) => (
                <BirdSkinCard
                  key={skin.id}
                  skin={skin}
                  selectedBirdSkin={selectedBirdSkin}
                  coins={coins}
                  isOwned={isOwned(skin.id)}
                  hasAllSkinsSubscription={hasAnySubscription}
                  hasEliteSubscription={eliteSubscription.isActive}
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
