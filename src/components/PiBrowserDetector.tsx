
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, ExternalLink, Smartphone } from 'lucide-react';

interface PiBrowserDetectorProps {
  children: React.ReactNode;
}

const PiBrowserDetector: React.FC<PiBrowserDetectorProps> = ({ children }) => {
  const [isPiBrowser, setIsPiBrowser] = useState<boolean | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const detectPiBrowser = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isPi = userAgent.includes('pi browser') || 
                   userAgent.includes('pibrowser') ||
                   window.location.hostname.includes('pi.app') ||
                   // For development/testing
                   process.env.NODE_ENV === 'development';
      
      setIsPiBrowser(isPi);
      
      // Show warning if not in Pi Browser (except for dev mode)
      if (!isPi && process.env.NODE_ENV === 'production') {
        setShowWarning(true);
      }
      
      console.log('🔍 Browser Detection:', {
        userAgent: navigator.userAgent,
        isPiBrowser: isPi,
        hostname: window.location.hostname,
        showWarning: !isPi && process.env.NODE_ENV === 'production'
      });
    };

    detectPiBrowser();
  }, []);

  const handleProceedAnyway = () => {
    setShowWarning(false);
    localStorage.setItem('flappypi-browser-warning-dismissed', 'true');
  };

  const openPiApp = () => {
    // Attempt to open Pi Browser if available
    window.location.href = 'pi://flappypi.pi.app';
    
    // Fallback: redirect to Pi Network download
    setTimeout(() => {
      window.open('https://minepi.com', '_blank');
    }, 2000);
  };

  // Show warning if not in Pi Browser
  if (showWarning && isPiBrowser === false) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-400 to-pink-600 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-white/95 backdrop-blur-sm border-2 border-purple-200 shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-4 bg-yellow-100 rounded-full">
              <AlertCircle className="h-12 w-12 text-yellow-600" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-800">
              Pi Browser Required
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-gray-600 mb-4 leading-relaxed">
                For the best Flappy Pi experience with full Pi Network features, 
                please open this game in the <strong>Pi Browser</strong>.
              </p>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 text-purple-800 font-semibold mb-2">
                  <Smartphone className="h-4 w-4" />
                  <span>In Pi Browser, you can:</span>
                </div>
                <ul className="text-sm text-purple-700 space-y-1 text-left">
                  <li>• Earn real Pi coins while playing</li>
                  <li>• Use Pi payments for upgrades</li>
                  <li>• Save your progress securely</li>
                  <li>• Access exclusive features</li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={openPiApp}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open in Pi Browser
              </Button>
              
              <Button
                onClick={handleProceedAnyway}
                variant="outline"
                className="w-full border-gray-300 hover:bg-gray-50"
              >
                Continue Anyway (Limited Features)
              </Button>
            </div>
            
            <p className="text-xs text-gray-500 text-center">
              Don't have Pi Browser? Download it from the Pi Network app.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default PiBrowserDetector;
