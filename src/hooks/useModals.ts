
import { useState } from 'react';

export const useModals = () => {
  const [showShop, setShowShop] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAdPopup, setShowAdPopup] = useState(false);
  const [showShareScore, setShowShareScore] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleShareScore = () => {
    setShowShareScore(true);
  };

  return {
    showShop,
    showLeaderboard,
    showAdPopup,
    showShareScore,
    showPrivacy,
    showTerms,
    showContact,
    showHelp,
    showProfile,
    setShowShop,
    setShowLeaderboard,
    setShowAdPopup,
    setShowShareScore,
    setShowPrivacy,
    setShowTerms,
    setShowContact,
    setShowHelp,
    setShowProfile,
    handleShareScore
  };
};
