import { Entity } from './entity.js';
import { CONFIG } from './config.js';

export class Joker extends Entity {
  constructor(x, y, gameHeight) {
    super(x, y);
    this.hp = CONFIG.joker.maxHp;
    this.active = false;
    this.minY = gameHeight * CONFIG.joker.minYRatio;
    this.maxY = gameHeight * CONFIG.joker.maxYRatio;
  }

  activate() {
    this.active = true;
    this.hp = CONFIG.joker.maxHp;
    this.y = this.minY;
    this.vy = CONFIG.joker.verticalSpeed;
    if (this.el) {
      this.el.style.display = 'block';
    }
  }

  deactivate() {
    this.active = false;
    this.y = this.minY;
    this.vy = 0;
    if (this.el) {
      this.el.style.display = 'none';
    }
  }

  takeDamage() {
    this.hp--;
    return this.hp <= 0;
  }

  update(deltaTime) {
    if (!this.active) return;

    this.y += this.vy * deltaTime;

    // Bounce between min and max
    if (this.y < this.minY) {
      this.y = this.minY;
      this.vy = Math.abs(this.vy);
    } else if (this.y > this.maxY) {
      this.y = this.maxY;
      this.vy = -Math.abs(this.vy);
    }

    this.updatePosition();
  }

  positionAtRight(gameWidth) {
    this.x = gameWidth - CONFIG.joker.xOffset;
    this.updatePosition();
  }

  reset(gameWidth, groundHeight, gameHeight) {
    this.x = gameWidth - CONFIG.joker.xOffset;
    this.y = groundHeight;
    this.hp = CONFIG.joker.maxHp;
    this.active = false;
    this.vy = 0;
    this.minY = gameHeight * CONFIG.joker.minYRatio;
    this.maxY = gameHeight * CONFIG.joker.maxYRatio;
    if (this.el) {
      this.el.style.display = 'none';
    }
    this.updatePosition();
  }
}