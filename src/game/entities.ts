import {
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  ALIEN_WIDTH,
  ALIEN_HEIGHT,
  BULLET_WIDTH,
  BULLET_HEIGHT,
  ALIEN_BULLET_WIDTH,
  ALIEN_BULLET_HEIGHT,
  POWERUP_WIDTH,
  POWERUP_HEIGHT,
  BASE_WIDTH,
  BASE_HEIGHT,
  COLORS,
} from './constants';

export interface Position {
  x: number;
  y: number;
}

export class Player {
  x: number;
  y: number;
  width = PLAYER_WIDTH;
  height = PLAYER_HEIGHT;
  lives: number;
  shield: boolean = false;
  rapidFire: boolean = false;
  multiShot: boolean = false;
  powerUpTimer: number = 0;

  constructor(x: number, y: number, lives: number) {
    this.x = x;
    this.y = y;
    this.lives = lives;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
    gradient.addColorStop(0, this.shield ? COLORS.powerupShield : COLORS.player);
    gradient.addColorStop(1, this.shield ? '#0088cc' : '#00cc00');

    ctx.fillStyle = gradient;
    ctx.fillRect(this.x + 4, this.y, this.width - 8, 4);
    ctx.fillRect(this.x + 2, this.y + 4, this.width - 4, 4);
    ctx.fillRect(this.x, this.y + 8, this.width, this.height - 8);

    ctx.fillStyle = '#000';
    ctx.fillRect(this.x + 8, this.y + 12, 4, 8);
    ctx.fillRect(this.x + 20, this.y + 12, 4, 8);

    if (this.shield) {
      ctx.strokeStyle = COLORS.powerupShield;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2 + 4, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

export class Base {
  x: number;
  y: number;
  width = BASE_WIDTH;
  height = BASE_HEIGHT;
  pixels: boolean[][];

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.pixels = this.createBaseShape();
  }

  createBaseShape(): boolean[][] {
    // Create classic Space Invaders base shape (dome with legs)
    const shape: boolean[][] = [];
    const w = BASE_WIDTH / 4; // 4x4 pixel blocks
    const h = BASE_HEIGHT / 4;

    for (let y = 0; y < h; y++) {
      shape[y] = [];
      for (let x = 0; x < w; x++) {
        // Create dome shape
        if (y === 0) {
          shape[y][x] = x >= 3 && x <= w - 4;
        } else if (y === 1) {
          shape[y][x] = x >= 2 && x <= w - 3;
        } else if (y === 2) {
          shape[y][x] = x >= 1 && x <= w - 2;
        } else if (y === 3 || y === 4) {
          shape[y][x] = x >= 0 && x <= w - 1;
        } else if (y === 5) {
          // Create gaps (legs)
          shape[y][x] = (x >= 0 && x <= 4) || (x >= w - 5 && x <= w - 1);
        } else {
          // Legs continue
          shape[y][x] = (x >= 0 && x <= 3) || (x >= w - 4 && x <= w - 1);
        }
      }
    }

    return shape;
  }

  damageAt(x: number, y: number, radius: number = 2) {
    // Convert world coordinates to local pixel coordinates
    const localX = Math.floor((x - this.x) / 4);
    const localY = Math.floor((y - this.y) / 4);

    // Damage pixels in radius
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const px = localX + dx;
        const py = localY + dy;

        if (py >= 0 && py < this.pixels.length && px >= 0 && px < this.pixels[0].length) {
          // Circular damage pattern
          if (dx * dx + dy * dy <= radius * radius) {
            this.pixels[py][px] = false;
          }
        }
      }
    }
  }

  checkCollision(x: number, y: number, width: number, height: number): boolean {
    // Check if any part of the bullet overlaps with existing pixels
    const startX = Math.max(0, Math.floor((x - this.x) / 4));
    const endX = Math.min(this.pixels[0].length - 1, Math.floor((x + width - this.x) / 4));
    const startY = Math.max(0, Math.floor((y - this.y) / 4));
    const endY = Math.min(this.pixels.length - 1, Math.floor((y + height - this.y) / 4));

    for (let py = startY; py <= endY; py++) {
      for (let px = startX; px <= endX; px++) {
        if (this.pixels[py] && this.pixels[py][px]) {
          return true;
        }
      }
    }

    return false;
  }

  isEmpty(): boolean {
    return this.pixels.every(row => row.every(pixel => !pixel));
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = COLORS.base;
    const blockSize = 4;

    for (let y = 0; y < this.pixels.length; y++) {
      for (let x = 0; x < this.pixels[y].length; x++) {
        if (this.pixels[y][x]) {
          ctx.fillRect(
            this.x + x * blockSize,
            this.y + y * blockSize,
            blockSize,
            blockSize
          );
        }
      }
    }
  }
}

export class Alien {
  x: number;
  y: number;
  width = ALIEN_WIDTH;
  height = ALIEN_HEIGHT;
  type: number;
  animFrame: number = 0;

  constructor(x: number, y: number, type: number) {
    this.x = x;
    this.y = y;
    this.type = type;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const colors = [COLORS.alienTop, COLORS.alienMiddle, COLORS.alienBottom];
    const color = colors[this.type] || COLORS.alienBottom;

    ctx.fillStyle = color;

    const offset = this.animFrame % 2 === 0 ? 0 : 2;

    if (this.type === 0) {
      ctx.fillRect(this.x + 6, this.y, 12, 4);
      ctx.fillRect(this.x + 2, this.y + 4, 20, 12);
      ctx.fillRect(this.x + offset, this.y + 16, 6, 6);
      ctx.fillRect(this.x + 18 - offset, this.y + 16, 6, 6);
    } else if (this.type === 1) {
      ctx.fillRect(this.x + 4, this.y, 16, 4);
      ctx.fillRect(this.x, this.y + 4, 24, 12);
      ctx.fillRect(this.x + 2 + offset, this.y + 16, 8, 6);
      ctx.fillRect(this.x + 14 - offset, this.y + 16, 8, 6);
    } else {
      ctx.fillRect(this.x + 8, this.y, 8, 4);
      ctx.fillRect(this.x + 4, this.y + 4, 16, 12);
      ctx.fillRect(this.x + offset, this.y + 16, 10, 6);
      ctx.fillRect(this.x + 14 - offset, this.y + 16, 10, 6);
    }

    ctx.fillStyle = '#000';
    ctx.fillRect(this.x + 8, this.y + 6, 3, 3);
    ctx.fillRect(this.x + 13, this.y + 6, 3, 3);
  }

  updateAnimation() {
    this.animFrame++;
  }
}

export class Bullet {
  x: number;
  y: number;
  width = BULLET_WIDTH;
  height = BULLET_HEIGHT;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = COLORS.bullet;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillRect(this.x + 1, this.y, 2, this.height);
  }
}

export class AlienBullet {
  x: number;
  y: number;
  width = ALIEN_BULLET_WIDTH;
  height = ALIEN_BULLET_HEIGHT;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = COLORS.alienBullet;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillRect(this.x - 2, this.y + 4, this.width + 4, 4);
  }
}

export type PowerUpType = 'multiShot' | 'rapidFire' | 'shield';

export class PowerUp {
  x: number;
  y: number;
  width = POWERUP_WIDTH;
  height = POWERUP_HEIGHT;
  type: PowerUpType;

  constructor(x: number, y: number, type: PowerUpType) {
    this.x = x;
    this.y = y;
    this.type = type;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const colors = {
      multiShot: COLORS.powerupMulti,
      rapidFire: COLORS.powerupRapid,
      shield: COLORS.powerupShield,
    };

    ctx.fillStyle = colors[this.type];
    ctx.fillRect(this.x + 4, this.y, 16, 4);
    ctx.fillRect(this.x, this.y + 4, 24, 16);
    ctx.fillRect(this.x + 4, this.y + 20, 16, 4);

    ctx.fillStyle = '#000';
    if (this.type === 'multiShot') {
      ctx.fillRect(this.x + 6, this.y + 8, 3, 8);
      ctx.fillRect(this.x + 11, this.y + 8, 3, 8);
      ctx.fillRect(this.x + 16, this.y + 8, 3, 8);
    } else if (this.type === 'rapidFire') {
      ctx.fillRect(this.x + 8, this.y + 8, 8, 3);
      ctx.fillRect(this.x + 12, this.y + 6, 4, 12);
    } else {
      ctx.fillRect(this.x + 10, this.y + 6, 4, 6);
      ctx.fillRect(this.x + 6, this.y + 10, 12, 8);
    }
  }
}

export class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 4;
    this.vy = (Math.random() - 0.5) * 4;
    this.life = 1.0;
    this.color = COLORS.explosion[Math.floor(Math.random() * COLORS.explosion.length)];
    this.size = Math.random() * 3 + 2;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= 0.02;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.life;
    ctx.fillRect(this.x, this.y, this.size, this.size);
    ctx.globalAlpha = 1.0;
  }

  isDead() {
    return this.life <= 0;
  }
}
