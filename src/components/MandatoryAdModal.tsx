
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Zap, Clock, Play, Crown } from 'lucide-react';

interface MandatoryAdModalProps {
  isOpen: boolean;
  onWatchAd: () => void;
  onUpgradeToPremium: () => void;
  canUpgrade: boolean;
}

const MandatoryAdModal: React.FC<MandatoryAdModalProps> = ({
  isOpen,
  onWatchAd,
  onUpgradeToPremium,
  canUpgrade
}) => {
  const [isWatching, setIsWatching] = useState(false);
  const [countdown, setCountdown] = useState(3);

  // Reset state when popup opens
  useEffect(() => {
    if (isOpen) {
      setIsWatching(false);
      setCountdown(3);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isWatching && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isWatching && countdown === 0) {
      // Ad completed
      setIsWatching(false);
      onWatchAd();
    }
  }, [isWatching, countdown, onWatchAd]);

  const handleWatchAd = () => {
    setIsWatching(true);
    setCountdown(3);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-sm border-0 p-0 bg-transparent shadow-none" hideCloseButton>
        <div className="relative bg-white rounded-2xl p-6 text-gray-800 shadow-2xl border border-gray-200">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Zap className="h-6 w-6 text-purple-500" />
              <span className="text-lg font-bold text-purple-600">Mandatory Ad</span>
            </div>
            <div className="text-xs text-gray-500">
              🎯 Every 2 games require an ad
            </div>
          </div>

          {!isWatching ? (
            <>
              {/* Main content */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-6 text-center border border-blue-100">
                <div className="text-4xl mb-3">📺</div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">Time for an Ad Break!</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  You've played 2 games! Watch a Pi Network ad to continue playing.
                </p>
                
                <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                  <div className="text-sm text-yellow-700">
                    💡 <strong>Tip:</strong> Get Pi Premium to skip all mandatory ads!
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleWatchAd}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white border-0 rounded-xl py-3 font-bold text-base"
                >
                  <Play className="mr-2 h-5 w-5" />
                  🎬 Watch Pi Ad (Required)
                </Button>
                
                {canUpgrade && (
                  <Button
                    onClick={onUpgradeToPremium}
                    variant="outline"
                    className="w-full border-purple-300 text-purple-600 hover:bg-purple-50 rounded-xl py-2"
                  >
                    <Crown className="mr-2 h-4 w-4" />
                    💎 Get Pi Premium (10 Pi)
                  </Button>
                )}
              </div>

              {/* Footer */}
              <div className="text-center mt-4">
                <p className="text-xs text-gray-500">
                  🌟 Ads help support the game development
                </p>
              </div>
            </>
          ) : (
            /* Watching state */
            <div className="text-center py-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <Clock className="h-12 w-12 mx-auto mb-4 text-blue-500 animate-pulse" />
                <h3 className="text-lg font-bold mb-4 text-gray-800">Watching Mandatory Ad...</h3>
                <div className="text-3xl font-bold text-blue-500 mb-3 animate-bounce">{countdown}</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${((3 - countdown) / 3) * 100}%` }}
                  ></div>
                </div>
                <p className="text-gray-600 text-sm">Please wait while the ad plays</p>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-3 border border-yellow-200 mt-4">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <span className="text-lg">🎯</span>
                  <span className="font-semibold text-yellow-700 text-sm">Pi Network Advertisement</span>
                </div>
                <p className="text-xs text-yellow-600">
                  🚀 Join millions in the Pi Network revolution!
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MandatoryAdModal;
