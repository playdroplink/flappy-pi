
import { useState, useCallback } from 'react';

type GameMode = 'menu' | 'classic' | 'endless' | 'challenge';

export const useGameState = () => {
  const [gameMode, setGameMode] = useState<GameMode>('menu');
  const [coins, setCoins] = useState(() => {
    const saved = localStorage.getItem('flappypi-coins');
    return saved ? parseInt(saved) : 0;
  });
  const [musicEnabled, setMusicEnabled] = useState(() => {
    const saved = localStorage.getItem('flappypi-music-enabled');
    return saved ? JSON.parse(saved) : true;
  });

  const onToggleMusic = useCallback((enabled: boolean) => {
    setMusicEnabled(enabled);
    localStorage.setItem('flappypi-music-enabled', JSON.stringify(enabled));
  }, []);

  const onStartGame = useCallback((mode: 'classic' | 'endless' | 'challenge') => {
    console.log('🎮 Starting game mode:', mode);
    setGameMode(mode);
  }, []);

  const onOpenShop = useCallback(() => {
    console.log('🛍️ Opening shop');
    // Shop modal logic would be handled by the parent component
  }, []);

  const onOpenLeaderboard = useCallback(() => {
    console.log('🏆 Opening leaderboard');
    // Leaderboard modal logic would be handled by the parent component
  }, []);

  const onOpenPrivacy = useCallback(() => {
    console.log('📄 Opening privacy policy');
    window.open('/privacy', '_blank');
  }, []);

  const onOpenTerms = useCallback(() => {
    console.log('📜 Opening terms of service');
    window.open('/terms', '_blank');
  }, []);

  const onOpenContact = useCallback(() => {
    console.log('📧 Opening contact');
    window.open('mailto:support@flappypi.com', '_blank');
  }, []);

  const onOpenHelp = useCallback(() => {
    console.log('❓ Opening help');
    // Help modal logic would be handled by the parent component
  }, []);

  const onOpenTutorial = useCallback(() => {
    console.log('📚 Opening tutorial');
    // Tutorial modal logic would be handled by the parent component
  }, []);

  return {
    gameMode,
    coins,
    musicEnabled,
    setCoins,
    onToggleMusic,
    onStartGame,
    onOpenShop,
    onOpenLeaderboard,
    onOpenPrivacy,
    onOpenTerms,
    onOpenContact,
    onOpenHelp,
    onOpenTutorial
  };
};
