
import { Crown, Zap, Coins, Star } from 'lucide-react';

export const BIRD_SKINS = [
  { 
    id: 'default', 
    name: 'Classic Bird', 
    piPrice: 0,
    coinPrice: 0, 
    priceType: 'free' as const,
    image: '/lovable-uploads/8ad9f53d-d0aa-4231-9042-d1890a6f997f.png',
    owned: true
  },
  { 
    id: 'red', 
    name: 'Fire Bird', 
    piPrice: 1,
    coinPrice: 50, 
    priceType: 'premium' as const,
    image: '/lovable-uploads/8ad9f53d-d0aa-4231-9042-d1890a6f997f.png',
    owned: false
  },
  { 
    id: 'blue', 
    name: 'Ice Bird', 
    piPrice: 2,
    coinPrice: 75, 
    priceType: 'premium' as const,
    image: '/lovable-uploads/8ad9f53d-d0aa-4231-9042-d1890a6f997f.png',
    owned: false
  },
  { 
    id: 'green', 
    name: 'Nature Bird', 
    piPrice: 3,
    coinPrice: 100, 
    priceType: 'premium' as const,
    image: '/lovable-uploads/8ad9f53d-d0aa-4231-9042-d1890a6f997f.png',
    owned: false
  },
  { 
    id: 'purple', 
    name: 'Mystic Bird', 
    piPrice: 5,
    coinPrice: 150, 
    priceType: 'premium' as const,
    image: '/lovable-uploads/8ad9f53d-d0aa-4231-9042-d1890a6f997f.png',
    owned: false
  },
  { 
    id: 'golden', 
    name: 'Golden Bird', 
    piPrice: 10,
    coinPrice: 300, 
    priceType: 'elite' as const,
    image: '/lovable-uploads/8ad9f53d-d0aa-4231-9042-d1890a6f997f.png',
    owned: false,
    eliteOnly: true
  },
];

export const POWER_UPS = [
  { id: 'extra_life', name: 'Extra Life', cost: 25, description: 'Start with an additional life', icon: Crown },
  { id: 'slow_motion', name: 'Slow Motion', cost: 30, description: 'Slows down time briefly', icon: Zap },
  { id: 'coin_magnet', name: 'Coin Magnet', cost: 40, description: 'Attracts nearby coins', icon: Coins },
  { id: 'shield', name: 'Shield', cost: 50, description: 'Protects from one collision', icon: Star },
];
