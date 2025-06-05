
import React from 'react';
import ShopModal from './ShopModal';
import LeaderboardModal from './LeaderboardModal';
import AdPopup from './AdPopup';
import ShareScoreModal from './ShareScoreModal';

interface GameModalsProps {
  showShop: boolean;
  showLeaderboard: boolean;
  showAdPopup: boolean;
  showShareScore: boolean;
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
  setCoins: (coins: number) => void;
  setSelectedBirdSkin: (skin: string) => void;
  onWatchAd: (adType: 'continue' | 'coins' | 'life') => void;
}

const GameModals: React.FC<GameModalsProps> = ({
  showShop,
  showLeaderboard,
  showAdPopup,
  showShareScore,
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
  setCoins,
  setSelectedBirdSkin,
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
        onClose={() => {
          setShowAdPopup(false);
          if (gameState === 'gameOver') {
            // Stay on game over screen if ad is closed without watching
          }
        }}
        onWatchAd={onWatchAd}
        adType="continue"
      />

      <ShareScoreModal
        isOpen={showShareScore}
        onClose={() => setShowShareScore(false)}
        score={score}
        level={level}
        highScore={highScore}
      />
    </>
  );
};

export default GameModals;
