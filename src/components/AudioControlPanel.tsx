
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Volume2, VolumeX, Music, MusicOff, Headphones } from 'lucide-react';
import { useCompleteAudioSystem } from '@/hooks/useCompleteAudioSystem';

const AudioControlPanel: React.FC = () => {
  const {
    toggleBackgroundMusic,
    setMusicVolume,
    setSfxVolume,
    isAudioUnlocked,
    isMusicPlaying,
    unlockAudio
  } = useCompleteAudioSystem();

  const [musicVolume, setMusicVolumeLocal] = React.useState(0.3);
  const [sfxVolume, setSfxVolumeLocal] = React.useState(0.6);

  const handleMusicVolumeChange = (value: number) => {
    setMusicVolumeLocal(value);
    setMusicVolume(value);
  };

  const handleSfxVolumeChange = (value: number) => {
    setSfxVolumeLocal(value);
    setSfxVolume(value);
  };

  if (!isAudioUnlocked) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Headphones className="h-5 w-5" />
            Audio System
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Click to unlock audio for the best Flappy Pi experience!
          </p>
          <Button onClick={unlockAudio} className="w-full">
            <Volume2 className="mr-2 h-4 w-4" />
            Unlock Audio
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Headphones className="h-5 w-5" />
          Audio Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Background Music Control */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isMusicPlaying ? (
              <Music className="h-5 w-5 text-blue-500" />
            ) : (
              <MusicOff className="h-5 w-5 text-gray-400" />
            )}
            <span>Background Music</span>
          </div>
          <Button
            variant={isMusicPlaying ? "default" : "outline"}
            size="sm"
            onClick={toggleBackgroundMusic}
          >
            {isMusicPlaying ? 'ON' : 'OFF'}
          </Button>
        </div>

        {/* Music Volume */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Music Volume</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={musicVolume}
            onChange={(e) => handleMusicVolumeChange(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* SFX Volume */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Sound Effects Volume</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={sfxVolume}
            onChange={(e) => handleSfxVolumeChange(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="text-xs text-gray-500 text-center">
          🎵 Audio Status: {isAudioUnlocked ? 'Unlocked' : 'Locked'}
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioControlPanel;
