import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import ShopPage from './pages/ShopPage';
import LeaderboardPage from './pages/LeaderboardPage';
import SettingsPage from './pages/SettingsPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import ContactPage from './pages/ContactPage';
import HelpPage from './pages/HelpPage';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import { loadPiSdk } from './services/piSdkLoader';
import { piNetworkService } from './services/piNetworkService';
import { QueryClientProvider, QueryClient } from 'react-query';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import SubscriptionPlansPage from './pages/SubscriptionPlansPage';

const queryClient = new QueryClient();

function App() {
  // Initialize Pi SDK when app loads
  useEffect(() => {
    const initPiSdk = async () => {
      try {
        await loadPiSdk();
        await piNetworkService.initialize();
        console.log('Pi SDK initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Pi SDK:', error);
      }
    };
    
    initPiSdk();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/account" element={<SettingsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/subscription-plans" element={<SubscriptionPlansPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
