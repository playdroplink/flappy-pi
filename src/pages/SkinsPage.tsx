
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const SkinsPage = () => {
  const [selectedSkin, setSelectedSkin] = useState('default');
  
  const skins = [
    { id: 'default', name: 'Classic Bird', icon: '🐦', owned: true, equipped: true },
    { id: 'golden', name: 'Golden Bird', icon: '🌟', owned: true, equipped: false },
    { id: 'rainbow', name: 'Rainbow Bird', icon: '🌈', owned: false, equipped: false },
    { id: 'fire', name: 'Fire Bird', icon: '🔥', owned: false, equipped: false },
    { id: 'ice', name: 'Ice Bird', icon: '❄️', owned: false, equipped: false },
    { id: 'ninja', name: 'Ninja Bird', icon: '🥷', owned: false, equipped: false },
  ];

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
        <h1 className="text-2xl font-bold text-white">My Skins</h1>
        <div className="w-16" /> {/* Spacer */}
      </div>

      {/* Current Skin */}
      <Card className="mb-6 p-4 bg-white/95 backdrop-blur-sm">
        <div className="text-center">
          <div className="text-4xl mb-2">🐦</div>
          <h3 className="font-bold text-gray-800">Currently Equipped</h3>
          <p className="text-sm text-gray-600">Classic Bird</p>
        </div>
      </Card>

      {/* Skins Grid */}
      <div className="grid grid-cols-2 gap-4 pb-8">
        {skins.map((skin) => (
          <Card 
            key={skin.id} 
            className={`p-4 bg-white/95 backdrop-blur-sm transition-all duration-200 ${
              selectedSkin === skin.id ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <div className="text-center">
              <div className="text-3xl mb-2 relative">
                {skin.icon}
                {!skin.owned && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <Lock className="h-6 w-6 text-white" />
                  </div>
                )}
              </div>
              <h4 className="font-semibold text-gray-800 text-sm">{skin.name}</h4>
              
              {skin.owned ? (
                skin.equipped ? (
                  <div className="mt-2 flex items-center justify-center text-green-600">
                    <Check className="h-4 w-4 mr-1" />
                    <span className="text-xs">Equipped</span>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    className="mt-2 w-full text-xs"
                    onClick={() => setSelectedSkin(skin.id)}
                  >
                    Equip
                  </Button>
                )
              ) : (
                <Link to="/shop">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full text-xs"
                  >
                    Unlock
                  </Button>
                </Link>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Get More Skins */}
      <Card className="mb-8 p-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
        <div className="text-center">
          <h3 className="font-bold mb-2">Want More Skins?</h3>
          <p className="text-sm mb-4">Check out our shop for amazing new birds!</p>
          <Link to="/shop">
            <Button className="bg-white text-blue-600 hover:bg-gray-100">
              Visit Shop
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default SkinsPage;
