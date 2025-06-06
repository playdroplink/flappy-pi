export interface DifficultySettings {
  pipeGap: number;
  pipeSpeed: number;
  spawnRate: number;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  hasMovingPipes: boolean;
  hasClouds: boolean;
  hasWind: boolean;
  windStrength: number;
  pipeWidth: number;
}

const PIPE_GAP_BASE = 180; // Increased base gap for easier passage
const PIPE_SPEED_BASE = 2;
const PIPE_SPAWN_RATE_BASE = 140; // More time between pipes
const PIPE_WIDTH_BASE = 80; // Reduced pipe width for easier navigation

export const getTimeOfDay = (level: number): 'morning' | 'afternoon' | 'evening' | 'night' => {
  if (level <= 3) return 'morning';
  if (level <= 6) return 'afternoon';
  if (level <= 10) return 'evening';
  return 'night';
};

export const getDifficultyByUserChoice = (
  userDifficulty: 'easy' | 'medium' | 'hard',
  currentScore: number,
  gameMode: 'classic' | 'endless' | 'challenge'
): DifficultySettings => {
  const level = Math.floor(currentScore / 5) + 1;
  const timeOfDay = getTimeOfDay(level);
  
  console.log(`Getting difficulty for ${gameMode} mode, user choice: ${userDifficulty}, score: ${currentScore}, level: ${level}`);
  
  let baseDifficulty: DifficultySettings = {
    pipeGap: PIPE_GAP_BASE,
    pipeSpeed: PIPE_SPEED_BASE,
    spawnRate: PIPE_SPAWN_RATE_BASE,
    timeOfDay,
    hasMovingPipes: false,
    hasClouds: false,
    hasWind: false,
    windStrength: 0,
    pipeWidth: PIPE_WIDTH_BASE
  };

  // Apply user difficulty choice with much more generous settings
  if (userDifficulty === 'easy') {
    baseDifficulty.pipeGap = PIPE_GAP_BASE + 120; // Very wide gap (300px)
    baseDifficulty.pipeSpeed = PIPE_SPEED_BASE * 0.6; // Much slower
    baseDifficulty.spawnRate = PIPE_SPAWN_RATE_BASE + 80; // More time between pipes
    baseDifficulty.pipeWidth = PIPE_WIDTH_BASE - 10; // Thinner pipes
  } else if (userDifficulty === 'medium') {
    baseDifficulty.pipeGap = PIPE_GAP_BASE + 60; // Good gap (240px)
    baseDifficulty.pipeSpeed = PIPE_SPEED_BASE * 0.8; // Moderate speed
    baseDifficulty.spawnRate = PIPE_SPAWN_RATE_BASE + 40; // Normal spacing
    baseDifficulty.pipeWidth = PIPE_WIDTH_BASE; // Normal pipe size
  } else if (userDifficulty === 'hard') {
    baseDifficulty.pipeGap = PIPE_GAP_BASE + 20; // Standard gap (200px)
    baseDifficulty.pipeSpeed = PIPE_SPEED_BASE; // Normal speed
    baseDifficulty.spawnRate = PIPE_SPAWN_RATE_BASE; // Standard spacing
    baseDifficulty.pipeWidth = PIPE_WIDTH_BASE + 10; // Slightly bigger pipes
  }

  // Minimal progressive difficulty to keep game playable
  const progressionFactor = Math.min(currentScore / 50, 1.0); // Slower progression
  
  if (gameMode === 'classic') {
    if (currentScore > 15) {
      baseDifficulty.pipeSpeed *= (1 + progressionFactor * 0.1); // Very gentle speed increase
      baseDifficulty.hasClouds = true;
    }
    if (currentScore > 30) {
      baseDifficulty.hasMovingPipes = userDifficulty === 'hard';
    }
  } else if (gameMode === 'endless') {
    baseDifficulty.pipeSpeed *= (1 + progressionFactor * 0.15);
    if (currentScore > 12) baseDifficulty.hasClouds = true;
    if (currentScore > 25) baseDifficulty.hasMovingPipes = true;
    if (currentScore > 35 && userDifficulty !== 'easy') {
      baseDifficulty.hasWind = true;
      baseDifficulty.windStrength = Math.min(progressionFactor * 0.15, 0.3);
    }
  } else if (gameMode === 'challenge') {
    baseDifficulty.pipeSpeed *= (1.2 + progressionFactor * 0.1);
    baseDifficulty.hasMovingPipes = true;
    baseDifficulty.hasClouds = true;
    if (userDifficulty !== 'easy') {
      baseDifficulty.hasWind = true;
      baseDifficulty.windStrength = 0.2 + (progressionFactor * 0.1);
    }
  }

  console.log('Final difficulty settings:', baseDifficulty);
  return baseDifficulty;
};

// Keep the old function for backward compatibility
export const getDifficulty = (currentScore: number, gameMode: 'classic' | 'endless' | 'challenge'): DifficultySettings => {
  return getDifficultyByUserChoice('medium', currentScore, gameMode);
};

export const getBackgroundGradient = (timeOfDay: string): { top: string; bottom: string } => {
  switch (timeOfDay) {
    case 'morning':
      return { top: '#87CEEB', bottom: '#FFE4B5' }; // Sky blue to moccasin
    case 'afternoon':
      return { top: '#87CEEB', bottom: '#98D8E8' }; // Light blue
    case 'evening':
      return { top: '#FF7F50', bottom: '#FF6347' }; // Coral to tomato
    case 'night':
      return { top: '#191970', bottom: '#000080' }; // Midnight blue to navy
    default:
      return { top: '#87CEEB', bottom: '#98D8E8' };
  }
};

// Mode-specific scoring multipliers
export const getScoreMultiplier = (gameMode: 'classic' | 'endless' | 'challenge'): number => {
  switch (gameMode) {
    case 'classic': return 1;
    case 'endless': return 1.2;
    case 'challenge': return 1.5;
    default: return 1;
  }
};
