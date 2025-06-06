
import { Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

// Layout
import AppLayout from "./components/layout/AppLayout";

// Pages
import Index from "./pages/Index";
import HomePage from "./pages/HomePage";
import PlayPage from "./pages/PlayPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import ShopPage from "./pages/ShopPage";
import SkinsPage from "./pages/SkinsPage";
import HelpPage from "./pages/HelpPage";
import PlansPage from "./pages/PlansPage";
import ContactPage from "./pages/ContactPage";
import AccountPage from "./pages/AccountPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import NotFound from "./pages/NotFound";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  // Load Pi SDK on app initialization
  useEffect(() => {
    const loadPiSDK = () => {
      const script = document.createElement('script');
      script.src = 'https://sdk.minepi.com/pi-sdk.js';
      script.async = true;
      script.onload = () => {
        console.log('Pi SDK loaded successfully');
      };
      script.onerror = () => {
        console.error('Failed to load Pi SDK');
      };
      document.head.appendChild(script);
    };

    // Only load if not already loaded
    if (!window.Pi) {
      loadPiSDK();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen">
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600">
              <div className="text-white text-xl">Loading Flappy Pi...</div>
            </div>
          }>
            <Routes>
              {/* Splash Screen Route */}
              <Route path="/" element={<Index />} />
              
              {/* Main App Routes with Layout */}
              <Route element={<AppLayout />}>
                <Route path="/home" element={<HomePage />} />
                <Route path="/play" element={<PlayPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/skins" element={<SkinsPage />} />
                <Route path="/help" element={<HelpPage />} />
                <Route path="/plans" element={<PlansPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
              </Route>
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
