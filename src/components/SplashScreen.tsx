
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
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background patterns */}
      <div className="absolute inset-0">
        {/* Floating geometric shapes */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full animate-pulse ${
              i % 3 === 0 ? 'bg-white/10' : i % 3 === 1 ? 'bg-yellow-300/20' : 'bg-pink-300/15'
            }`}
            style={{
              width: `${20 + i * 8}px`,
              height: `${20 + i * 8}px`,
              left: `${5 + i * 8}%`,
              top: `${10 + i * 6}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2 + i * 0.2}s`
            }}
          />
        ))}
        
        {/* Animated rings */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border-4 border-white/20 rounded-full animate-spin" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 border-2 border-yellow-300/30 rounded-full animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }} />
        
        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-2 h-2 bg-white/40 rounded-full animate-bounce"
            style={{
              left: `${15 + i * 10}%`,
              top: `${20 + i * 7}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: '2s'
            }}
          />
        ))}
      </div>

      <div className="flex-1 flex items-center justify-center w-full px-6">
        <Card className="p-10 text-center w-full max-w-md animate-scale-in bg-white/95 backdrop-blur-lg border-0 shadow-2xl rounded-3xl">
          <div className="mb-8">
            {/* Enhanced logo section */}
            <div className="mb-6 flex justify-center relative">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full blur-xl opacity-30 animate-pulse" />
                <img 
                  src="/lovable-uploads/616a87a7-bd9c-414f-a05b-09c6f7a38ef9.png" 
                  alt="Flappy Pi Logo" 
                  className="w-28 h-28 relative z-10 animate-bounce drop-shadow-2xl"
                />
                {/* Orbiting elements */}
                <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s' }}>
                  <div className="absolute -top-2 left-1/2 w-3 h-3 bg-yellow-400 rounded-full transform -translate-x-1/2" />
                </div>
                <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }}>
                  <div className="absolute top-1/2 -right-2 w-2 h-2 bg-pink-400 rounded-full transform -translate-y-1/2" />
                </div>
              </div>
            </div>
            
            {/* Enhanced title */}
            <div className="mb-4">
              <h1 className="text-5xl font-black mb-2 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent drop-shadow-sm">
                Flappy Pi
              </h1>
              <div className="h-1 w-24 mx-auto bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full" />
            </div>
            
            <p className="text-gray-700 text-lg font-medium mb-2">
              🚀 Soar to new heights with Pi Network!
            </p>
            <p className="text-gray-500 text-sm">
              The ultimate blockchain gaming experience
            </p>
          </div>
          
          <div className="space-y-6">
            {/* Enhanced progress section */}
            <div className="w-full">
              <div className="mb-3">
                <Progress 
                  value={progress} 
                  className="w-full h-4 bg-gray-200 rounded-full overflow-hidden" 
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="text-lg text-gray-700 font-bold">
                  Loading... {progress}%
                </div>
                <div className="flex space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Enhanced footer */}
            <div className="pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600 font-semibold mb-1">
                Powered by
              </div>
              <div className="text-lg font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MRWAIN ORGANIZATION
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SplashScreen;
