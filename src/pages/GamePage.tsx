
import React from 'react';
import GameCanvas from '@/components/GameCanvas';

const GamePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-cyan-300">
      <GameCanvas />
    </div>
  );
};

export default GamePage;
