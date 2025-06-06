
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, User, UserCheck } from 'lucide-react';

interface WelcomeHeaderProps {
  onOpenSettings: () => void;
  onOpenAuth: () => void;
  isAuthenticated: boolean;
  username?: string;
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({
  onOpenSettings,
  onOpenAuth,
  isAuthenticated,
  username
}) => {
  return (
    <div className="flex justify-between items-center p-4">
      <Button
        variant="ghost"
        size="icon"
        className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/20 rounded-xl"
        onClick={onOpenSettings}
      >
        <Settings className="h-6 w-6" />
      </Button>

      <div className="flex items-center gap-2">
        {isAuthenticated ? (
          <div className="flex items-center gap-2 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-xl px-3 py-2">
            <UserCheck className="h-4 w-4 text-green-300" />
            <span className="text-green-100 text-sm font-medium">
              {username || 'Pi User'}
            </span>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="bg-purple-500/20 backdrop-blur-sm hover:bg-purple-500/30 text-white border border-purple-400/30 rounded-xl"
            onClick={onOpenAuth}
          >
            <User className="h-4 w-4 mr-2" />
            Connect Pi
          </Button>
        )}
      </div>
    </div>
  );
};

export default WelcomeHeader;
