
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Play } from 'lucide-react';

interface RevivePromptProps {
  isVisible: boolean;
  onWatchAd: () => void;
  onDecline: () => void;
  score: number;
}

const RevivePrompt: React.FC<RevivePromptProps> = ({
  isVisible,
  onWatchAd,
  onDecline,
  score
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <Card className="w-80 mx-4 bg-gradient-to-b from-blue-900 to-purple-900 text-white border-2 border-yellow-400">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-2">
            <Heart className="w-12 h-12 text-red-500 animate-pulse" />
          </div>
          <CardTitle className="text-xl font-bold text-yellow-300">
            Second Chance!
          </CardTitle>
          <p className="text-sm text-gray-300">
            Score: {score} points
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-lg font-semibold mb-2">Watch an ad to revive?</p>
            <p className="text-sm text-gray-300">
              Continue your flight and keep your score!
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={onWatchAd}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
            >
              <Play className="w-4 h-4 mr-2" />
              Watch Ad
            </Button>
            
            <Button
              onClick={onDecline}
              variant="outline"
              className="flex-1 border-gray-400 text-gray-300 hover:bg-gray-700 py-3"
            >
              No Thanks
            </Button>
          </div>
          
          <p className="text-xs text-center text-gray-400">
            One revive per game
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevivePrompt;
