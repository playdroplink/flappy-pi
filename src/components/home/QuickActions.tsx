
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trophy } from 'lucide-react';

interface QuickActionsProps {
  onOpenShop: () => void;
  onOpenLeaderboard: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onOpenShop, onOpenLeaderboard }) => {
  return (
    <div className="w-full grid grid-cols-2 gap-3 mb-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
      <Button 
        onClick={onOpenShop}
        className="h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold shadow-lg transform hover:scale-105 transition-all duration-200 border-0 rounded-xl"
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        Shop
      </Button>
      
      <Button 
        onClick={onOpenLeaderboard}
        className="h-12 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-semibold shadow-lg transform hover:scale-105 transition-all duration-200 border-0 rounded-xl"
      >
        <Trophy className="mr-2 h-5 w-5" />
        Leaderboard
      </Button>
    </div>
  );
};

export default QuickActions;
