
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ShopHeader from './shop/ShopHeader';
import BirdSkinCard from './shop/BirdSkinCard';
import ShopInfoSection from './shop/ShopInfoSection';

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
    try {
      console.log(`Initiating Pi payment for ${skin.name} - ${skin.piPrice} Pi`);
      
      setTimeout(() => {
        setSelectedBirdSkin(skin.id);
        localStorage.setItem('flappypi-skin', skin.id);
        
        const ownedSkins = JSON.parse(localStorage.getItem('flappypi-owned-skins') || '["default"]');
        if (!ownedSkins.includes(skin.id)) {
          ownedSkins.push(skin.id);
          localStorage.setItem('flappypi-owned-skins', JSON.stringify(ownedSkins));
        }
        
        alert(`Successfully purchased ${skin.name} with Pi! 🎉`);
      }, 1500);
      
    } catch (error) {
      console.error('Pi payment failed:', error);
      alert('Payment failed. Please try again.');
    }
  };

  const handleCoinPurchase = (skin: any) => {
    if (coins >= skin.coinPrice) {
      const newCoins = coins - skin.coinPrice;
      setCoins(newCoins);
      localStorage.setItem('flappypi-coins', newCoins.toString());
      
      setSelectedBirdSkin(skin.id);
      localStorage.setItem('flappypi-skin', skin.id);
      
      const ownedSkins = JSON.parse(localStorage.getItem('flappypi-owned-skins') || '["default"]');
      if (!ownedSkins.includes(skin.id)) {
        ownedSkins.push(skin.id);
        localStorage.setItem('flappypi-owned-skins', JSON.stringify(ownedSkins));
      }
      
      alert(`Successfully purchased ${skin.name} with coins! 🎉`);
    } else {
      alert(`Not enough coins! You need ${skin.coinPrice - coins} more coins.`);
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
