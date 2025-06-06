
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
  const [showTutorial, setShowTutorial] = useState(false);
  const [adType, setAdType] = useState<'continue' | 'coins' | 'life'>('coins');

  return {
    showShop,
    showLeaderboard,
    showAdPopup,
    showShareScore,
    showPrivacy,
    showTerms,
    showContact,
    showHelp,
    showTutorial,
    adType,
    setShowShop,
    setShowLeaderboard,
    setShowAdPopup,
    setShowShareScore,
    setShowPrivacy,
    setShowTerms,
    setShowContact,
    setShowHelp,
    setShowTutorial,
    setAdType
  };
};
