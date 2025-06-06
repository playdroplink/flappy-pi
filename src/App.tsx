
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from './pages/Index';
import GamePage from './pages/GamePage';
import ShopPage from './pages/ShopPage';
import LeaderboardPage from './pages/LeaderboardPage';
import SettingsPage from './pages/SettingsPage';
import SubscriptionPlansPage from './pages/SubscriptionPlansPage';
import AccountPage from './pages/AccountPage';
import HelpPage from './pages/HelpPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import NotFound from './pages/NotFound';
import PaymentHistoryPage from './pages/PaymentHistoryPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/subscription-plans" element={<SubscriptionPlansPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/payment-history" element={<PaymentHistoryPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
