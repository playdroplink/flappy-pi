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

const PIPE_GAP_BASE = 200;
const PIPE_SPEED_BASE = 2;
const PIPE_SPAWN_RATE_BASE = 120;
const PIPE_WIDTH_BASE = 100; // Bigger pipes for better visibility

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

  // Apply user difficulty choice first
  if (userDifficulty === 'easy') {
    baseDifficulty.pipeGap = PIPE_GAP_BASE + 80; // Much wider gap
    baseDifficulty.pipeSpeed = PIPE_SPEED_BASE * 0.7; // Slower pipes
    baseDifficulty.spawnRate = PIPE_SPAWN_RATE_BASE + 60; // More time between pipes
    baseDifficulty.pipeWidth = PIPE_WIDTH_BASE + 20; // Slightly bigger pipes
  } else if (userDifficulty === 'medium') {
    baseDifficulty.pipeGap = PIPE_GAP_BASE + 40; // Moderate gap
    baseDifficulty.pipeSpeed = PIPE_SPEED_BASE * 0.85; // Normal speed
    baseDifficulty.spawnRate = PIPE_SPAWN_RATE_BASE + 20; // Normal spacing
    baseDifficulty.pipeWidth = PIPE_WIDTH_BASE; // Normal pipe size
  } else if (userDifficulty === 'hard') {
    baseDifficulty.pipeGap = PIPE_GAP_BASE; // Standard gap
    baseDifficulty.pipeSpeed = PIPE_SPEED_BASE; // Normal speed
    baseDifficulty.spawnRate = PIPE_SPAWN_RATE_BASE; // Standard spacing
    baseDifficulty.pipeWidth = PIPE_WIDTH_BASE - 10; // Slightly smaller pipes
  }

  // Apply progressive difficulty based on score (but keep user choice as base)
  const progressionFactor = Math.min(currentScore / 30, 1.5);
  
  if (gameMode === 'classic') {
    if (currentScore > 10) {
      baseDifficulty.pipeSpeed *= (1 + progressionFactor * 0.2);
      baseDifficulty.hasClouds = true;
    }
    if (currentScore > 20) {
      baseDifficulty.hasMovingPipes = userDifficulty === 'hard';
    }
  } else if (gameMode === 'endless') {
    baseDifficulty.pipeSpeed *= (1 + progressionFactor * 0.3);
    if (currentScore > 8) baseDifficulty.hasClouds = true;
    if (currentScore > 16) baseDifficulty.hasMovingPipes = true;
    if (currentScore > 24 && userDifficulty !== 'easy') {
      baseDifficulty.hasWind = true;
      baseDifficulty.windStrength = Math.min(progressionFactor * 0.2, 0.5);
    }
  } else if (gameMode === 'challenge') {
    baseDifficulty.pipeSpeed *= (1.5 + progressionFactor * 0.2);
    baseDifficulty.hasMovingPipes = true;
    baseDifficulty.hasClouds = true;
    if (userDifficulty !== 'easy') {
      baseDifficulty.hasWind = true;
      baseDifficulty.windStrength = 0.3 + (progressionFactor * 0.15);
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
