
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Coins, Crown, Zap, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const ShopPage = () => {
  const [coins, setCoins] = useState(150); // Mock user coins

  const shopItems = [
    {
      id: 'premium_bird',
      name: 'Golden Bird',
      price: 100,
      type: 'skin',
      icon: '🐦',
      description: 'Shiny golden bird skin',
      gradient: 'from-yellow-400 to-orange-500'
    },
    {
      id: 'rainbow_bird',
      name: 'Rainbow Bird',
      price: 200,
      type: 'skin',
      icon: '🌈',
      description: 'Colorful rainbow bird',
      gradient: 'from-purple-400 to-pink-500'
    },
    {
      id: 'extra_life',
      name: 'Extra Life',
      price: 50,
      type: 'boost',
      icon: '❤️',
      description: 'One extra chance',
      gradient: 'from-red-400 to-pink-500'
    },
    {
      id: 'double_coins',
      name: '2x Coins',
      price: 75,
      type: 'boost',
      icon: '💰',
      description: 'Double coin rewards',
      gradient: 'from-green-400 to-emerald-500'
    },
  ];

  const handlePurchase = (item: any) => {
    if (coins >= item.price) {
      setCoins(prev => prev - item.price);
      // Add purchase logic here
    }
  };

  return (
    <div className="min-h-screen p-4 pt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/home">
          <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-white/20">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-white">Shop</h1>
        <div className="flex items-center space-x-2 bg-yellow-500/90 rounded-lg px-3 py-2">
          <Coins className="h-5 w-5 text-white" />
          <span className="text-white font-bold">{coins}</span>
        </div>
      </div>

      {/* Shop Categories */}
      <div className="mb-6">
        <div className="flex space-x-2 bg-white/20 rounded-lg p-1">
          <Button className="flex-1 bg-white text-gray-800 hover:bg-gray-100">
            Bird Skins
          </Button>
          <Button variant="ghost" className="flex-1 text-white hover:bg-white/20">
            Power-ups
          </Button>
        </div>
      </div>

      {/* Shop Items */}
      <div className="grid grid-cols-1 gap-4 pb-8">
        {shopItems.map((item) => (
          <Card key={item.id} className="p-4 bg-white/95 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 bg-gradient-to-r ${item.gradient} rounded-full flex items-center justify-center text-2xl`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Coins className="h-4 w-4 text-yellow-500" />
                    <span className="font-semibold text-gray-800">{item.price}</span>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => handlePurchase(item)}
                disabled={coins < item.price}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                {coins >= item.price ? 'Buy' : 'Not enough coins'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Premium Section */}
      <Card className="mb-8 p-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white">
        <div className="text-center">
          <Crown className="h-8 w-8 mx-auto mb-2" />
          <h3 className="font-bold text-lg mb-2">Go Premium!</h3>
          <p className="text-sm mb-4">Unlock exclusive skins and remove ads</p>
          <Link to="/plans">
            <Button className="bg-white text-purple-600 hover:bg-gray-100">
              View Plans
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ShopPage;
