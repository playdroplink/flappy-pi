
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ShopHeader from './shop/ShopHeader';
import BirdSkinCard from './shop/BirdSkinCard';
import ShopInfoSection from './shop/ShopInfoSection';
import { Button } from '@/components/ui/button';
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
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center">
              <Crown className="mr-2 h-5 w-5 text-yellow-600" />
              Elite Pack Subscription
              <span className="ml-2 text-sm bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded">
                Premium
              </span>
            </h3>
            
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-300">
              {eliteSubscription.isActive ? (
                <div className="text-center">
                  <div className="text-4xl mb-3">👑</div>
                  <h4 className="text-xl font-bold text-yellow-700 mb-2">Elite Member Active!</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    You're enjoying elite privileges right now!
                  </p>
                  
                  <div className="bg-white rounded-lg p-3 border border-yellow-300 mb-4">
                    <div className="flex items-center justify-center space-x-2 mb-1">
                      <Calendar className="h-4 w-4 text-yellow-600" />
                      <span className="font-semibold text-sm">Time Remaining</span>
                    </div>
                    <p className="text-yellow-700 text-lg font-bold">
                      {eliteSubscription.daysRemaining} days
                    </p>
                  </div>
                  
                  <div className="text-sm text-left space-y-2">
                    <div className="flex items-center space-x-2 text-green-600">
                      <Crown className="h-4 w-4" />
                      <span>Elite badge and status</span>
                    </div>
                    <div className="flex items-center space-x-2 text-green-600">
                      <Sparkles className="h-4 w-4" />
                      <span>All skins including exclusive elite characters</span>
                    </div>
                    <div className="flex items-center space-x-2 text-green-600">
                      <Star className="h-4 w-4" />
                      <span>Priority support and early features</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-orange-100 rounded-lg">
                    <p className="text-xs text-orange-700">
                      <Shield className="h-3 w-3 inline mr-1" />
                      No refunds after payment. Subscription auto-renews monthly.
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-gray-800">Elite Pack</h4>
                      <p className="text-gray-600 text-sm">
                        Premium membership with exclusive content and elite status
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-yellow-600">20 Pi</div>
                      <div className="text-sm text-gray-500">per month</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3 mb-4 text-sm">
                    <div className="flex items-center space-x-3">
                      <Crown className="h-5 w-5 text-yellow-500" />
                      <span>Elite badge and special status recognition</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Sparkles className="h-5 w-5 text-yellow-500" />
                      <span>All bird skins including exclusive elite characters</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <span>Priority support and early access to new features</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Infinity className="h-5 w-5 text-yellow-500" />
                      <span>All features from standard subscriptions included</span>
                    </div>
                  </div>
                  
                  <div className="mb-4 p-3 bg-yellow-100 rounded-lg">
                    <p className="text-xs text-yellow-700">
                      <Shield className="h-3 w-3 inline mr-1" />
                      No refunds after payment. Subscription renews monthly. Cancel anytime.
                    </p>
                  </div>
                  
                  <Button
                    onClick={handleEliteSubscription}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0 rounded-lg py-3 font-bold"
                  >
                    <Crown className="mr-2 h-5 w-5" />
                    👑 Subscribe Elite Pack (20 Pi/month)
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* All Skins Subscription Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-pink-600" />
              All Skins Subscription
              <span className="ml-2 text-sm bg-pink-100 px-2 py-1 rounded text-pink-700">
                30 Days Access
              </span>
            </h3>
            
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6 border border-pink-200">
              {allSkinsSubscription.isActive && !eliteSubscription.isActive ? (
                <div className="text-center">
                  <div className="text-4xl mb-3">✨</div>
                  <h4 className="text-xl font-bold text-pink-700 mb-2">All Skins Unlocked!</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    You have access to all standard bird skins right now!
                  </p>
                  
                  <div className="bg-white rounded-lg p-3 border border-pink-200 mb-4">
                    <div className="flex items-center justify-center space-x-2 mb-1">
                      <Calendar className="h-4 w-4 text-pink-600" />
                      <span className="font-semibold text-sm">Time Remaining</span>
                    </div>
                    <p className="text-pink-700 text-lg font-bold">
                      {allSkinsSubscription.daysRemaining} days
                    </p>
                  </div>
                  
                  <div className="text-sm text-left space-y-2">
                    <div className="flex items-center space-x-2 text-green-600">
                      <Sparkles className="h-4 w-4" />
                      <span>All standard skins unlocked</span>
                    </div>
                    <div className="flex items-center space-x-2 text-green-600">
                      <Infinity className="h-4 w-4" />
                      <span>Switch between any standard skin anytime</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-pink-100 rounded-lg">
                    <p className="text-xs text-pink-700">
                      <Shield className="h-3 w-3 inline mr-1" />
                      No refunds after payment. One-time 30-day access.
                    </p>
                  </div>
                </div>
              ) : eliteSubscription.isActive ? (
                <div className="text-center">
                  <div className="text-4xl mb-3">👑</div>
                  <h4 className="text-xl font-bold text-yellow-700 mb-2">Included in Elite Pack!</h4>
                  <p className="text-gray-600 text-sm">
                    All skins are included in your Elite subscription
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-gray-800">Unlock All Standard Skins</h4>
                      <p className="text-gray-600 text-sm">
                        Get instant access to all standard bird skins for 30 days
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-pink-600">15 Pi</div>
                      <div className="text-sm text-gray-500">for 30 days</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3 mb-4 text-sm">
                    <div className="flex items-center space-x-3">
                      <Sparkles className="h-5 w-5 text-pink-500" />
                      <span>Access to all standard bird skins immediately</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Infinity className="h-5 w-5 text-pink-500" />
                      <span>Switch between any standard skin anytime during subscription</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-pink-500" />
                      <span>30 days of unlimited standard skin access</span>
                    </div>
                  </div>
                  
                  <div className="mb-4 p-3 bg-pink-100 rounded-lg">
                    <p className="text-xs text-pink-700">
                      <Shield className="h-3 w-3 inline mr-1" />
                      No refunds after payment. One-time purchase for 30-day access.
                    </p>
                  </div>
                  
                  <Button
                    onClick={handleAllSkinsSubscription}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-0 rounded-lg py-3 font-bold"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    🎨 Subscribe with Pi (15 Pi/30 days)
                  </Button>
                </div>
              )}
            </div>
          </div>

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
                    onClick={handlePurchaseAdFree}
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
              {eliteSubscription.isActive ? (
                <span className="ml-2 text-sm bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded">
                  Elite Access
                </span>
              ) : hasAnySubscription ? (
                <span className="ml-2 text-sm bg-green-100 px-2 py-1 rounded text-green-700">
                  All Unlocked
                </span>
              ) : (
                <span className="ml-2 text-sm bg-purple-100 px-2 py-1 rounded text-purple-700">
                  Premium Skins
                </span>
              )}
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {birdSkins.map((skin) => (
                <BirdSkinCard
                  key={skin.id}
                  id={skin.id}
                  name={skin.name}
                  image={skin.image}
                  piPrice={skin.piPrice}
                  coinPrice={skin.coinPrice}
                  isOwned={isOwned(skin.id)}
                  isSelected={selectedBirdSkin === skin.id}
                  canUse={hasAnySubscription || skin.id === 'default' || (skin.eliteOnly ? eliteSubscription.isActive : true)}
                  onSelect={() => setSelectedBirdSkin(skin.id)}
                  onPurchase={() => handleCoinPurchase(skin)}
                  userCoins={coins}
                  priceType={skin.priceType}
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
