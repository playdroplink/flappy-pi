
import React from 'react';
import { Card } from '@/components/ui/card';

const SplashScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-500 to-sky-600 flex items-center justify-center relative overflow-hidden">
      {/* Animated clouds */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white/20 rounded-full animate-pulse"
            style={{
              width: `${60 + i * 20}px`,
              height: `${30 + i * 10}px`,
              left: `${10 + i * 12}%`,
              top: `${20 + i * 8}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '3s'
            }}
          />
        ))}
      </div>

      <Card className="p-8 text-center max-w-md mx-4 animate-scale-in">
        <div className="mb-6">
          <div className="text-6xl mb-4">🐦</div>
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
            Flappy Pi
          </h1>
          <p className="text-white/90 text-lg">
            Soar to new heights with Pi Network!
          </p>
        </div>
        
        <div className="space-y-2 text-white/80">
          <div className="animate-pulse">Loading...</div>
          <div className="text-sm">Powered by mrwain organization</div>
        </div>
      </Card>
    </div>
  );
};

export default SplashScreen;
