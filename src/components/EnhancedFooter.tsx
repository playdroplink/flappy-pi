
import React from 'react';
import { Heart, Globe, Mail, Users, Star, Code, Shield, FileText, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EnhancedFooter: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener noreferrer');
  };

  return (
    <footer className="bg-white text-gray-800 py-8 px-4 border-t border-gray-200">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/lovable-uploads/616a87a7-bd9c-414f-a05b-09c6f7a38ef9.png" 
                alt="Flappy Pi" 
                className="w-10 h-10"
              />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Flappy Pi
              </h3>
            </div>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Experience the ultimate Flappy Bird adventure with Pi Network integration. 
              Earn Pi coins while having fun and competing with players worldwide.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Heart className="w-4 h-4 text-red-500" />
              <span>Made with love by</span>
              <span className="text-blue-600 font-medium">mrwain organization</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-blue-600">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => handleNavigation('/leaderboard')}
                  className="text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-2"
                >
                  <Star className="w-4 h-4" />
                  <span>Leaderboard</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/help')}
                  className="text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-2"
                >
                  <Users className="w-4 h-4" />
                  <span>Community</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleExternalLink('https://github.com/mrwain/flappy-pi')}
                  className="text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-2"
                >
                  <Code className="w-4 h-4" />
                  <span>Open Source</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Documentation */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-purple-600">Documentation</h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => handleNavigation('/privacy')}
                  className="text-gray-700 hover:text-purple-600 transition-colors flex items-center space-x-2"
                >
                  <Shield className="w-4 h-4" />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/terms')}
                  className="text-gray-700 hover:text-purple-600 transition-colors flex items-center space-x-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Terms of Service</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/contact')}
                  className="text-gray-700 hover:text-purple-600 transition-colors flex items-center space-x-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Contact Us</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/help')}
                  className="text-gray-700 hover:text-purple-600 transition-colors flex items-center space-x-2"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Help & Support</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-300 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-600 text-sm">
              © 2025 mrwain organization. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <button 
                onClick={() => handleNavigation('/privacy')}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => handleNavigation('/terms')}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Terms of Service
              </button>
              <button 
                onClick={() => handleExternalLink('https://mrwain.org')}
                className="text-gray-700 hover:text-purple-600 transition-colors flex items-center space-x-2"
              >
                <Globe className="w-4 h-4" />
                <span>Website</span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-600 text-xs">Pi Network Connected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default EnhancedFooter;
