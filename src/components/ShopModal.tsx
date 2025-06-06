import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Crown, Star, Zap, Check, Coins, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import ShopHeader from './shop/ShopHeader';
import BirdCharactersSection from './shop/BirdCharactersSection';
import ShopInfoSection from './shop/ShopInfoSection';
import AdFreeSubscriptionSection from './shop/AdFreeSubscriptionSection';
import AllSkinsSubscriptionSection from './shop/AllSkinsSubscriptionSection';
import EliteSubscriptionSection from './shop/EliteSubscriptionSection';
import { useAdSystem } from '@/hooks/useAdSystem';
import { useShopSubscriptions } from '@/hooks/useShopSubscriptions';
import { useGameSettings } from '@/hooks/useGameSettings';

interface ShopModalProps {
  open: boolean;
  onClose: () => void;
}

const ShopModal: React.FC<ShopModalProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const adSystem = useAdSystem();
  const { allSkinsSubscription, eliteSubscription, checkSubscriptions } = useShopSubscriptions();
  const { selectedBirdSkin, setSelectedBirdSkin } = useGameSettings();
  const [coins, setCoins] = useState(0);

  // Enhanced bird skins data with proper elite birds
  const birdSkins = [
    {
      id: 'default',
      name: 'Classic Bird',
      piPrice: 0,
      coinPrice: 0,
      priceType: 'free' as const,
      image: '/lovable-uploads/3a780914-6faf-4deb-81ab-ce1f4b059984.png',
      owned: true
    },
    {
      id: 'red',
      name: 'Red Cardinal',
      piPrice: 5,
      coinPrice: 5000,
      priceType: 'premium' as const,
      image: '/lovable-uploads/5a55528e-3d0c-4cd3-91d9-6b8cff953b06.png',
      owned: false
    },
    {
      id: 'blue',
      name: 'Blue Jay',
      piPrice: 5,
      coinPrice: 5000,
      priceType: 'premium' as const,
      image: '/lovable-uploads/616a87a7-bd9c-414f-a05b-09c6f7a38ef9.png',
      owned: false
    },
    {
      id: 'green',
      name: 'Emerald Parrot',
      piPrice: 5,
      coinPrice: 5000,
      priceType: 'premium' as const,
      image: '/lovable-uploads/b2ccab90-dff7-4e09-9564-3cdd075c6793.png',
      owned: false
    },
    {
      id: 'elite-gold',
      name: 'Golden Phoenix',
      piPrice: 15,
      coinPrice: 15000,
      priceType: 'elite' as const,
      image: '/lovable-uploads/8ad9f53d-d0aa-4231-9042-d1890a6f997f.png',
      owned: false,
      eliteOnly: true
    },
    {
      id: 'elite-violet',
      name: 'Violet Storm',
      piPrice: 15,
      coinPrice: 15000,
      priceType: 'elite' as const,
      image: '/lovable-uploads/d139217c-21c4-42bd-ba26-18c96c98f9b1.png',
      owned: false,
      eliteOnly: true
    },
    {
      id: 'elite-eagle',
      name: 'Royal Eagle',
      piPrice: 20,
      coinPrice: 20000,
      priceType: 'elite' as const,
      image: '/lovable-uploads/9acde8f5-e27f-412c-9e12-d5f8a64c4ef2.png',
      owned: false,
      eliteOnly: true
    },
    {
      id: 'elite-royal',
      name: 'Royal Peacock',
      piPrice: 25,
      coinPrice: 25000,
      priceType: 'elite' as const,
      image: '/lovable-uploads/9553da41-d31b-473b-9951-87e3a0e5987c.png',
      owned: false,
      eliteOnly: true
    }
  ];

  useEffect(() => {
    checkSubscriptions();
    // Load coins from localStorage
    const savedCoins = localStorage.getItem('flappypi-coins');
    if (savedCoins) {
      setCoins(parseInt(savedCoins));
    }
  }, []);

  const isOwned = (skinId: string) => {
    const skin = birdSkins.find(s => s.id === skinId);
    return skin?.owned || false;
  };

  const hasAnySubscription = allSkinsSubscription.isActive || eliteSubscription.isActive;

  const handlePiPayment = async (skin: any) => {
    toast({
      title: "Processing Pi Payment",
      description: `Processing payment for ${skin.name}...`
    });

    // Simulate Pi Network payment processing
    setTimeout(() => {
      toast({
        title: "Purchase Successful! 🎉",
        description: `Successfully purchased ${skin.name}!`
      });
    }, 2000);
  };

  const handleCoinPurchase = async (skin: any) => {
    if (coins >= skin.coinPrice) {
      setCoins(coins - skin.coinPrice);
      localStorage.setItem('flappypi-coins', (coins - skin.coinPrice).toString());
      toast({
        title: "Purchase Successful! 🎉",
        description: `Successfully purchased ${skin.name} with coins!`
      });
    } else {
      toast({
        title: "Not Enough Coins",
        description: `You need ${skin.coinPrice - coins} more coins to purchase ${skin.name}`,
        variant: "destructive"
      });
    }
  };

  const handlePurchaseAdFree = async () => {
    const success = await adSystem.purchaseAdFreeWithPi();
    if (success) {
      toast({
        title: "Ad-Free Subscription Active!",
        description: "You now have 30 days of ad-free gaming."
      });
    }
  };

  const handleAllSkinsSubscription = async () => {
    toast({
      title: "Processing Pi Payment",
      description: "Processing All Skins subscription..."
    });

    setTimeout(() => {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      
      localStorage.setItem('flappypi-all-skins-subscription', JSON.stringify({
        expiresAt: expiryDate.toISOString()
      }));
      
      checkSubscriptions();
      
      toast({
        title: "All Skins Unlocked! 🎨",
        description: "You now have access to all standard skins for 30 days!"
      });
    }, 2000);
  };

  const handleEliteSubscription = async () => {
    toast({
      title: "Processing Pi Payment",
      description: "Processing Elite subscription..."
    });

    setTimeout(() => {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      
      localStorage.setItem('flappypi-elite-subscription', JSON.stringify({
        expiresAt: expiryDate.toISOString()
      }));
      
      checkSubscriptions();
      
      toast({
        title: "Elite Membership Activated! 👑",
        description: "Welcome to Elite status with exclusive content!"
      });
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-white border shadow-lg rounded-lg overflow-hidden">
        <ScrollArea className="h-[85vh] w-full">
          <div className="p-6">
            {/* Header */}
            <ShopHeader coins={coins} onClose={onClose} />

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

            {/* Shop Info Section */}
            <ShopInfoSection />

            {/* Ad-Free Subscription Section */}
            <AdFreeSubscriptionSection
              adSystem={adSystem}
              handlePurchaseAdFree={handlePurchaseAdFree}
            />

            {/* All Skins Subscription Section */}
            <AllSkinsSubscriptionSection
              allSkinsSubscription={allSkinsSubscription}
              eliteSubscription={eliteSubscription}
              handleAllSkinsSubscription={handleAllSkinsSubscription}
            />

            {/* Elite Subscription Section */}
            <EliteSubscriptionSection
              eliteSubscription={eliteSubscription}
              handleEliteSubscription={handleEliteSubscription}
            />

            {/* Subscription Plans Page Link */}
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-800">Explore More Plans</h4>
                  <p className="text-sm text-gray-600">Check out all subscription options</p>
                </div>
                <Button
                  onClick={() => {
                    onClose();
                    navigate('/subscription-plans');
                  }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Plans
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ShopModal;
