
import React from 'react';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';
import BannerAd from './BannerAd';
import PiPremiumPerks from './PiPremiumPerks';
import WelcomeHeader from './welcome/WelcomeHeader';
import UserStatsCard from './welcome/UserStatsCard';
import GameModeButtons from './welcome/GameModeButtons';
import QuickActionButtons from './welcome/QuickActionButtons';
import WelcomeFooter from './welcome/WelcomeFooter';
import BackgroundElements from './welcome/BackgroundElements';

type GameMode = 'classic' | 'endless' | 'challenge';

interface WelcomeScreenProps {
  onStartGame: (mode: GameMode) => void;
  onOpenShop: () => void;
  onOpenLeaderboard: () => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenContact: () => void;
  onOpenHelp: () => void;
  onOpenTutorial: () => void;
  coins: number;
  musicEnabled: boolean;
  onToggleMusic: (enabled: boolean) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStartGame,
  onOpenShop,
  onOpenLeaderboard,
  onOpenPrivacy,
  onOpenTerms,
  onOpenContact,
  onOpenHelp,
  onOpenTutorial,
  coins,
  musicEnabled,
  onToggleMusic
}) => {
  // Add background music
  useBackgroundMusic({ musicEnabled, gameState: 'menu' });

  const handlePiPremiumUpgrade = () => {
    // This could open the shop or a dedicated Pi Premium modal
    onOpenShop();
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-sky-400 via-cyan-400 to-blue-500 flex flex-col overflow-hidden">
      {/* Banner Ad */}
      <BannerAd position="bottom" autoHide={true} hideDelay={8000} />

      {/* Animated background elements */}
      <BackgroundElements />

      {/* Header Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-md mx-auto w-full">
        {/* Logo and Title */}
        <WelcomeHeader />

        {/* User Stats Card */}
        <UserStatsCard 
          coins={coins}
          musicEnabled={musicEnabled}
          onToggleMusic={onToggleMusic}
        />

        {/* Pi Premium Perks - Show occasionally */}
        <div className="w-full mb-4 animate-fade-in" style={{ animationDelay: '0.25s' }}>
          <PiPremiumPerks onUpgrade={handlePiPremiumUpgrade} />
        </div>

        {/* Game Mode Buttons */}
        <GameModeButtons 
          onStartGame={onStartGame}
          onOpenTutorial={onOpenTutorial}
        />

        {/* Quick Actions */}
        <QuickActionButtons 
          onOpenShop={onOpenShop}
          onOpenLeaderboard={onOpenLeaderboard}
        />
      </div>

      {/* Footer */}
      <WelcomeFooter 
        onOpenPrivacy={onOpenPrivacy}
        onOpenTerms={onOpenTerms}
        onOpenContact={onOpenContact}
        onOpenHelp={onOpenHelp}
      />
    </div>
  );
};

export default WelcomeScreen;
