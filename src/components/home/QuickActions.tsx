
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trophy } from 'lucide-react';

interface QuickActionsProps {
  onOpenShop: () => void;
  onOpenLeaderboard: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onOpenShop, onOpenLeaderboard }) => {
  return (
    <div className="w-full grid grid-cols-2 gap-4 mb-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
      <Button 
        onClick={onOpenShop}
        className="h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold shadow-xl transform hover:scale-105 transition-all duration-200 border-0 rounded-2xl text-base"
      >
        <ShoppingCart className="mr-3 h-6 w-6" />
        Shop
      </Button>
      
      <Button 
        onClick={onOpenLeaderboard}
        className="h-14 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold shadow-xl transform hover:scale-105 transition-all duration-200 border-0 rounded-2xl text-base"
      >
        <Trophy className="mr-3 h-6 w-6" />
        Leaderboard
      </Button>
    </div>
  );
};

export default QuickActions;
