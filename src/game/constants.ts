export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;

export const PLAYER_WIDTH = 32;
export const PLAYER_HEIGHT = 24;
export const PLAYER_SPEED = 5;
export const PLAYER_LIVES = 3;

export const ALIEN_WIDTH = 24;
export const ALIEN_HEIGHT = 24;
export const ALIEN_ROWS = 5;
export const ALIEN_COLS = 11;
export const ALIEN_PADDING = 10;
export const ALIEN_START_Y = 80;
export const ALIEN_START_SPEED = 0.5;
export const ALIEN_SPEED_INCREMENT = 0.15; // Increased from 0.1 for faster escalation
export const ALIEN_SHOOT_CHANCE_BASE = 0.0003; // Reduced base chance
export const ALIEN_SHOOT_CHANCE_INCREMENT = 0.0002; // Increases per wave

export const BULLET_WIDTH = 4;
export const BULLET_HEIGHT = 12;
export const BULLET_SPEED = 7;

export const ALIEN_BULLET_WIDTH = 4;
export const ALIEN_BULLET_HEIGHT = 12;
export const ALIEN_BULLET_SPEED = 3;

export const POWERUP_WIDTH = 24;
export const POWERUP_HEIGHT = 24;
export const POWERUP_SPEED = 2;
export const POWERUP_SPAWN_CHANCE = 0.05; // Reduced from 0.15 (now 5% instead of 15%)
export const POWERUP_MIN_KILLS = 15; // Must kill at least 15 aliens before power-up can drop

export const BASE_WIDTH = 80;
export const BASE_HEIGHT = 60;
export const BASE_Y = 450;
export const NUM_BASES = 4;

export const POINTS_ALIEN_TOP = 30;
export const POINTS_ALIEN_MIDDLE = 20;
export const POINTS_ALIEN_BOTTOM = 10;

export const COLORS = {
  background: '#0a0e27',
  player: '#00ff41',
  alienTop: '#ff00ff',
  alienMiddle: '#00ffff',
  alienBottom: '#ffff00',
  bullet: '#ffffff',
  alienBullet: '#ff4444',
  powerupMulti: '#ff00ff',
  powerupRapid: '#ffaa00',
  powerupShield: '#00aaff',
  explosion: ['#ffff00', '#ff8800', '#ff0000'],
  ui: '#00ff41',
  base: '#00ff41',
};
