
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import BottomNavigation from './BottomNavigation';

const AppLayout = () => {
  const location = useLocation();
  
  // Don't show bottom nav on certain pages
  const hideBottomNav = ['/', '/play'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 relative">
      <main className={cn("min-h-screen", !hideBottomNav && "pb-20")}>
        <Outlet />
      </main>
      {!hideBottomNav && <BottomNavigation />}
    </div>
  );
};

export default AppLayout;
