
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, ShoppingCart, Trophy, Palette, HelpCircle, Users, Settings, Crown } from 'lucide-react';

const HomePage = () => {
  const menuItems = [
    { to: '/play', icon: Play, label: 'Play Game', color: 'from-green-500 to-emerald-600', description: 'Start your adventure!' },
    { to: '/shop', icon: ShoppingCart, label: 'Shop', color: 'from-purple-500 to-pink-600', description: 'Buy skins & boosts' },
    { to: '/leaderboard', icon: Trophy, label: 'Leaderboard', color: 'from-yellow-500 to-orange-600', description: 'Top players worldwide' },
    { to: '/skins', icon: Palette, label: 'My Skins', color: 'from-blue-500 to-cyan-600', description: 'Customize your bird' },
    { to: '/plans', icon: Crown, label: 'Premium', color: 'from-indigo-500 to-purple-600', description: 'Exclusive benefits' },
    { to: '/help', icon: HelpCircle, label: 'Help & FAQ', color: 'from-gray-500 to-slate-600', description: 'Learn how to play' },
  ];

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <div className="text-center mb-8 pt-8">
        <div className="mb-6">
          <img 
            src="/lovable-uploads/8d2aed26-e6ed-4f65-9613-6ec708c96c50.png" 
            alt="Flappy Pi" 
            className="w-24 h-24 mx-auto mb-4 animate-bounce drop-shadow-2xl"
          />
        </div>
        <h1 className="text-4xl font-black text-white mb-2 drop-shadow-lg">
          Flappy Pi
        </h1>
        <p className="text-white/90 text-lg font-medium drop-shadow-md">
          Ready to soar? 🚀
        </p>
      </div>

      {/* User Stats Card */}
      <Card className="mb-6 p-4 bg-white/95 backdrop-blur-sm shadow-xl rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">👤</span>
            </div>
            <div>
              <div className="font-bold text-gray-800">Welcome back!</div>
              <div className="text-sm text-gray-600">Ready to play?</div>
            </div>
          </div>
          <Link to="/account">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Card>

      {/* Menu Grid */}
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        {menuItems.map(({ to, icon: Icon, label, color, description }) => (
          <Link key={to} to={to} className="group">
            <Card className="p-4 h-28 bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200 transform group-hover:scale-105 rounded-xl">
              <div className="flex flex-col items-center text-center h-full justify-between">
                <div className={`w-10 h-10 bg-gradient-to-r ${color} rounded-full flex items-center justify-center mb-2`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-gray-800 text-sm">{label}</div>
                  <div className="text-xs text-gray-600 mt-1">{description}</div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Links */}
      <div className="mt-8 flex justify-center space-x-4">
        <Link to="/contact">
          <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-white/20">
            <Users className="h-4 w-4 mr-2" />
            Contact
          </Button>
        </Link>
        <Link to="/privacy">
          <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-white/20">
            Privacy
          </Button>
        </Link>
        <Link to="/terms">
          <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-white/20">
            Terms
          </Button>
        </Link>
      </div>

      {/* Footer */}
      <div className="text-center mt-8 pb-8">
        <p className="text-white/80 text-sm font-medium">
          Powered by Pi Network • MRWAIN ORGANIZATION
        </p>
      </div>
    </div>
  );
};

export default HomePage;
