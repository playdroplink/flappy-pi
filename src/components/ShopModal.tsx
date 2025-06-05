
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Coins, Check, Lock, Zap } from 'lucide-react';

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
      priceType: 'free',
      image: '/lovable-uploads/8ad9f53d-d0aa-4231-9042-d1890a6f997f.png',
      owned: true 
    },
    { 
      id: 'green', 
      name: 'Emerald Flyer', 
      piPrice: 10,
      coinPrice: 10000,
      priceType: 'premium',
      image: '/lovable-uploads/b2ccab90-dff7-4e09-9564-3cdd075c6793.png',
      owned: false 
    },
    { 
      id: 'red', 
      name: 'Ruby Racer', 
      piPrice: 10,
      coinPrice: 10000,
      priceType: 'premium',
      image: '/lovable-uploads/3a780914-6faf-4deb-81ab-ce1f4b059984.png',
      owned: false 
    },
  ];

  const handlePiPayment = async (skin: any) => {
    // Simulate Pi Network payment
    try {
      console.log(`Initiating Pi payment for ${skin.name} - ${skin.piPrice} Pi`);
      
      // In a real implementation, this would call the Pi SDK
      // Pi.requestPayment({
      //   amount: skin.piPrice,
      //   memo: `Flappy Pi - ${skin.name} bird skin`,
      //   metadata: { skinId: skin.id }
      // })
      
      // Simulate successful payment
      setTimeout(() => {
        setSelectedBirdSkin(skin.id);
        localStorage.setItem('flappypi-skin', skin.id);
        
        // Mark as owned (in real app, this would be verified on backend)
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
      
      // Mark as owned
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
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 bg-gray-100 rounded-lg p-2 mt-2">
              <Coins className="h-5 w-5 text-yellow-500" />
              <span className="font-bold text-gray-800">{coins.toLocaleString()} Game Coins</span>
            </div>
            <p className="text-gray-600 text-sm mt-2">
              Buy with Pi Network or Game Coins
            </p>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Bird Skins */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center">
              🐦 Bird Characters
              <span className="ml-2 text-sm bg-purple-100 px-2 py-1 rounded text-purple-700">
                Premium Skins
              </span>
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {birdSkins.map((skin) => (
                <Card key={skin.id} className="p-4 bg-gray-50 border-gray-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 flex items-center justify-center bg-white rounded-lg border border-gray-200">
                      <img 
                        src={skin.image} 
                        alt={skin.name}
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-lg">{skin.name}</h4>
                      <div className="mb-2">
                        {skin.priceType === 'free' ? (
                          <span className="text-green-600 text-sm font-medium">Free</span>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex items-center space-x-1">
                              <Zap className="h-4 w-4 text-purple-600" />
                              <span className="text-purple-600 font-bold">{skin.piPrice} Pi</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Coins className="h-4 w-4 text-yellow-600" />
                              <span className="text-yellow-600 font-bold">{skin.coinPrice.toLocaleString()} Coins</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right space-y-2">
                      {selectedBirdSkin === skin.id ? (
                        <Button className="bg-green-600 hover:bg-green-700 text-white w-full" disabled>
                          <Check className="mr-1 h-4 w-4" />
                          Selected
                        </Button>
                      ) : isOwned(skin.id) ? (
                        <Button 
                          onClick={() => setSelectedBirdSkin(skin.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                        >
                          Select
                        </Button>
                      ) : skin.priceType === 'premium' ? (
                        <div className="space-y-2">
                          <Button 
                            onClick={() => handlePiPayment(skin)}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white w-full"
                          >
                            <Zap className="mr-1 h-4 w-4" />
                            Buy with Pi
                          </Button>
                          <Button 
                            onClick={() => handleCoinPurchase(skin)}
                            className={`w-full ${coins >= skin.coinPrice ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-gray-400 cursor-not-allowed'} text-white`}
                            disabled={coins < skin.coinPrice}
                          >
                            <Coins className="mr-1 h-4 w-4" />
                            Buy with Coins
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          onClick={() => setSelectedBirdSkin(skin.id)}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white w-full"
                        >
                          <Coins className="mr-1 h-4 w-4" />
                          Free
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-start space-x-3">
              <Zap className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h4 className="font-semibold text-blue-800">Earning & Spending Coins</h4>
                <p className="text-blue-700 text-sm mt-1">
                  Earn 1 coin for every pipe you pass! Premium skins cost 10,000 coins or 10 Pi.
                </p>
                <p className="text-blue-600 text-xs mt-2">
                  Pi purchases support the Pi Network ecosystem and unlock exclusive content instantly.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShopModal;
