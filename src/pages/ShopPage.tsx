
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Coins, Crown, Star, Zap, Heart, ShoppingCart, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '../hooks/useGameState';
import { useSoundEffects } from '../hooks/useSoundEffects';

const ShopPage: React.FC = () => {
  const navigate = useNavigate();
  const gameState = useGameState();
  const { playSwoosh, playPoint } = useSoundEffects();

  const handleBack = () => {
    playSwoosh();
    navigate('/');
  };

  const handlePurchase = (item: string, cost: number) => {
    if (gameState.coins >= cost) {
      playPoint();
      gameState.setCoins(gameState.coins - cost);
      gameState.toast({
        title: "Purchase Successful!",
        description: `You bought ${item}!`
      });
    } else {
      gameState.toast({
        title: "Not enough Flappy Coins!",
        description: `You need ${cost - gameState.coins} more coins.`
      });
    }
  };

  const shopItems = [
    {
      id: 'revive',
      name: 'Extra Life',
      description: 'Continue playing after collision',
      price: 50,
      icon: Heart,
      color: 'from-red-500 to-pink-600'
    },
    {
      id: 'boost',
      name: 'Score Boost',
      description: '2x points for next game',
      price: 100,
      icon: Zap,
      color: 'from-yellow-500 to-orange-600'
    },
    {
      id: 'golden-bird',
      name: 'Golden Bird Skin',
      description: 'Shine bright like gold!',
      price: 200,
      icon: Crown,
      color: 'from-yellow-600 to-amber-700'
    },
    {
      id: 'rainbow-bird',
      name: 'Rainbow Bird Skin',
      description: 'Colorful and magical!',
      price: 300,
      icon: Sparkles,
      color: 'from-purple-500 to-pink-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-cyan-400 to-blue-500 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={handleBack}
          variant="ghost"
          size="lg"
          className="text-white hover:bg-white/20 rounded-xl"
        >
          <ArrowLeft className="w-6 h-6 mr-2" />
          Back
        </Button>
        
        <div className="flex items-center gap-3 bg-white/90 rounded-xl px-4 py-2 shadow-lg">
          <Coins className="w-6 h-6 text-yellow-500" />
          <span className="text-xl font-bold text-gray-800">{gameState.coins}</span>
          <span className="text-sm text-gray-600">Flappy Coins</span>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-white mb-2 drop-shadow-lg">
          Flappy Shop
        </h1>
        <p className="text-xl text-white/90 drop-shadow-md">
          Spend your Flappy Coins wisely! 🛒
        </p>
      </div>

      {/* Shop Items Grid */}
      <div className="max-w-2xl mx-auto grid gap-4">
        {shopItems.map((item) => {
          const IconComponent = item.icon;
          const canAfford = gameState.coins >= item.price;
          
          return (
            <Card key={item.id} className="p-6 bg-white/95 backdrop-blur-sm shadow-xl rounded-xl border-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Coins className="w-4 h-4 text-yellow-500" />
                      <span className="text-lg font-bold text-gray-800">{item.price}</span>
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={() => handlePurchase(item.name, item.price)}
                  disabled={!canAfford}
                  className={`px-6 py-3 rounded-xl font-bold transition-all duration-200 ${
                    canAfford 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg transform hover:scale-105' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {canAfford ? 'Buy' : 'Not enough'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Earn More Coins Section */}
      <Card className="max-w-2xl mx-auto mt-8 p-6 bg-white/95 backdrop-blur-sm shadow-xl rounded-xl border-0">
        <div className="text-center">
          <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Need More Flappy Coins?</h3>
          <p className="text-gray-600 mb-4">Play games to earn coins, or watch ads for bonus rewards!</p>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => navigate('/play')}
              className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-xl"
            >
              Play Game
            </Button>
            <Button
              onClick={() => gameState.toast({ title: "Watch Ad", description: "Ad system coming soon!" })}
              variant="outline"
              className="rounded-xl"
            >
              Watch Ad
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ShopPage;
