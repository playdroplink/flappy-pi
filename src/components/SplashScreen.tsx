
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const SplashScreen = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 60); // Complete in 3 seconds (100 / 2 = 50 steps * 60ms = 3000ms)

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-sky-400 via-cyan-500 to-blue-600 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white/20 rounded-full animate-pulse"
            style={{
              width: `${4 + i * 2}px`,
              height: `${4 + i * 2}px`,
              left: `${5 + i * 6}%`,
              top: `${10 + i * 5}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2 + i * 0.2}s`
            }}
          />
        ))}
        
        {/* Animated clouds with better styling */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`cloud-${i}`}
            className="absolute bg-white/15 rounded-full animate-pulse shadow-lg"
            style={{
              width: `${60 + i * 20}px`,
              height: `${30 + i * 10}px`,
              left: `${10 + i * 12}%`,
              top: `${20 + i * 8}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '3s',
              filter: 'blur(0.5px)'
            }}
          />
        ))}
        
        {/* Geometric shapes */}
        <div className="absolute top-16 right-12 w-20 h-20 bg-white/10 rounded-full animate-bounce shadow-xl" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-8 w-16 h-16 bg-white/10 rotate-45 animate-pulse shadow-xl" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-white/10 rounded-full animate-ping shadow-xl" style={{ animationDelay: '3s' }} />
      </div>

      <div className="flex-1 flex items-center justify-center w-full px-4 relative z-10">
        <Card className="p-8 text-center w-full max-w-sm animate-scale-in bg-white/95 backdrop-blur-lg shadow-2xl border-0 rounded-2xl">
          <div className="mb-6">
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <img 
                  src="/lovable-uploads/616a87a7-bd9c-414f-a05b-09c6f7a38ef9.png" 
                  alt="Flappy Pi Logo" 
                  className="w-28 h-28 animate-bounce drop-shadow-2xl"
                />
                {/* Glow effect around logo */}
                <div className="absolute inset-0 w-28 h-28 bg-blue-400/20 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
              </div>
            </div>
            <h1 className="text-5xl font-black text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text mb-3 drop-shadow-lg">
              Flappy Pi
            </h1>
            <p className="text-gray-800 text-xl font-semibold">
              Soar to new heights with Pi Network! 🚀
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="w-full">
              <div className="mb-3">
                <Progress 
                  value={progress} 
                  className="w-full h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner" 
                />
              </div>
              <div className="flex justify-between items-center">
                <div className="text-lg text-gray-700 font-bold">
                  Loading... {progress}%
                </div>
                <div className="flex space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Enhanced branding section */}
            <div className="pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600 font-semibold mb-2">
                Powered by
              </div>
              <div className="text-lg font-black text-transparent bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text">
                mrwain organization
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SplashScreen;
