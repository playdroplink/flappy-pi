
import React from 'react';

const BackgroundElements: React.FC = () => {
  return (
    <>
      {/* Animated clouds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-white/30 text-6xl animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>
          ☁️
        </div>
        <div className="absolute top-32 right-16 text-white/30 text-4xl animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}>
          ☁️
        </div>
        <div className="absolute top-64 left-20 text-white/30 text-5xl animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.5s' }}>
          ☁️
        </div>
        <div className="absolute bottom-40 right-8 text-white/30 text-3xl animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '4.5s' }}>
          ☁️
        </div>
      </div>

      {/* Floating coins */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 right-20 text-yellow-300/50 text-2xl animate-pulse" style={{ animationDelay: '0s' }}>
          🪙
        </div>
        <div className="absolute top-80 left-16 text-yellow-300/50 text-2xl animate-pulse" style={{ animationDelay: '1s' }}>
          🪙
        </div>
        <div className="absolute bottom-60 right-32 text-yellow-300/50 text-2xl animate-pulse" style={{ animationDelay: '2s' }}>
          🪙
        </div>
      </div>

      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />
    </>
  );
};

export default BackgroundElements;
