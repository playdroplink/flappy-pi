
import React from 'react';
import { Heart, Globe, Mail, Users, Star, Code } from 'lucide-react';

const EnhancedFooter: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white py-8 px-4">
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
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Flappy Pi
              </h3>
            </div>
            <p className="text-white mb-4 leading-relaxed">
              Experience the ultimate Flappy Bird adventure with Pi Network integration. 
              Earn Pi coins while having fun and competing with players worldwide.
            </p>
            <div className="flex items-center space-x-2 text-sm text-white">
              <Heart className="w-4 h-4 text-red-400" />
              <span>Made with love by</span>
              <span className="text-blue-400 font-medium">mrwain organization</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-blue-400">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <button className="text-white hover:text-blue-300 transition-colors flex items-center space-x-2">
                  <Star className="w-4 h-4" />
                  <span>Leaderboard</span>
                </button>
              </li>
              <li>
                <button className="text-white hover:text-blue-300 transition-colors flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Community</span>
                </button>
              </li>
              <li>
                <button className="text-white hover:text-blue-300 transition-colors flex items-center space-x-2">
                  <Code className="w-4 h-4" />
                  <span>Open Source</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-purple-400">Connect</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="mailto:support@mrwain.org" 
                  className="text-white hover:text-purple-300 transition-colors flex items-center space-x-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Support</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://mrwain.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:text-purple-300 transition-colors flex items-center space-x-2"
                >
                  <Globe className="w-4 h-4" />
                  <span>Website</span>
                </a>
              </li>
              <li>
                <span className="text-white text-sm">Pi Network Official</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-600 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-white text-sm">
              © 2025 mrwain organization. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <button className="text-white hover:text-blue-300 transition-colors">
                Privacy Policy
              </button>
              <button className="text-white hover:text-blue-300 transition-colors">
                Terms of Service
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-xs">Pi Network Connected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default EnhancedFooter;
