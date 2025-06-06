
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Volume2, VolumeX, Music, MusicOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [soundEnabled, setSoundEnabled] = React.useState(
    localStorage.getItem('flappypi-sound') !== 'false'
  );
  const [musicEnabled, setMusicEnabled] = React.useState(
    localStorage.getItem('flappypi-music') !== 'false'
  );

  const toggleSound = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    localStorage.setItem('flappypi-sound', newValue.toString());
  };

  const toggleMusic = () => {
    const newValue = !musicEnabled;
    setMusicEnabled(newValue);
    localStorage.setItem('flappypi-music', newValue.toString());
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-cyan-300 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audio Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {soundEnabled ? (
                    <Volume2 className="h-5 w-5 text-blue-500" />
                  ) : (
                    <VolumeX className="h-5 w-5 text-gray-400" />
                  )}
                  <span>Sound Effects</span>
                </div>
                <Button
                  variant={soundEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={toggleSound}
                >
                  {soundEnabled ? 'ON' : 'OFF'}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {musicEnabled ? (
                    <Music className="h-5 w-5 text-blue-500" />
                  ) : (
                    <MusicOff className="h-5 w-5 text-gray-400" />
                  )}
                  <span>Background Music</span>
                </div>
                <Button
                  variant={musicEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={toggleMusic}
                >
                  {musicEnabled ? 'ON' : 'OFF'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Game Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 space-y-2">
                <p>Version: 1.0.0</p>
                <p>Developed for Pi Network</p>
                <p>© 2025 Flappy Pi</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
