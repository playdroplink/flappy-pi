
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Menu, Home, Play, ShoppingCart, Trophy, Settings, HelpCircle, Mail, Shield, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSoundEffects } from '@/hooks/useSoundEffects';

export interface NavigationMenuRef {
  openMenu: () => void;
}

const NavigationMenu = forwardRef<NavigationMenuRef>((props, ref) => {
  const navigate = useNavigate();
  const { playSwoosh } = useSoundEffects();
  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    openMenu: () => setIsOpen(true)
  }));

  const handleNavigation = (path: string) => {
    playSwoosh();
    setIsOpen(false);
    navigate(path);
  };

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Play, label: 'Play Game', path: '/game' },
    { icon: ShoppingCart, label: 'Shop', path: '/shop' },
    { icon: Trophy, label: 'Leaderboard', path: '/leaderboard' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const supportItems = [
    { icon: HelpCircle, label: 'Help & Tutorial', path: '/help' },
    { icon: Mail, label: 'Contact Us', path: '/contact' },
    { icon: Shield, label: 'Privacy Policy', path: '/privacy' },
    { icon: FileText, label: 'Terms of Service', path: '/terms' },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="left" className="w-80 bg-gradient-to-b from-sky-400 to-blue-600 border-0 z-50">
        <SheetHeader className="pb-6">
          <SheetTitle className="text-white text-2xl font-bold flex items-center gap-3">
            <img 
              src="/lovable-uploads/616a87a7-bd9c-414f-a05b-09c6f7a38ef9.png" 
              alt="Flappy Pi" 
              className="w-8 h-8"
            />
            Flappy Pi
          </SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-full pb-20">
          <div className="space-y-6">
            {/* Main Navigation */}
            <div>
              <h3 className="text-white/80 text-sm font-semibold uppercase tracking-wider mb-3">
                Main Menu
              </h3>
              <div className="space-y-2">
                {menuItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Button
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      variant="ghost"
                      className="w-full justify-start h-12 text-white hover:bg-white/20 rounded-xl text-base font-medium"
                    >
                      <IconComponent className="mr-3 h-5 w-5" />
                      {item.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            <Separator className="bg-white/20" />

            {/* Support & Legal */}
            <div>
              <h3 className="text-white/80 text-sm font-semibold uppercase tracking-wider mb-3">
                Support & Legal
              </h3>
              <div className="space-y-2">
                {supportItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Button
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      variant="ghost"
                      className="w-full justify-start h-12 text-white hover:bg-white/20 rounded-xl text-base font-medium"
                    >
                      <IconComponent className="mr-3 h-5 w-5" />
                      {item.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            <Separator className="bg-white/20" />

            {/* Quick Actions */}
            <div>
              <h3 className="text-white/80 text-sm font-semibold uppercase tracking-wider mb-3">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Button
                  onClick={() => handleNavigation('/game')}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl h-12 font-bold"
                >
                  🎮 Start Playing
                </Button>
                <Button
                  onClick={() => handleNavigation('/shop')}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl h-12 font-bold"
                >
                  💰 Visit Shop
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
});

NavigationMenu.displayName = 'NavigationMenu';

export default NavigationMenu;
