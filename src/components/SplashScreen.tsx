
import React from 'react';

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-500 via-green-600 to-emerald-700 flex flex-col items-center justify-center text-white z-50">
      <div className="animate-scale-in">
        {/* Logo placeholder - using emoji for now */}
        <div className="text-8xl mb-4 animate-bounce">🐦</div>
        
        <h1 className="text-6xl font-bold mb-2 text-center animate-fade-in">
          Flappy Pi
        </h1>
        
        <p className="text-xl mb-8 text-center opacity-90 animate-fade-in">
          Powered by mrwain organization
        </p>
        
        <div className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-100"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-200"></div>
        </div>
      </div>
      
      <div className="absolute bottom-8 text-center text-sm opacity-75">
        <p>© 2025 mrwain organization. All rights reserved.</p>
      </div>
    </div>
  );
};

export default SplashScreen;
