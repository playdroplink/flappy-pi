
import React from 'react';
import ShopModal from './ShopModal';
import LeaderboardModal from './LeaderboardModal';
import AdPopup from './AdPopup';
import ShareScoreModal from './ShareScoreModal';
import PrivacyModal from './PrivacyModal';
import TermsModal from './TermsModal';
import ContactModal from './ContactModal';
import HelpModal from './HelpModal';
import UserProfileModal from './UserProfileModal';

interface GameModalsProps {
  showShop: boolean;
  showLeaderboard: boolean;
  showAdPopup: boolean;
  showShareScore: boolean;
  showPrivacy: boolean;
  showTerms: boolean;
  showContact: boolean;
  showHelp: boolean;
  showProfile: boolean;
  adType: 'continue' | 'coins' | 'life';
  coins: number;
  score: number;
  level: number;
  highScore: number;
  selectedBirdSkin: string;
  gameState: 'menu' | 'playing' | 'gameOver' | 'paused';
  musicEnabled: boolean;
  setShowShop: (show: boolean) => void;
  setShowLeaderboard: (show: boolean) => void;
  setShowAdPopup: (show: boolean) => void;
  setShowShareScore: (show: boolean) => void;
  setShowPrivacy: (show: boolean) => void;
  setShowTerms: (show: boolean) => void;
  setShowContact: (show: boolean) => void;
  setShowHelp: (show: boolean) => void;
  setShowProfile: (show: boolean) => void;
  setCoins: (coins: number) => void;
  setSelectedBirdSkin: (skin: string) => void;
  setMusicEnabled: (enabled: boolean) => void;
  onWatchAd: (adType: 'continue' | 'coins' | 'life') => void;
}

const GameModals: React.FC<GameModalsProps> = ({
  showShop,
  showLeaderboard,
  showAdPopup,
  showShareScore,
  showPrivacy,
  showTerms,
  showContact,
  showHelp,
  showProfile,
  adType,
  coins,
  score,
  level,
  highScore,
  selectedBirdSkin,
  gameState,
  musicEnabled,
  setShowShop,
  setShowLeaderboard,
  setShowAdPopup,
  setShowShareScore,
  setShowPrivacy,
  setShowTerms,
  setShowContact,
  setShowHelp,
  setShowProfile,
  setCoins,
  setSelectedBirdSkin,
  setMusicEnabled,
  onWatchAd
}) => {
  return (
    <>
      <ShopModal
        isOpen={showShop}
        onClose={() => setShowShop(false)}
        coins={coins}
        setCoins={setCoins}
        selectedBirdSkin={selectedBirdSkin}
        setSelectedBirdSkin={setSelectedBirdSkin}
      />

      <LeaderboardModal
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
      />

      <AdPopup
        isOpen={showAdPopup}
        onClose={() => setShowAdPopup(false)}
        onWatchAd={onWatchAd}
        adType={adType}
      />

      <ShareScoreModal
        isOpen={showShareScore}
        onClose={() => setShowShareScore(false)}
        score={score}
        level={level}
        highScore={highScore}
      />

      <PrivacyModal
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
      />

      <TermsModal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
      />

      <ContactModal
        isOpen={showContact}
        onClose={() => setShowContact(false)}
      />

      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
      />

      <UserProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        coins={coins}
        highScore={highScore}
        musicEnabled={musicEnabled}
        onToggleMusic={setMusicEnabled}
      />
    </>
  );
};

export default GameModals;
