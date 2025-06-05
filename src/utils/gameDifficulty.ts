
export interface DifficultySettings {
  pipeGap: number;
  pipeSpeed: number;
  spawnRate: number;
}

const PIPE_GAP_BASE = 200;
const PIPE_SPEED_BASE = 2;
const PIPE_SPAWN_RATE_BASE = 120;

export const getDifficulty = (currentScore: number): DifficultySettings => {
  if (currentScore < 5) {
    // Easy - first 5 points
    return {
      pipeGap: PIPE_GAP_BASE + 50, // Larger gap
      pipeSpeed: PIPE_SPEED_BASE * 0.8, // Slower speed
      spawnRate: PIPE_SPAWN_RATE_BASE + 30 // Less frequent spawning
    };
  } else if (currentScore < 15) {
    // Medium - 5-15 points
    return {
      pipeGap: PIPE_GAP_BASE,
      pipeSpeed: PIPE_SPEED_BASE,
      spawnRate: PIPE_SPAWN_RATE_BASE
    };
  } else {
    // Hard - 15+ points
    return {
      pipeGap: PIPE_GAP_BASE - 30, // Smaller gap
      pipeSpeed: PIPE_SPEED_BASE * 1.2, // Faster speed
      spawnRate: PIPE_SPAWN_RATE_BASE - 20 // More frequent spawning
    };
  }
};
