
import React from 'react';
import ShopModal from './ShopModal';
import LeaderboardModal from './LeaderboardModal';
import AdPopup from './AdPopup';
import ShareScoreModal from './ShareScoreModal';
import PrivacyModal from './PrivacyModal';
import TermsModal from './TermsModal';
import ContactModal from './ContactModal';
import HelpModal from './HelpModal';
import DailyRewards from './DailyRewards';
import MandatoryAdModal from './MandatoryAdModal';
import AdFreeSubscriptionModal from './AdFreeSubscriptionModal';

interface GameModalsProps {
  showShop: boolean;
  showLeaderboard: boolean;
  showAdPopup: boolean;
  showShareScore: boolean;
  showPrivacy: boolean;
  showTerms: boolean;
  showContact: boolean;
  showHelp: boolean;
  showDailyRewards: boolean;
  showMandatoryAd: boolean;
  showAdFreeModal: boolean;
  adType: 'continue' | 'coins' | 'life';
  coins: number;
  score: number;
  level: number;
  highScore: number;
  selectedBirdSkin: string;
  gameState: 'menu' | 'playing' | 'gameOver' | 'paused';
  setShowShop: (show: boolean) => void;
  setShowLeaderboard: (show: boolean) => void;
  setShowAdPopup: (show: boolean) => void;
  setShowShareScore: (show: boolean) => void;
  setShowPrivacy: (show: boolean) => void;
  setShowTerms: (show: boolean) => void;
  setShowContact: (show: boolean) => void;
  setShowHelp: (show: boolean) => void;
  setShowDailyRewards: (show: boolean) => void;
  setCoins: (coins: number) => void;
  setSelectedBirdSkin: (skin: string) => void;
  onWatchAd: (adType: 'continue' | 'coins' | 'life') => void;
  onNewGame: () => void;
  onBackToMenu: () => void;
  onCloseLeaderboard: () => void;
  onCloseShop: () => void;
  onCloseHelp: () => void;
  onClosePrivacy: () => void;
  onCloseTerms: () => void;
  onCloseContact: () => void;
  onCloseShareScore: () => void;
  onCloseDailyRewards: () => void;
  onSkinSelect: (skin: string) => void;
  onPurchase: () => void;
  onWatchMandatoryAd: () => void;
  onCloseAdFreeModal: () => void;
  onClaimDailyReward: () => Promise<any>;
  adSystem: {
    isAdFree: boolean;
    purchaseAdFree: () => Promise<boolean>;
    adFreeTimeRemaining: { days: number; hours: number } | null;
    resetAdCounter: () => void;
    incrementGameCount: () => void;
  };
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
  showDailyRewards,
  showMandatoryAd,
  showAdFreeModal,
  adType,
  coins,
  score,
  level,
  highScore,
  selectedBirdSkin,
  gameState,
  setShowShop,
  setShowLeaderboard,
  setShowAdPopup,
  setShowShareScore,
  setShowPrivacy,
  setShowTerms,
  setShowContact,
  setShowHelp,
  setShowDailyRewards,
  setCoins,
  setSelectedBirdSkin,
  onWatchAd,
  onNewGame,
  onBackToMenu,
  onCloseLeaderboard,
  onCloseShop,
  onCloseHelp,
  onClosePrivacy,
  onCloseTerms,
  onCloseContact,
  onCloseShareScore,
  onCloseDailyRewards,
  onSkinSelect,
  onPurchase,
  onWatchMandatoryAd,
  onCloseAdFreeModal,
  onClaimDailyReward,
  adSystem
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
        selectedBirdSkin={selectedBirdSkin}
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

      <DailyRewards
        isOpen={showDailyRewards}
        onClose={() => setShowDailyRewards(false)}
        onClaimReward={onClaimDailyReward}
      />

      <MandatoryAdModal
        isOpen={showMandatoryAd}
        onWatchAd={onWatchMandatoryAd}
        onUpgradeToPremium={adSystem.purchaseAdFree}
        canUpgrade={!adSystem.isAdFree}
      />

      <AdFreeSubscriptionModal
        isOpen={showAdFreeModal}
        onClose={onCloseAdFreeModal}
        onPurchase={adSystem.purchaseAdFree}
        timeRemaining={adSystem.adFreeTimeRemaining}
      />
    </>
  );
};

export default GameModals;
