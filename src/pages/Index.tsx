
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SplashScreen from '@/components/SplashScreen';

const Index = () => {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Show splash for 3 seconds, then redirect to home
    const timer = setTimeout(() => {
      setShowSplash(false);
      navigate('/home');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  if (!showSplash) {
    return null; // Brief moment before navigation
  }

  return <SplashScreen />;
};

export default Index;
