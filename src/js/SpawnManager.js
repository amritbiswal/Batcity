import { Obstacle } from './obstacle.js';
import { Enemy } from './enemy.js';
import { Civilian } from './civilian.js';
import { Bullet } from './bullet.js';
import { CONFIG } from './config.js';

export class SpawnManager {
  constructor(gameContainer) {
    this.gameContainer = gameContainer;
    this.lastObstacleSpawn = 0;
    this.lastEnemySpawn = 0;
    this.lastCivilianSpawn = 0;
    this.lastBulletTime = 0;
    this.lastJokerBulletTime = 0;
  }

  reset() {
    this.lastObstacleSpawn = 0;
    this.lastEnemySpawn = 0;
    this.lastCivilianSpawn = 0;
    this.lastBulletTime = 0;
    this.lastJokerBulletTime = 0;
  }

  spawnObstacle(gameWidth, groundHeight, worldSpeed, entities) {
    const obstacle = new Obstacle(gameWidth, groundHeight, worldSpeed);
    obstacle.createElement('obstacle');
    this.gameContainer.appendChild(obstacle.el);
    obstacle.updatePosition();
    entities.push(obstacle);
  }

  spawnEnemy(gameWidth, groundHeight, worldSpeed, entities) {
    const enemy = new Enemy(gameWidth, groundHeight, worldSpeed);
    enemy.createElement('enemy');
    this.gameContainer.appendChild(enemy.el);
    enemy.updatePosition();
    entities.push(enemy);
  }

  spawnCivilian(gameWidth, groundHeight, worldSpeed, entities) {
    const civilian = new Civilian(gameWidth, groundHeight, worldSpeed);
    civilian.createElement('civilian');
    this.gameContainer.appendChild(civilian.el);
    civilian.updatePosition();
    entities.push(civilian);
  }

  spawnPlayerBullet(player, bullets) {
    const now = performance.now();
    if (now - this.lastBulletTime < CONFIG.bullet.cooldown) return false;

    const playerRect = player.el.getBoundingClientRect();
    const containerRect = this.gameContainer.getBoundingClientRect();
    const startX = playerRect.right - containerRect.left;
    const bulletY = player.y + CONFIG.player.bulletYOffset;

    const bullet = new Bullet(startX, bulletY, CONFIG.bullet.speed);
    bullet.createElement('bullet');
    this.gameContainer.appendChild(bullet.el);
    bullet.updatePosition();
    
    bullets.push(bullet);
    this.lastBulletTime = now;
    return true;
  }

  spawnJokerBullet(joker, jokerBullets, timestamp) {
    if (timestamp - this.lastJokerBulletTime < CONFIG.joker.bulletInterval) return false;

    const jokerRect = joker.el.getBoundingClientRect();
    const containerRect = this.gameContainer.getBoundingClientRect();
    const startX = jokerRect.left - containerRect.left - 16;
    const bulletY = joker.y + CONFIG.joker.bulletYOffset;

    const bullet = new Bullet(startX, bulletY, -CONFIG.joker.bulletSpeed);
    bullet.createElement('bullet');
    this.gameContainer.appendChild(bullet.el);
    bullet.updatePosition();
    
    jokerBullets.push(bullet);
    this.lastJokerBulletTime = timestamp;
    return true;
  }

  updateSpawning(timestamp, phase, bossActive, gameWidth, groundHeight, worldSpeed, 
                 obstacleInterval, enemyInterval, civilianInterval,
                 entities, jokerBullets, joker) {
    
    if (bossActive && joker) {
      return this.spawnJokerBullet(joker, jokerBullets, timestamp);
    }

    // Spawn obstacles
    if (timestamp - this.lastObstacleSpawn > obstacleInterval) {
      this.spawnObstacle(gameWidth, groundHeight, worldSpeed, entities);
      this.lastObstacleSpawn = timestamp;
    }

    // Spawn enemies (phase 2+)
    if (phase >= 2 && timestamp - this.lastEnemySpawn > enemyInterval) {
      this.spawnEnemy(gameWidth, groundHeight, worldSpeed, entities);
      this.lastEnemySpawn = timestamp;
    }

    // Spawn civilians (phase 3+)
    if (phase >= 3 && timestamp - this.lastCivilianSpawn > civilianInterval) {
      this.spawnCivilian(gameWidth, groundHeight, worldSpeed, entities);
      this.lastCivilianSpawn = timestamp;
    }
  }
}