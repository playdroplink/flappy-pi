
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
    // Classic mode - standard progression
    if (currentScore < 5) {
      baseDifficulty.pipeGap = PIPE_GAP_BASE + 50;
      baseDifficulty.pipeSpeed = PIPE_SPEED_BASE * 0.8;
      baseDifficulty.spawnRate = PIPE_SPAWN_RATE_BASE + 30;
    } else if (currentScore < 15) {
      baseDifficulty.pipeGap = PIPE_GAP_BASE;
      baseDifficulty.pipeSpeed = PIPE_SPEED_BASE;
      baseDifficulty.spawnRate = PIPE_SPAWN_RATE_BASE;
    } else {
      baseDifficulty.pipeGap = PIPE_GAP_BASE - 30;
      baseDifficulty.pipeSpeed = PIPE_SPEED_BASE * 1.2;
      baseDifficulty.spawnRate = PIPE_SPAWN_RATE_BASE - 20;
      baseDifficulty.hasClouds = true;
    }
  } else if (gameMode === 'endless') {
    // Endless mode - continuous progression
    const progressionFactor = Math.min(currentScore / 50, 2); // Cap at 2x difficulty
    baseDifficulty.pipeGap = Math.max(PIPE_GAP_BASE - (progressionFactor * 50), 120);
    baseDifficulty.pipeSpeed = PIPE_SPEED_BASE * (1 + progressionFactor * 0.5);
    baseDifficulty.spawnRate = Math.max(PIPE_SPAWN_RATE_BASE - (progressionFactor * 30), 60);
    
    if (currentScore > 10) baseDifficulty.hasClouds = true;
    if (currentScore > 20) baseDifficulty.hasMovingPipes = true;
    if (currentScore > 30) {
      baseDifficulty.hasWind = true;
      baseDifficulty.windStrength = Math.min(progressionFactor * 0.3, 0.8);
    }
  } else if (gameMode === 'challenge') {
    // Challenge mode - immediate high difficulty with all obstacles
    baseDifficulty.pipeGap = PIPE_GAP_BASE - 60;
    baseDifficulty.pipeSpeed = PIPE_SPEED_BASE * 1.5;
    baseDifficulty.spawnRate = PIPE_SPAWN_RATE_BASE - 40;
    baseDifficulty.hasMovingPipes = true;
    baseDifficulty.hasClouds = true;
    
    if (currentScore > 5) {
      baseDifficulty.hasWind = true;
      baseDifficulty.windStrength = 0.5 + (currentScore * 0.1);
    }
  }

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
