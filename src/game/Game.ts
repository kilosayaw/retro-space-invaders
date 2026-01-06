import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PLAYER_WIDTH,
  PLAYER_SPEED,
  PLAYER_LIVES,
  ALIEN_ROWS,
  ALIEN_COLS,
  ALIEN_PADDING,
  ALIEN_START_Y,
  ALIEN_WIDTH,
  ALIEN_START_SPEED,
  ALIEN_SPEED_INCREMENT,
  BULLET_SPEED,
  ALIEN_BULLET_SPEED,
  ALIEN_SHOOT_CHANCE,
  POWERUP_SPEED,
  POWERUP_SPAWN_CHANCE,
  POINTS_ALIEN_TOP,
  POINTS_ALIEN_MIDDLE,
  POINTS_ALIEN_BOTTOM,
  BASE_WIDTH,
  BASE_Y,
  NUM_BASES,
  COLORS,
} from './constants';
import {
  Player,
  Alien,
  Bullet,
  AlienBullet,
  PowerUp,
  PowerUpType,
  Particle,
  Base,
} from './entities';
import { audioManager } from './audio';

export type GameState = 'menu' | 'playing' | 'paused' | 'gameOver' | 'waveComplete';

export class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  state: GameState = 'menu';
  score: number = 0;
  wave: number = 1;
  aliensDefeated: number = 0;

  player: Player;
  aliens: Alien[] = [];
  bullets: Bullet[] = [];
  alienBullets: AlienBullet[] = [];
  powerUps: PowerUp[] = [];
  particles: Particle[] = [];
  bases: Base[] = [];

  alienDirection: number = 1;
  alienSpeed: number = ALIEN_START_SPEED;
  alienMoveDown: boolean = false;
  alienAnimTimer: number = 0;

  keys: { [key: string]: boolean } = {};
  shootCooldown: number = 0;
  waveCompleteTimer: number = 0;

  onGameOver?: (score: number, wave: number, aliensDefeated: number) => void;
  onWaveComplete?: (score: number, wave: number, aliensDefeated: number) => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;

    this.player = new Player(
      CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
      CANVAS_HEIGHT - 60,
      PLAYER_LIVES
    );

    this.setupEventListeners();
    this.spawnBases();
  }

  setupEventListeners() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;

      if (e.key === ' ') {
        e.preventDefault();
      }

      if (e.key.toLowerCase() === 'p' && this.state === 'playing') {
        this.state = 'paused';
      } else if (e.key.toLowerCase() === 'p' && this.state === 'paused') {
        this.state = 'playing';
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });
  }

  spawnBases() {
    this.bases = [];
    const spacing = CANVAS_WIDTH / (NUM_BASES + 1);

    for (let i = 0; i < NUM_BASES; i++) {
      const x = spacing * (i + 1) - BASE_WIDTH / 2;
      this.bases.push(new Base(x, BASE_Y));
    }
  }

  startGame() {
    this.state = 'playing';
    this.score = 0;
    this.wave = 1;
    this.aliensDefeated = 0;
    this.player.lives = PLAYER_LIVES;
    this.player.shield = false;
    this.player.rapidFire = false;
    this.player.multiShot = false;
    this.player.powerUpTimer = 0;
    this.bullets = [];
    this.alienBullets = [];
    this.powerUps = [];
    this.particles = [];
    this.alienSpeed = ALIEN_START_SPEED;
    this.spawnAliens();
    this.spawnBases();
  }

  spawnAliens() {
    this.aliens = [];
    const totalWidth = ALIEN_COLS * (ALIEN_WIDTH + ALIEN_PADDING);
    const startX = (CANVAS_WIDTH - totalWidth) / 2;

    for (let row = 0; row < ALIEN_ROWS; row++) {
      for (let col = 0; col < ALIEN_COLS; col++) {
        const type = row < 1 ? 0 : row < 3 ? 1 : 2;
        const x = startX + col * (ALIEN_WIDTH + ALIEN_PADDING);
        const y = ALIEN_START_Y + row * (ALIEN_WIDTH + ALIEN_PADDING);
        this.aliens.push(new Alien(x, y, type));
      }
    }
  }

  shoot() {
    const normalCooldown = this.player.rapidFire ? 10 : 20;

    if (this.shootCooldown <= 0) {
      audioManager.playShoot();

      if (this.player.multiShot) {
        this.bullets.push(new Bullet(this.player.x + this.player.width / 2 - 2, this.player.y));
        this.bullets.push(new Bullet(this.player.x + 4, this.player.y));
        this.bullets.push(new Bullet(this.player.x + this.player.width - 8, this.player.y));
      } else {
        this.bullets.push(new Bullet(this.player.x + this.player.width / 2 - 2, this.player.y));
      }

      this.shootCooldown = normalCooldown;
    }
  }

  update() {
    if (this.state === 'waveComplete') {
      this.waveCompleteTimer--;
      if (this.waveCompleteTimer <= 0) {
        this.wave++;
        this.alienSpeed += ALIEN_SPEED_INCREMENT;
        this.spawnAliens();
        this.spawnBases();
        this.alienDirection = 1;
        this.bullets = [];
        this.alienBullets = [];
        this.state = 'playing';
      }

      this.particles = this.particles.filter((particle) => {
        particle.update();
        return !particle.isDead();
      });
      return;
    }

    if (this.state !== 'playing') return;

    if (this.keys['arrowleft'] || this.keys['a']) {
      this.player.x = Math.max(0, this.player.x - PLAYER_SPEED);
    }
    if (this.keys['arrowright'] || this.keys['d']) {
      this.player.x = Math.min(CANVAS_WIDTH - this.player.width, this.player.x + PLAYER_SPEED);
    }

    if (this.keys[' ']) {
      this.shoot();
    }

    if (this.shootCooldown > 0) this.shootCooldown--;

    if (this.player.powerUpTimer > 0) {
      this.player.powerUpTimer--;
      if (this.player.powerUpTimer === 0) {
        this.player.shield = false;
        this.player.rapidFire = false;
        this.player.multiShot = false;
      }
    }

    this.bullets = this.bullets.filter((bullet) => {
      bullet.y -= BULLET_SPEED;
      return bullet.y > -bullet.height;
    });

    this.alienBullets = this.alienBullets.filter((bullet) => {
      bullet.y += ALIEN_BULLET_SPEED;
      return bullet.y < CANVAS_HEIGHT;
    });

    this.powerUps = this.powerUps.filter((powerUp) => {
      powerUp.y += POWERUP_SPEED;
      return powerUp.y < CANVAS_HEIGHT;
    });

    this.alienAnimTimer++;
    if (this.alienAnimTimer % 30 === 0) {
      this.aliens.forEach((alien) => alien.updateAnimation());
    }

    this.updateAliens();
    this.checkCollisions();
    this.alienShoot();

    // Clean up destroyed bases
    this.bases = this.bases.filter(base => !base.isEmpty());

    this.particles = this.particles.filter((particle) => {
      particle.update();
      return !particle.isDead();
    });

    if (this.aliens.length === 0 && this.state === 'playing') {
      this.state = 'waveComplete';
      this.waveCompleteTimer = 120;
      audioManager.playWaveComplete();

      if (this.onWaveComplete) {
        this.onWaveComplete(this.score, this.wave, this.aliensDefeated);
      }
    }
  }

  updateAliens() {
    if (this.aliens.length === 0) return;

    let moveDown = false;

    this.aliens.forEach((alien) => {
      alien.x += this.alienDirection * this.alienSpeed;

      if (alien.x <= 0 || alien.x + alien.width >= CANVAS_WIDTH) {
        moveDown = true;
      }
    });

    if (moveDown) {
      this.alienDirection *= -1;
      this.aliens.forEach((alien) => {
        alien.y += 20;
        if (alien.y + alien.height >= this.player.y) {
          this.gameOver();
        }
      });
    }
  }

  alienShoot() {
    this.aliens.forEach((alien) => {
      if (Math.random() < ALIEN_SHOOT_CHANCE) {
        this.alienBullets.push(
          new AlienBullet(alien.x + alien.width / 2 - 2, alien.y + alien.height)
        );
      }
    });
  }

  checkCollisions() {
    // Player bullets vs aliens
    this.bullets.forEach((bullet, bulletIndex) => {
      let bulletDestroyed = false;

      // Check alien collisions
      this.aliens.forEach((alien, alienIndex) => {
        if (!bulletDestroyed && this.checkCollision(bullet, alien)) {
          this.bullets.splice(bulletIndex, 1);
          bulletDestroyed = true;
          this.aliens.splice(alienIndex, 1);
          this.aliensDefeated++;

          const points = alien.type === 0 ? POINTS_ALIEN_TOP : alien.type === 1 ? POINTS_ALIEN_MIDDLE : POINTS_ALIEN_BOTTOM;
          this.score += points;

          audioManager.playExplosion();
          this.createExplosion(alien.x + alien.width / 2, alien.y + alien.height / 2);

          if (Math.random() < POWERUP_SPAWN_CHANCE) {
            const types: PowerUpType[] = ['multiShot', 'rapidFire', 'shield'];
            const type = types[Math.floor(Math.random() * types.length)];
            this.powerUps.push(new PowerUp(alien.x, alien.y, type));
          }
        }
      });

      // Check base collisions for player bullets
      if (!bulletDestroyed) {
        this.bases.forEach((base) => {
          if (base.checkCollision(bullet.x, bullet.y, bullet.width, bullet.height)) {
            base.damageAt(bullet.x + bullet.width / 2, bullet.y, 2);
            this.bullets.splice(bulletIndex, 1);
            bulletDestroyed = true;
          }
        });
      }
    });

    // Alien bullets vs player
    this.alienBullets.forEach((bullet, bulletIndex) => {
      let bulletDestroyed = false;

      // Check base collisions for alien bullets
      this.bases.forEach((base) => {
        if (!bulletDestroyed && base.checkCollision(bullet.x, bullet.y, bullet.width, bullet.height)) {
          base.damageAt(bullet.x + bullet.width / 2, bullet.y + bullet.height, 2);
          this.alienBullets.splice(bulletIndex, 1);
          bulletDestroyed = true;
        }
      });

      // Check player collision
      if (!bulletDestroyed && this.checkCollision(bullet, this.player)) {
        this.alienBullets.splice(bulletIndex, 1);

        if (!this.player.shield) {
          this.player.lives--;
          audioManager.playExplosion();
          this.createExplosion(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2);

          if (this.player.lives <= 0) {
            this.gameOver();
          }
        }
      }
    });

    // Power-ups
    this.powerUps.forEach((powerUp, powerUpIndex) => {
      if (this.checkCollision(powerUp, this.player)) {
        this.powerUps.splice(powerUpIndex, 1);
        this.activatePowerUp(powerUp.type);
        audioManager.playPowerUp();
      }
    });
  }

  checkCollision(a: { x: number; y: number; width: number; height: number }, b: { x: number; y: number; width: number; height: number }) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
  }

  activatePowerUp(type: PowerUpType) {
    this.player.powerUpTimer = 600;

    switch (type) {
      case 'multiShot':
        this.player.multiShot = true;
        break;
      case 'rapidFire':
        this.player.rapidFire = true;
        break;
      case 'shield':
        this.player.shield = true;
        break;
    }
  }

  createExplosion(x: number, y: number) {
    for (let i = 0; i < 15; i++) {
      this.particles.push(new Particle(x, y));
    }
  }

  gameOver() {
    this.state = 'gameOver';
    audioManager.playGameOver();
    if (this.onGameOver) {
      this.onGameOver(this.score, this.wave, this.aliensDefeated);
    }
  }

  draw() {
    this.ctx.fillStyle = COLORS.background;
    this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    this.drawStars();

    if (this.state === 'menu') {
      this.drawMenu();
    } else if (this.state === 'playing' || this.state === 'paused' || this.state === 'waveComplete') {
      this.bases.forEach((base) => base.draw(this.ctx));
      this.player.draw(this.ctx);
      this.aliens.forEach((alien) => alien.draw(this.ctx));
      this.bullets.forEach((bullet) => bullet.draw(this.ctx));
      this.alienBullets.forEach((bullet) => bullet.draw(this.ctx));
      this.powerUps.forEach((powerUp) => powerUp.draw(this.ctx));
      this.particles.forEach((particle) => particle.draw(this.ctx));

      this.drawUI();

      if (this.state === 'paused') {
        this.drawPaused();
      } else if (this.state === 'waveComplete') {
        this.drawWaveComplete();
      }
    } else if (this.state === 'gameOver') {
      this.drawGameOver();
    }

    this.drawScanlines();
  }

  drawStars() {
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 50; i++) {
      const x = (i * 137) % CANVAS_WIDTH;
      const y = (i * 211) % CANVAS_HEIGHT;
      this.ctx.fillRect(x, y, 1, 1);
    }
  }

  drawUI() {
    this.ctx.fillStyle = COLORS.ui;
    this.ctx.font = 'bold 20px monospace';
    this.ctx.fillText(`SCORE: ${this.score}`, 20, 30);
    this.ctx.fillText(`WAVE: ${this.wave}`, CANVAS_WIDTH / 2 - 50, 30);

    for (let i = 0; i < this.player.lives; i++) {
      this.ctx.fillRect(CANVAS_WIDTH - 100 + i * 24, 15, 16, 12);
    }

    if (this.player.powerUpTimer > 0) {
      const powerUpText = this.player.multiShot
        ? 'MULTI-SHOT'
        : this.player.rapidFire
        ? 'RAPID FIRE'
        : 'SHIELD';
      this.ctx.fillStyle = this.player.multiShot
        ? COLORS.powerupMulti
        : this.player.rapidFire
        ? COLORS.powerupRapid
        : COLORS.powerupShield;
      this.ctx.font = 'bold 16px monospace';
      this.ctx.fillText(powerUpText, 20, CANVAS_HEIGHT - 20);

      const barWidth = 200;
      const barHeight = 10;
      const fillWidth = (this.player.powerUpTimer / 600) * barWidth;
      this.ctx.strokeStyle = COLORS.ui;
      this.ctx.strokeRect(20, CANVAS_HEIGHT - 40, barWidth, barHeight);
      this.ctx.fillRect(20, CANVAS_HEIGHT - 40, fillWidth, barHeight);
    }
  }

  drawMenu() {
    this.ctx.fillStyle = COLORS.ui;
    this.ctx.font = 'bold 48px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('SPACE INVADERS', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 80);

    this.ctx.font = 'bold 24px monospace';
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillText('Press SPACE to Start', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

    this.ctx.font = '16px monospace';
    this.ctx.fillStyle = '#aaaaaa';
    this.ctx.fillText('Move: ARROW KEYS or A/D', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 60);
    this.ctx.fillText('Shoot: SPACEBAR', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 85);
    this.ctx.fillText('Pause: P', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 110);

    this.ctx.textAlign = 'left';
  }

  drawPaused() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    this.ctx.fillStyle = COLORS.ui;
    this.ctx.font = 'bold 48px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('PAUSED', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    this.ctx.font = '20px monospace';
    this.ctx.fillText('Press P to Resume', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40);
    this.ctx.textAlign = 'left';
  }

  drawWaveComplete() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    this.ctx.fillStyle = COLORS.ui;
    this.ctx.font = 'bold 36px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`WAVE ${this.wave} COMPLETE!`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    this.ctx.font = '20px monospace';
    this.ctx.fillText('Next wave incoming...', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40);
    this.ctx.textAlign = 'left';
  }

  drawGameOver() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    this.ctx.fillStyle = '#ff4444';
    this.ctx.font = 'bold 48px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 60);

    this.ctx.fillStyle = COLORS.ui;
    this.ctx.font = 'bold 24px monospace';
    this.ctx.fillText(`Final Score: ${this.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    this.ctx.fillText(`Wave Reached: ${this.wave}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 35);
    this.ctx.fillText(`Aliens Defeated: ${this.aliensDefeated}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 70);

    this.ctx.textAlign = 'left';
  }

  drawScanlines() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    for (let y = 0; y < CANVAS_HEIGHT; y += 4) {
      this.ctx.fillRect(0, y, CANVAS_WIDTH, 2);
    }
  }
}
