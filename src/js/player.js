import { Entity } from './entity.js';
import { CONFIG } from './config.js';

export class Player extends Entity {
  constructor(x, y, groundHeight, gameHeight) {
    super(x, y);
    this.groundHeight = groundHeight;
    this.gameHeight = gameHeight;
    this.jumpsUsed = 0;
    this.onGround = true;
    this.moveLeft = false;
    this.moveRight = false;
  }

  jump() {
    if (this.onGround || this.jumpsUsed < CONFIG.player.maxJumps) {
      this.vy = CONFIG.player.jumpVelocity;
      this.jumpsUsed++;
      this.onGround = false;
      return true;
    }
    return false;
  }

  update(deltaTime, bossActive, gameWidth) {
    // Apply gravity
    this.vy += CONFIG.game.gravity * deltaTime;
    this.y += this.vy * deltaTime;

    // Ground collision
    if (this.y <= this.groundHeight) {
      this.y = this.groundHeight;
      this.vy = 0;
      
      if (!this.onGround) {
        this.jumpsUsed = 0;
      }
      
      this.onGround = true;
    } else {
      this.onGround = false;
    }

    // Horizontal movement (only during boss phase)
    if (bossActive) {
      if (this.moveLeft) {
        this.x -= CONFIG.player.speed * deltaTime;
      }
      if (this.moveRight) {
        this.x += CONFIG.player.speed * deltaTime;
      }

      // Clamp position
      const minX = gameWidth * 0.05;
      const maxX = gameWidth * 0.6;
      this.x = Math.max(minX, Math.min(maxX, this.x));
    }

    this.updatePosition();
  }

  reset(gameWidth, groundHeight) {
    this.x = gameWidth * CONFIG.player.baseXRatio;
    this.y = groundHeight;
    this.vy = 0;
    this.onGround = true;
    this.jumpsUsed = 0;
    this.moveLeft = false;
    this.moveRight = false;
    this.updatePosition();
  }
}