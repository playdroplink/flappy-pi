
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Settings, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSoundEffects } from '@/hooks/useSoundEffects';

interface HeaderMenuProps {
  onOpenMenu?: () => void;
}

const HeaderMenu: React.FC<HeaderMenuProps> = ({ onOpenMenu }) => {
  const navigate = useNavigate();
  const { playSwoosh } = useSoundEffects();

  const handleNavigation = (path: string) => {
    playSwoosh();
    navigate(path);
  };

  const handleMenuClick = () => {
    playSwoosh();
    if (onOpenMenu) {
      onOpenMenu();
    }
  };

  return (
    <div className="fixed top-4 left-4 right-4 z-40 flex justify-between items-center">
      {/* Left side - Menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/20 rounded-xl shadow-lg"
        onClick={handleMenuClick}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Right side - Action buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/20 rounded-xl shadow-lg"
          onClick={() => handleNavigation('/settings')}
          title="Settings"
        >
          <Settings className="h-5 w-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/20 rounded-xl shadow-lg"
          onClick={() => handleNavigation('/account')}
          title="Account"
        >
          <User className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default HeaderMenu;
