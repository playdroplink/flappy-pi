
import React from 'react';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';
import PiPremiumPerks from './PiPremiumPerks';
import WelcomeHeader from './welcome/WelcomeHeader';
import UserStatsCard from './welcome/UserStatsCard';
import GameModeButtons from './welcome/GameModeButtons';
import QuickActionButtons from './welcome/QuickActionButtons';
import BackgroundElements from './welcome/BackgroundElements';
import EnhancedFooter from './EnhancedFooter';
import ContactModal from './ContactModal';
import HelpModal from './HelpModal';
import PrivacyModal from './PrivacyModal';
import TermsModal from './TermsModal';
import PurchaseHistoryModal from './PurchaseHistoryModal';
import { ScrollArea } from './ui/scroll-area';
import { useState } from 'react';

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

  // Local state for modals
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showPurchaseHistory, setShowPurchaseHistory] = useState(false);

  const handlePiPremiumUpgrade = () => {
    // This could open the shop or a dedicated Pi Premium modal
    onOpenShop();
  };

  const handleOpenPrivacy = () => {
    setShowPrivacy(true);
  };

  const handleOpenTerms = () => {
    setShowTerms(true);
  };

  const handleOpenContact = () => {
    setShowContact(true);
  };

  const handleOpenHelp = () => {
    setShowHelp(true);
  };

  const handleOpenPurchaseHistory = () => {
    setShowPurchaseHistory(true);
  };

  return (
    <>
      <div className="fixed inset-0 w-full h-full flex flex-col">
        <ScrollArea className="flex-1">
          <div className="min-h-screen bg-gradient-to-br from-sky-400 via-cyan-400 to-blue-500">
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
                onOpenPurchaseHistory={handleOpenPurchaseHistory}
              />

              {/* Pi Premium Perks */}
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
          </div>
          
          {/* Enhanced Footer */}
          <EnhancedFooter />
        </ScrollArea>
      </div>

      {/* Modals */}
      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      <ContactModal isOpen={showContact} onClose={() => setShowContact(false)} />
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <PurchaseHistoryModal isOpen={showPurchaseHistory} onClose={() => setShowPurchaseHistory(false)} />
    </>
  );
};

export default WelcomeScreen;
