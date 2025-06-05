
import React from 'react';

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-sky-400 via-sky-500 to-sky-600 flex flex-col items-center justify-center text-white z-50 overflow-hidden">
      {/* Modern geometric background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-white rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-16 w-4 h-4 bg-white/20 rounded-full animate-float"></div>
        <div className="absolute top-32 right-20 w-6 h-6 bg-white/15 rounded-lg animate-float delay-300"></div>
        <div className="absolute bottom-40 left-24 w-3 h-3 bg-white/25 rounded-full animate-float delay-700"></div>
        <div className="absolute top-1/2 right-16 w-5 h-5 bg-white/20 rounded-lg animate-float delay-1000"></div>
      </div>

      <div className="relative z-10 text-center animate-scale-in">
        {/* Modern centered bird logo */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-sky-300/30 to-sky-500/30 rounded-full blur-xl animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-full p-6 border border-white/30 shadow-2xl">
              <img 
                src="/lovable-uploads/5a55528e-3d0c-4cd3-91d9-6b8cff953b06.png" 
                alt="Flappy Pi Bird" 
                className="w-20 h-20 object-contain animate-bounce"
              />
            </div>
            {/* Floating particles around bird */}
            <div className="absolute -top-2 -right-2 w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div>
            <div className="absolute -bottom-2 -left-2 w-1.5 h-1.5 bg-white rounded-full animate-ping delay-150"></div>
          </div>
        </div>
        
        {/* Modern typography */}
        <div className="space-y-4">
          <h1 className="text-6xl md:text-7xl font-bold mb-2 animate-fade-in">
            <span className="bg-gradient-to-r from-white via-sky-100 to-white bg-clip-text text-transparent">
              Flappy
            </span>
            <span className="ml-2 bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-200 bg-clip-text text-transparent">
              Pi
            </span>
          </h1>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/20 shadow-lg">
            <p className="text-lg font-medium text-sky-100">
              ⚡ Powered by <span className="font-bold text-white">mrwain organization</span>
            </p>
          </div>
        </div>
        
        {/* Modern loading indicator */}
        <div className="flex items-center justify-center space-x-2 mt-8">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-white/80 rounded-full animate-bounce delay-75"></div>
            <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce delay-150"></div>
          </div>
          <span className="ml-3 text-sm font-medium text-sky-100 animate-pulse">Loading...</span>
        </div>
      </div>
      
      {/* Modern footer */}
      <div className="absolute bottom-8 text-center animate-fade-in">
        <p className="text-sm font-medium text-sky-100 mb-1">© 2025 mrwain organization</p>
        <p className="text-xs text-sky-200 opacity-80">🌟 Tap to Fly • Collect Pi • Conquer the Sky 🌟</p>
      </div>
    </div>
  );
};

export default SplashScreen;
