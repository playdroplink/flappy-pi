
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ExternalLink } from 'lucide-react';

interface BannerAdProps {
  position?: 'top' | 'bottom';
  autoHide?: boolean;
  hideDelay?: number;
}

const BannerAd: React.FC<BannerAdProps> = ({
  position = 'bottom',
  autoHide = true,
  hideDelay = 8000
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, hideDelay);

      return () => clearTimeout(timer);
    }
  }, [autoHide, hideDelay]);

  if (!isVisible) return null;

  const handleAdClick = () => {
    // Track ad click analytics here
    console.log('Banner ad clicked');
    // Open Pi Network or partner link
    window.open('https://minepi.com', '_blank');
  };

  const positionClasses = position === 'top' 
    ? 'top-4' 
    : 'bottom-20';

  return (
    <div className={`fixed left-4 right-4 ${positionClasses} z-30 animate-fade-in`}>
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 border-0 shadow-xl">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              π
            </div>
            <div className="text-white">
              <div className="font-bold text-sm">Join Pi Network Today!</div>
              <div className="text-xs opacity-90">Mine Pi coins on your phone</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleAdClick}
              size="sm"
              className="bg-white text-purple-600 hover:bg-gray-100 font-bold text-xs px-3 py-1"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Join
            </Button>
            <Button
              onClick={() => setIsVisible(false)}
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20 w-6 h-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BannerAd;
