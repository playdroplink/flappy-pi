
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Settings, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSoundEffects } from '@/hooks/useSoundEffects';

const HeaderMenu: React.FC = () => {
  const navigate = useNavigate();
  const { playSwoosh } = useSoundEffects();

  const handleNavigation = (path: string) => {
    playSwoosh();
    navigate(path);
  };

  return (
    <div className="fixed top-4 left-4 right-4 z-50 flex justify-between items-center">
      {/* Left side - Menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/20 rounded-xl shadow-lg"
        onClick={() => {
          // This will be handled by the existing NavigationMenu
        }}
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
        >
          <Settings className="h-5 w-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/20 rounded-xl shadow-lg"
          onClick={() => handleNavigation('/account')}
        >
          <User className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default HeaderMenu;
