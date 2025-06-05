
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Zap, Clock, Play, Gift, Coins, Heart } from 'lucide-react';

interface AdPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onWatchAd: (adType: 'continue' | 'coins' | 'life') => void;
  adType: 'continue' | 'coins' | 'life';
}

const AdPopup: React.FC<AdPopupProps> = ({ isOpen, onClose, onWatchAd, adType }) => {
  const [isWatching, setIsWatching] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (isWatching && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isWatching && countdown === 0) {
      setIsWatching(false);
      setCountdown(3);
      onWatchAd(adType);
    }
  }, [isWatching, countdown, onWatchAd, adType]);

  const getAdInfo = () => {
    switch (adType) {
      case 'continue':
        return {
          title: 'Continue Your Flight? 🚀',
          description: 'Watch a Pi Ad to get an extra life and soar higher!',
          reward: 'Extra Life',
          icon: <Heart className="h-8 w-8 text-red-400" />,
          emoji: '❤️',
          gradient: 'from-red-500 to-pink-600'
        };
      case 'coins':
        return {
          title: 'Bonus Pi Treasure! 💰',
          description: 'Watch a Pi Ad to earn 25 bonus Pi coins!',
          reward: '25 Pi Coins',
          icon: <Coins className="h-8 w-8 text-yellow-400" />,
          emoji: '🪙',
          gradient: 'from-yellow-500 to-orange-600'
        };
      case 'life':
        return {
          title: 'Power Up! ⚡',
          description: 'Watch a Pi Ad to earn an extra life for your adventure!',
          reward: 'Extra Life',
          icon: <Heart className="h-8 w-8 text-red-400" />,
          emoji: '❤️',
          gradient: 'from-purple-500 to-indigo-600'
        };
    }
  };

  const adInfo = getAdInfo();

  const handleWatchAd = () => {
    setIsWatching(true);
    setCountdown(3);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md border-violet-300/50 bg-gradient-to-br from-violet-600/95 to-purple-700/95 backdrop-blur-sm text-white">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl text-white">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Zap className="h-8 w-8 text-yellow-400 animate-pulse" />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                Pi Ad Network
              </span>
            </div>
            <div className="text-sm text-violet-200 font-normal">
              🌟 Powered by Pi Ecosystem 🌟
            </div>
          </DialogTitle>
        </DialogHeader>

        {!isWatching ? (
          <div className="space-y-6">
            <Card className={`p-6 text-center bg-gradient-to-br ${adInfo.gradient} border-white/20 shadow-xl`}>
              <div className="text-5xl mb-4 animate-bounce">{adInfo.emoji}</div>
              <h3 className="text-xl font-bold mb-3 text-white">{adInfo.title}</h3>
              <p className="text-white/90 mb-4 leading-relaxed">{adInfo.description}</p>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/30">
                <div className="flex items-center justify-center space-x-2">
                  <Gift className="h-5 w-5 text-yellow-300" />
                  <p className="font-bold text-yellow-100">Reward: {adInfo.reward}</p>
                </div>
              </div>
            </Card>

            <div className="flex space-x-3">
              <Button
                onClick={handleWatchAd}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 shadow-lg py-3 rounded-xl transform hover:scale-105 transition-all duration-200"
              >
                <Play className="mr-2 h-5 w-5" />
                🎬 Watch Ad
              </Button>
              
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 border-white/30 text-white hover:bg-white/20 rounded-xl py-3"
              >
                Skip
              </Button>
            </div>

            <div className="text-center">
              <div className="bg-violet-500/20 rounded-lg p-3 border border-violet-400/30">
                <p className="text-xs text-violet-200">
                  🎯 Ads help support the game and Pi Network ecosystem
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 text-center">
            <div className="bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-xl p-8 border border-blue-400/30">
              <Clock className="h-16 w-16 mx-auto mb-4 text-blue-400 animate-pulse" />
              <h3 className="text-xl font-bold mb-4 text-white">Watching Pi Ad...</h3>
              <div className="relative">
                <div className="text-5xl font-bold text-blue-400 mb-2 animate-bounce">{countdown}</div>
                <div className="w-full bg-white/20 rounded-full h-2 mb-4">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${((3 - countdown) / 3) * 100}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-white/80">Please wait while the ad plays</p>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-4 border border-yellow-400/30">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-2xl">🎯</span>
                <span className="font-semibold text-yellow-200">Sample Pi Network Advertisement</span>
              </div>
              <p className="text-xs text-yellow-100">
                🚀 Join millions in the Pi Network revolution!
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AdPopup;
