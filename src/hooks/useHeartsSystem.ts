
import { useCallback, useRef } from 'react';

interface Heart {
  x: number;
  y: number;
  id: number;
  collected: boolean;
}

interface UseHeartsSystemProps {
  level: number;
  onHeartCollected: () => void;
}

export const useHeartsSystem = ({ level, onHeartCollected }: UseHeartsSystemProps) => {
  const heartsRef = useRef<Heart[]>([]);
  const heartIdCounter = useRef(0);
  const lastHeartSpawn = useRef(0);

  const spawnHeart = useCallback((canvasWidth: number, canvasHeight: number, frameCount: number) => {
    // Only spawn hearts at level 5+ and with proper spacing
    if (level < 5 || frameCount - lastHeartSpawn.current < 600) return;
    
    // Random chance to spawn heart (lower chance for rarity)
    if (Math.random() > 0.998) {
      const newHeart: Heart = {
        x: canvasWidth + 50,
        y: Math.random() * (canvasHeight * 0.6) + (canvasHeight * 0.2), // Safe zone
        id: heartIdCounter.current++,
        collected: false
      };
      
      heartsRef.current.push(newHeart);
      lastHeartSpawn.current = frameCount;
      console.log('Heart spawned at level', level);
    }
  }, [level]);

  const updateHearts = useCallback((bird: any, maxHearts: number, currentHearts: number) => {
    const HEART_SIZE = 20;
    const BIRD_SIZE = 16;
    
    heartsRef.current = heartsRef.current.filter(heart => {
      if (heart.collected) return false;
      
      // Move heart left
      heart.x -= 2;
      
      // Remove if off screen
      if (heart.x < -50) return false;
      
      // Check collision with bird (only if not at max hearts)
      if (currentHearts < maxHearts) {
        const distance = Math.sqrt(
          Math.pow(heart.x - bird.x, 2) + Math.pow(heart.y - bird.y, 2)
        );
        
        if (distance < (HEART_SIZE + BIRD_SIZE) / 2) {
          heart.collected = true;
          onHeartCollected();
          console.log('Heart collected! Hearts:', currentHearts + 1);
          return false;
        }
      }
      
      return true;
    });
  }, [onHeartCollected]);

  const renderHearts = useCallback((ctx: CanvasRenderingContext2D) => {
    heartsRef.current.forEach(heart => {
      if (heart.collected) return;
      
      // Add floating animation
      const floatOffset = Math.sin(Date.now() * 0.005 + heart.id) * 3;
      const renderY = heart.y + floatOffset;
      
      // Draw heart (simple red heart shape)
      ctx.save();
      ctx.fillStyle = '#ff1744';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      
      // Heart shape
      const size = 10;
      ctx.beginPath();
      ctx.moveTo(heart.x, renderY + size * 0.3);
      ctx.bezierCurveTo(heart.x, renderY - size * 0.2, heart.x - size * 0.8, renderY - size * 0.2, heart.x - size * 0.4, renderY + size * 0.1);
      ctx.bezierCurveTo(heart.x - size * 0.1, renderY - size * 0.1, heart.x + size * 0.1, renderY - size * 0.1, heart.x + size * 0.4, renderY + size * 0.1);
      ctx.bezierCurveTo(heart.x + size * 0.8, renderY - size * 0.2, heart.x, renderY - size * 0.2, heart.x, renderY + size * 0.3);
      ctx.fill();
      ctx.stroke();
      
      // Add glow effect
      ctx.shadowColor = '#ff1744';
      ctx.shadowBlur = 10;
      ctx.fill();
      
      ctx.restore();
    });
  }, []);

  const resetHearts = useCallback(() => {
    heartsRef.current = [];
    lastHeartSpawn.current = 0;
    heartIdCounter.current = 0;
  }, []);

  return {
    spawnHeart,
    updateHearts,
    renderHearts,
    resetHearts
  };
};
