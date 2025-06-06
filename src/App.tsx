
import { Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Index from "./pages/Index";
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
        <div className="min-h-screen bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600">
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-white text-xl">Loading Flappy Pi...</div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Index />} />
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
