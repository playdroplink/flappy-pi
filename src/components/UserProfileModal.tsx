
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, Trophy, Calendar, GamepadIcon, Music, Bell } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useToast } from '@/hooks/use-toast';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  coins: number;
  highScore: number;
  musicEnabled: boolean;
  onToggleMusic: (enabled: boolean) => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  coins,
  highScore,
  musicEnabled,
  onToggleMusic
}) => {
  const { profile, updateProfile, loading } = useUserProfile();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState('');

  React.useEffect(() => {
    if (profile && isOpen) {
      setEditedUsername(profile.username);
    }
  }, [profile, isOpen]);

  const handleSaveProfile = async () => {
    if (!profile) return;

    try {
      await updateProfile({
        username: editedUsername.trim(),
        music_enabled: musicEnabled
      });
      
      setIsEditing(false);
      toast({
        title: "Profile Updated! ✨",
        description: "Your profile has been successfully updated."
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCancelEdit = () => {
    if (profile) {
      setEditedUsername(profile.username);
    }
    setIsEditing(false);
  };

  const getUserInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase();
  };

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!profile) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl text-gray-800">
            👤 Player Profile
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback className="bg-blue-500 text-white text-xl">
                {getUserInitials(profile.username)}
              </AvatarFallback>
            </Avatar>
            
            {isEditing ? (
              <div className="flex flex-col items-center space-y-2">
                <Input
                  value={editedUsername}
                  onChange={(e) => setEditedUsername(e.target.value)}
                  className="text-center font-semibold"
                  placeholder="Enter username"
                />
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleSaveProfile} 
                    size="sm"
                    disabled={loading || !editedUsername.trim()}
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </Button>
                  <Button 
                    onClick={handleCancelEdit} 
                    variant="outline" 
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <h3 className="text-xl font-bold text-gray-800">{profile.username}</h3>
                <Button 
                  onClick={() => setIsEditing(true)} 
                  variant="outline" 
                  size="sm"
                >
                  Edit Profile
                </Button>
              </div>
            )}
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>Joined {formatJoinDate(profile.created_at)}</span>
            </div>
          </div>

          <Separator />

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center space-x-2">
                  <Coins className="h-4 w-4 text-yellow-500" />
                  <span>Pi Coins</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {coins.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center space-x-2">
                  <Trophy className="h-4 w-4 text-orange-500" />
                  <span>High Score</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {highScore.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <GamepadIcon className="h-5 w-5" />
              <span>Game Settings</span>
            </h4>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Music className="h-5 w-5 text-gray-600" />
                  <div>
                    <Label className="text-sm font-medium">Background Music</Label>
                    <p className="text-xs text-gray-500">Enable or disable game music</p>
                  </div>
                </div>
                <Switch
                  checked={musicEnabled}
                  onCheckedChange={onToggleMusic}
                />
              </div>
            </div>
          </div>

          {/* Bird Skin Badge */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Current Bird Skin</h4>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                🐦
              </div>
              <div>
                <Badge variant="secondary" className="mb-1">
                  {profile.selected_bird_skin === 'default' ? 'Blue Buddy' : 
                   profile.selected_bird_skin === 'green' ? 'Emerald Flyer' :
                   profile.selected_bird_skin === 'red' ? 'Ruby Racer' : 
                   'Unknown Skin'}
                </Badge>
                <p className="text-xs text-gray-500">Visit the shop to unlock more skins!</p>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Profile Info</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div>Player ID: {profile.pi_user_id.slice(-8)}...</div>
              <div>Total Coins Earned: {profile.total_coins.toLocaleString()}</div>
              <div>Profile Updated: {formatJoinDate(profile.updated_at)}</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileModal;
