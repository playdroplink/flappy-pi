
import React from 'react';

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-800 flex flex-col items-center justify-center text-white z-50 overflow-hidden">
      {/* Animated clouds in background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-16 h-10 bg-white/20 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-16 w-20 h-12 bg-white/15 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-40 left-20 w-14 h-8 bg-white/25 rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="animate-scale-in relative z-10">
        {/* Enhanced Bird Logo */}
        <div className="relative mb-6">
          <div className="text-8xl animate-bounce">
            <div className="relative inline-block">
              <div className="absolute -inset-2 bg-yellow-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-4 shadow-2xl">
                <span className="text-6xl">🐦</span>
              </div>
            </div>
          </div>
          {/* Wing flap effect */}
          <div className="absolute top-8 left-12 w-6 h-3 bg-yellow-300 rounded-full animate-ping"></div>
          <div className="absolute top-6 right-12 w-4 h-2 bg-orange-400 rounded-full animate-ping delay-150"></div>
        </div>
        
        <div className="text-center">
          <h1 className="text-7xl font-bold mb-4 text-center animate-fade-in bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 bg-clip-text text-transparent">
            Flappy Pi
          </h1>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/20">
            <p className="text-xl text-center opacity-90 animate-fade-in font-semibold">
              🚀 Powered by mrwain organization
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-3 mb-8">
          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce delay-100"></div>
          <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
      
      <div className="absolute bottom-8 text-center text-sm opacity-75 animate-fade-in">
        <p className="font-medium">© 2025 mrwain organization. All rights reserved.</p>
        <p className="text-xs mt-1">🌟 Tap to Fly, Collect Pi, Conquer the Sky! 🌟</p>
      </div>
    </div>
  );
};

export default SplashScreen;
