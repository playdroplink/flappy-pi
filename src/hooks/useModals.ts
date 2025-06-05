
import { useState } from 'react';

export const useModals = () => {
  const [showShop, setShowShop] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAdPopup, setShowAdPopup] = useState(false);
  const [showShareScore, setShowShareScore] = useState(false);

  const handleShareScore = () => {
    setShowShareScore(true);
  };

  return {
    showShop,
    showLeaderboard,
    showAdPopup,
    showShareScore,
    setShowShop,
    setShowLeaderboard,
    setShowAdPopup,
    setShowShareScore,
    handleShareScore
  };
};
