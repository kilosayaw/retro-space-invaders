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
