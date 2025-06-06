
export interface DifficultySettings {
  pipeGap: number;
  pipeSpeed: number;
  spawnRate: number;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  hasMovingPipes: boolean;
  hasClouds: boolean;
  hasWind: boolean;
  windStrength: number;
}

const PIPE_GAP_BASE = 200;
const PIPE_SPEED_BASE = 2;
const PIPE_SPAWN_RATE_BASE = 120;

export const getTimeOfDay = (level: number): 'morning' | 'afternoon' | 'evening' | 'night' => {
  if (level <= 3) return 'morning';
  if (level <= 6) return 'afternoon';
  if (level <= 10) return 'evening';
  return 'night';
};

export const getDifficulty = (currentScore: number, gameMode: 'classic' | 'endless' | 'challenge'): DifficultySettings => {
  const level = Math.floor(currentScore / 5) + 1;
  const timeOfDay = getTimeOfDay(level);
  
  console.log(`Getting difficulty for ${gameMode} mode, score: ${currentScore}, level: ${level}`);
  
  let baseDifficulty: DifficultySettings = {
    pipeGap: PIPE_GAP_BASE,
    pipeSpeed: PIPE_SPEED_BASE,
    spawnRate: PIPE_SPAWN_RATE_BASE,
    timeOfDay,
    hasMovingPipes: false,
    hasClouds: false,
    hasWind: false,
    windStrength: 0
  };

  // Apply game mode specific modifications
  if (gameMode === 'classic') {
    console.log('Applying classic mode difficulty');
    // Classic mode - gentle learning curve
    if (currentScore < 5) {
      baseDifficulty.pipeGap = PIPE_GAP_BASE + 50; // Easier start
      baseDifficulty.pipeSpeed = PIPE_SPEED_BASE * 0.8;
      baseDifficulty.spawnRate = PIPE_SPAWN_RATE_BASE + 30;
    } else if (currentScore < 15) {
      baseDifficulty.pipeGap = PIPE_GAP_BASE;
      baseDifficulty.pipeSpeed = PIPE_SPEED_BASE;
      baseDifficulty.spawnRate = PIPE_SPAWN_RATE_BASE;
    } else if (currentScore < 25) {
      baseDifficulty.pipeGap = PIPE_GAP_BASE - 20;
      baseDifficulty.pipeSpeed = PIPE_SPEED_BASE * 1.1;
      baseDifficulty.spawnRate = PIPE_SPAWN_RATE_BASE - 10;
      baseDifficulty.hasClouds = true;
    } else {
      baseDifficulty.pipeGap = PIPE_GAP_BASE - 40;
      baseDifficulty.pipeSpeed = PIPE_SPEED_BASE * 1.3;
      baseDifficulty.spawnRate = PIPE_SPAWN_RATE_BASE - 20;
      baseDifficulty.hasClouds = true;
      baseDifficulty.hasMovingPipes = currentScore > 30;
    }
  } else if (gameMode === 'endless') {
    console.log('Applying endless mode difficulty');
    // Endless mode - continuous scaling progression
    const progressionFactor = Math.min(currentScore / 40, 3); // Cap at 3x difficulty
    baseDifficulty.pipeGap = Math.max(PIPE_GAP_BASE - (progressionFactor * 40), 100);
    baseDifficulty.pipeSpeed = PIPE_SPEED_BASE * (1 + progressionFactor * 0.4);
    baseDifficulty.spawnRate = Math.max(PIPE_SPAWN_RATE_BASE - (progressionFactor * 25), 50);
    
    // Add features progressively
    if (currentScore > 8) baseDifficulty.hasClouds = true;
    if (currentScore > 16) baseDifficulty.hasMovingPipes = true;
    if (currentScore > 24) {
      baseDifficulty.hasWind = true;
      baseDifficulty.windStrength = Math.min(progressionFactor * 0.25, 0.6);
    }
  } else if (gameMode === 'challenge') {
    console.log('Applying challenge mode difficulty');
    // Challenge mode - immediate high difficulty with all obstacles
    const challengeFactor = Math.min(currentScore / 20, 2);
    baseDifficulty.pipeGap = Math.max(PIPE_GAP_BASE - 70 - (challengeFactor * 20), 80);
    baseDifficulty.pipeSpeed = PIPE_SPEED_BASE * (1.8 + challengeFactor * 0.3);
    baseDifficulty.spawnRate = Math.max(PIPE_SPAWN_RATE_BASE - 50 - (challengeFactor * 15), 40);
    
    // All obstacles enabled from start
    baseDifficulty.hasMovingPipes = true;
    baseDifficulty.hasClouds = true;
    baseDifficulty.hasWind = true;
    baseDifficulty.windStrength = 0.4 + (challengeFactor * 0.2);
  }

  console.log('Final difficulty settings:', baseDifficulty);
  return baseDifficulty;
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
