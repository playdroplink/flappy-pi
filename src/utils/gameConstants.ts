
// Flappy Bird Standard Constants - ensures consistency across all devices
export const FLAPPY_BIRD_CONSTANTS = {
  // Bird physics (matches original Flappy Bird)
  BIRD: {
    SIZE: 32,
    GRAVITY: 0.4,
    JUMP_VELOCITY: -8,
    MAX_VELOCITY: 10,
    ROTATION_FACTOR: 0.1,
    MAX_ROTATION: 0.5
  },
  
  // Pipe dimensions (consistent with original)
  PIPES: {
    WIDTH_DESKTOP: 80,
    WIDTH_MOBILE: 60,
    GAP_RATIO: 0.28, // 28% of screen height for gap
    MIN_HEIGHT_RATIO: 0.15, // 15% minimum pipe height
    SPAWN_DISTANCE: 200, // Distance between pipes
    SPEED_DESKTOP: 2,
    SPEED_MOBILE: 1.8
  },
  
  // Screen ratios and responsive breakpoints
  SCREEN: {
    MOBILE_BREAKPOINT: 768,
    IDEAL_ASPECT_RATIO: 9/16, // Classic Flappy Bird ratio
    MIN_GAP_PX: 120, // Minimum gap in pixels
    MAX_GAP_PX: 200, // Maximum gap in pixels
    GROUND_HEIGHT: 80
  },
  
  // Collision detection (tight hitboxes like original)
  COLLISION: {
    BIRD_HITBOX_MARGIN: 6,
    PIPE_HITBOX_MARGIN: 4,
    GROUND_MARGIN_MOBILE: 85,
    GROUND_MARGIN_DESKTOP: 70
  },
  
  // Game timing
  TIMING: {
    PIPE_SPAWN_RATE_DESKTOP: 120, // frames
    PIPE_SPAWN_RATE_MOBILE: 140,  // slightly slower on mobile
    INVULNERABILITY_TIME: 1000    // ms
  }
};

// Utility functions for responsive calculations
export const getResponsiveValue = (desktop: number, mobile: number): number => {
  return window.innerWidth <= FLAPPY_BIRD_CONSTANTS.SCREEN.MOBILE_BREAKPOINT ? mobile : desktop;
};

export const calculatePipeGap = (screenHeight: number): number => {
  const calculatedGap = screenHeight * FLAPPY_BIRD_CONSTANTS.PIPES.GAP_RATIO;
  return Math.max(
    FLAPPY_BIRD_CONSTANTS.SCREEN.MIN_GAP_PX,
    Math.min(FLAPPY_BIRD_CONSTANTS.SCREEN.MAX_GAP_PX, calculatedGap)
  );
};

export const calculatePipeWidth = (): number => {
  return getResponsiveValue(
    FLAPPY_BIRD_CONSTANTS.PIPES.WIDTH_DESKTOP,
    FLAPPY_BIRD_CONSTANTS.PIPES.WIDTH_MOBILE
  );
};

export const calculatePipeSpeed = (): number => {
  return getResponsiveValue(
    FLAPPY_BIRD_CONSTANTS.PIPES.SPEED_DESKTOP,
    FLAPPY_BIRD_CONSTANTS.PIPES.SPEED_MOBILE
  );
};
