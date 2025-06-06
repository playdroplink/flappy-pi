
import React, { useRef, useState } from 'react';
import { useGameState } from '../hooks/useGameState';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';
import { useNavigate } from 'react-router-dom';
import EnhancedFooter from '../components/EnhancedFooter';
import NavigationMenu, { NavigationMenuRef } from '../components/NavigationMenu';
import HeaderMenu from '../components/home/HeaderMenu';
import { ScrollArea } from '../components/ui/scroll-area';
import HomeHeader from '../components/home/HomeHeader';
import UserStatsSection from '../components/home/UserStatsSection';
import TutorialButton from '../components/home/TutorialButton';
import GameModeSection from '../components/home/GameModeSection';
import QuickActions from '../components/home/QuickActions';
import HomeFooterNav from '../components/home/HomeFooterNav';
import BackgroundDecoration from '../components/home/BackgroundDecoration';
import ContactModal from '../components/ContactModal';
import HelpModal from '../components/HelpModal';
import PrivacyModal from '../components/PrivacyModal';
import TermsModal from '../components/TermsModal';

const HomePage: React.FC = () => {
  const gameState = useGameState();
  const { playSwoosh } = useSoundEffects();
  const navigate = useNavigate();
  const navigationMenuRef = useRef<NavigationMenuRef>(null);

  // Modal states
  const [showContact, setShowContact] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  // Add background music
  useBackgroundMusic({ musicEnabled: gameState.musicEnabled, gameState: 'menu' });

  const handleNavigation = (path: string) => {
    playSwoosh();
    
    // Handle modal routes
    if (path === '/contact') {
      setShowContact(true);
      return;
    }
    if (path === '/help') {
      setShowHelp(true);
      return;
    }
    if (path === '/privacy') {
      setShowPrivacy(true);
      return;
    }
    if (path === '/terms') {
      setShowTerms(true);
      return;
    }
    
    // Navigate to actual pages
    navigate(path);
  };

  const handleGameModeSelect = (mode: 'classic' | 'endless' | 'challenge') => {
    playSwoosh();
    gameState.startGame(mode);
    navigate('/play');
  };

  const handleOpenMenu = () => {
    navigationMenuRef.current?.openMenu();
  };

  const handleOpenTutorial = () => {
    setShowHelp(true);
  };

  return (
    <>
      <div className="fixed inset-0 w-full h-full flex flex-col">
        {/* Navigation Menu */}
        <NavigationMenu ref={navigationMenuRef} />
        
        {/* Header Menu */}
        <HeaderMenu onOpenMenu={handleOpenMenu} />
        
        {/* Scrollable Content Area */}
        <ScrollArea className="flex-1">
          <div className="min-h-screen bg-gradient-to-br from-sky-400 via-cyan-400 to-blue-500">
            {/* Animated background elements */}
            <BackgroundDecoration />

            {/* Header Section with proper top padding to account for header menu */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 pt-20 max-w-md mx-auto w-full">
              {/* Logo and Title */}
              <HomeHeader />

              {/* User Stats Card */}
              <UserStatsSection 
                coins={gameState.coins}
                musicEnabled={gameState.musicEnabled}
                onToggleMusic={gameState.setMusicEnabled}
              />

              {/* Tutorial Button */}
              <TutorialButton onOpenTutorial={handleOpenTutorial} />

              {/* Game Modes */}
              <GameModeSection onSelectGameMode={handleGameModeSelect} />

              {/* Quick Actions */}
              <QuickActions 
                onOpenShop={() => handleNavigation('/shop')}
                onOpenLeaderboard={() => handleNavigation('/leaderboard')}
              />
            </div>

            {/* Footer Navigation */}
            <HomeFooterNav onNavigate={handleNavigation} />
          </div>
          
          {/* Enhanced Footer */}
          <EnhancedFooter />
        </ScrollArea>
      </div>

      {/* Modals */}
      <ContactModal isOpen={showContact} onClose={() => setShowContact(false)} />
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
    </>
  );
};

export default HomePage;
