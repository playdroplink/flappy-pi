
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Zap, Clock, Play } from 'lucide-react';

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
          title: 'Continue Playing?',
          description: 'Watch a Pi Ad to get an extra life and continue your game!',
          reward: 'Extra Life',
          icon: '❤️'
        };
      case 'coins':
        return {
          title: 'Earn Bonus Coins',
          description: 'Watch a Pi Ad to earn 25 bonus coins!',
          reward: '25 Coins',
          icon: '🪙'
        };
      case 'life':
        return {
          title: 'Extra Life',
          description: 'Watch a Pi Ad to earn an extra life for your next game!',
          reward: 'Extra Life',
          icon: '❤️'
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            <Zap className="inline h-6 w-6 text-yellow-500 mr-2" />
            Pi Ad Network
          </DialogTitle>
        </DialogHeader>

        {!isWatching ? (
          <div className="space-y-6">
            <Card className="p-6 text-center bg-gradient-to-br from-yellow-50 to-orange-50">
              <div className="text-4xl mb-3">{adInfo.icon}</div>
              <h3 className="text-xl font-bold mb-2">{adInfo.title}</h3>
              <p className="text-gray-600 mb-4">{adInfo.description}</p>
              <div className="bg-green-100 rounded-lg p-3">
                <p className="font-bold text-green-700">Reward: {adInfo.reward}</p>
              </div>
            </Card>

            <div className="flex space-x-3">
              <Button
                onClick={handleWatchAd}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                <Play className="mr-2 h-4 w-4" />
                Watch Ad
              </Button>
              
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1"
              >
                Skip
              </Button>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Ads help support the game and Pi Network ecosystem
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 text-center">
            <div className="bg-gray-100 rounded-lg p-8">
              <Clock className="h-12 w-12 mx-auto mb-4 text-blue-500 animate-pulse" />
              <h3 className="text-xl font-bold mb-2">Watching Pi Ad...</h3>
              <div className="text-3xl font-bold text-blue-600 mb-2">{countdown}</div>
              <p className="text-gray-600">Please wait while the ad plays</p>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-sm text-yellow-700">
                🎯 Sample Pi Network Advertisement
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AdPopup;
