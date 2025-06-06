
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Volume2, VolumeX, Music, MicOff, User, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCompleteAudioSystem } from '@/hooks/useCompleteAudioSystem';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import AudioControlPanel from '@/components/AudioControlPanel';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, signOut } = useSupabaseAuth();
  const { playSwoosh } = useCompleteAudioSystem();

  const handleNavigation = (path: string) => {
    playSwoosh();
    navigate(path);
  };

  const handleSignOut = async () => {
    playSwoosh();
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-cyan-300 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleNavigation('/')}
            className="mr-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
        </div>

        <div className="space-y-4">
          {/* Audio Settings */}
          <AudioControlPanel />

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isAuthenticated ? (
                  <UserCheck className="h-5 w-5 text-green-500" />
                ) : (
                  <User className="h-5 w-5 text-gray-500" />
                )}
                Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isAuthenticated ? (
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700">
                      <UserCheck className="h-4 w-4" />
                      <span className="font-medium">Connected to Pi Network</span>
                    </div>
                    <p className="text-sm text-green-600 mt-1">
                      Logged in as: {user?.user_metadata?.username || 'Pi User'}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleSignOut}
                    className="w-full"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-700">
                      <User className="h-4 w-4" />
                      <span className="font-medium">Guest Mode</span>
                    </div>
                    <p className="text-sm text-yellow-600 mt-1">
                      Connect Pi Network to save progress and earn rewards
                    </p>
                  </div>
                  <Button
                    onClick={() => handleNavigation('/')}
                    className="w-full bg-purple-500 hover:bg-purple-600"
                  >
                    Connect Pi Network
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Game Info */}
          <Card>
            <CardHeader>
              <CardTitle>Game Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 space-y-2">
                <p><strong>Version:</strong> 1.0.0</p>
                <p><strong>Platform:</strong> Pi Network</p>
                <p><strong>Developer:</strong> Flappy Pi Team</p>
                <p><strong>Audio System:</strong> Complete Audio Engine v2</p>
                <p className="text-xs text-gray-500 mt-4">
                  © 2025 Flappy Pi - Built for Pi Network
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
