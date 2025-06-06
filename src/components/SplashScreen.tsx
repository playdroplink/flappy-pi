
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
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-sky-400 via-cyan-400 to-blue-500 flex flex-col overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating clouds */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white/20 rounded-full animate-pulse"
            style={{
              width: `${60 + i * 20}px`,
              height: `${30 + i * 10}px`,
              left: `${10 + i * 12}%`,
              top: `${20 + i * 8}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '3s'
            }}
          />
        ))}
        
        {/* Geometric shapes */}
        <div className="absolute top-20 right-10 w-16 h-16 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-8 w-12 h-12 bg-white/10 rotate-45 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-white/10 rounded-full animate-ping" style={{ animationDelay: '3s' }} />
      </div>

      <div className="flex-1 flex items-center justify-center w-full px-4">
        <Card className="p-8 text-center w-full max-w-sm animate-scale-in bg-white/95 backdrop-blur-lg shadow-2xl rounded-xl border-0">
          <div className="mb-6">
            <div className="mb-4 flex justify-center">
              <img 
                src="/lovable-uploads/616a87a7-bd9c-414f-a05b-09c6f7a38ef9.png" 
                alt="Flappy Pi Logo" 
                className="w-24 h-24 animate-bounce drop-shadow-lg"
              />
            </div>
            <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text mb-2">
              Flappy Pi
            </h1>
            <p className="text-gray-700 text-lg font-medium">
              Soar to new heights with Pi Network!
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="w-full">
              <Progress value={progress} className="w-full h-4 bg-gray-200 rounded-full overflow-hidden" />
              <div className="mt-3 text-sm text-gray-600 font-semibold">
                Loading... {progress}%
              </div>
            </div>
            <div className="text-sm text-gray-500 font-medium bg-gray-50 rounded-full px-4 py-2">
              Powered by mrwain organization
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SplashScreen;
