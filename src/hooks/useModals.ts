
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
  const [adType, setAdType] = useState<'continue' | 'coins' | 'life'>('coins');

  const handleShareScore = () => {
    setShowShareScore(true);
  };

  const showAdWithType = (type: 'continue' | 'coins' | 'life') => {
    setAdType(type);
    setShowAdPopup(true);
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
    adType,
    setShowShop,
    setShowLeaderboard,
    setShowAdPopup,
    setShowShareScore,
    setShowPrivacy,
    setShowTerms,
    setShowContact,
    setShowHelp,
    setShowProfile,
    setAdType,
    handleShareScore,
    showAdWithType
  };
};
