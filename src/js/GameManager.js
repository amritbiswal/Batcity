import { CONFIG } from './config.js';
import { SoundEngine } from './sound.js';
import { Player } from './player.js';
import { Joker } from './joker.js';
import { UIManager } from './UIManager.js';
import { SpawnManager } from './SpawnManager.js';
import { CollisionManager } from './CollisionManager.js';

export class GameManager {
  constructor() {
    // Managers
    this.sound = new SoundEngine();
    this.ui = new UIManager();
    this.collision = new CollisionManager();
    
    // DOM elements
    this.gameContainer = document.getElementById('game-container');
    this.playerEl = document.getElementById('player');
    this.jokerEl = document.getElementById('joker');
    
    this.spawnManager = new SpawnManager(this.gameContainer);
    
    // Game state
    this.running = false;
    this.paused = false;
    this.score = 0;
    this.highscore = 0;
    this.phase = 1;
    this.bossCount = 0;
    this.lastBossScore = 0;
    this.nextBossScore = CONFIG.boss.scoreStep;
    
    // Dimensions
    this.width = CONFIG.game.width;
    this.height = CONFIG.game.height;
    this.groundHeight = this.height * CONFIG.game.groundHeightRatio;
    
    // Game objects
    this.player = null;
    this.joker = null;
    this.entities = [];
    this.bullets = [];
    this.jokerBullets = [];
    
    // Time
    this.lastTime = null;
    
    // Difficulty
    this.worldSpeed = 150;
    this.obstacleInterval = 2100;
    this.enemyInterval = 2600;
    this.civilianInterval = 3500;
    this.bgSpeedSeconds = 5;
    
    // Initialize
    this.initButtons();
    this.setupEventListeners();
    this.updateDimensions();
    this.loadPreferences();
    this.resetGameState();
    this.ui.showScreen('start');
  }

  initButtons() {
    this.buttons = {
      start: document.getElementById('btn-start'),
      restart: document.getElementById('btn-restart'),
      back: document.getElementById('btn-back'),
      mute: document.getElementById('btn-mute'),
      theme: document.getElementById('btn-theme'),
      jump: document.getElementById('btn-jump'),
      shoot: document.getElementById('btn-shoot'),
      pause: document.getElementById('btn-pause'),
      continue: document.getElementById('btn-continue'),
      restartPause: document.getElementById('btn-restart-pause'),
      quit: document.getElementById('btn-quit')
    };
  }

  setupEventListeners() {
    // Keyboard
    window.addEventListener('keydown', (e) => this.handleKeyDown(e));
    window.addEventListener('keyup', (e) => this.handleKeyUp(e));

    // Buttons
    this.buttons.start?.addEventListener('click', () => this.startGame());
    this.buttons.restart?.addEventListener('click', () => this.startGame());
    this.buttons.back?.addEventListener('click', () => this.returnToMenu());
    this.buttons.jump?.addEventListener('click', () => this.handleJump());
    this.buttons.shoot?.addEventListener('click', () => this.handleShoot());
    this.buttons.mute?.addEventListener('click', () => this.toggleMute());
    this.buttons.theme?.addEventListener('click', () => this.toggleTheme());
    this.buttons.pause?.addEventListener('click', () => this.togglePause());
    this.buttons.continue?.addEventListener('click', () => this.hidePauseMenu());
    this.buttons.restartPause?.addEventListener('click', () => {
      this.hidePauseMenu();
      this.sound.unlock();
      this.startGame();
    });
    this.buttons.quit?.addEventListener('click', () => {
      this.hidePauseMenu();
      this.running = false;
      this.resetGameState();
      this.ui.showScreen('start');
    });

    // Window events
    window.addEventListener('resize', () => this.updateDimensions());
    window.addEventListener('blur', () => {
      if (this.running && !this.paused) {
        this.showPauseMenu();
      }
    });
    
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.running && !this.paused) {
        this.showPauseMenu();
      }
    });
  }

  handleKeyDown(e) {
    if ((e.code === 'Space' || e.code === 'ArrowUp') && !this.paused) {
      e.preventDefault();
      this.handleJump();
    }
    if (e.code === 'KeyF' && !this.paused) {
      e.preventDefault();
      this.handleShoot();
    }
    if (e.code === 'Escape' || e.code === 'KeyP') {
      e.preventDefault();
      this.togglePause();
    }
    if ((e.code === 'ArrowLeft' || e.code === 'KeyA') && this.player && !this.paused) {
      this.player.moveLeft = true;
    }
    if ((e.code === 'ArrowRight' || e.code === 'KeyD') && this.player && !this.paused) {
      this.player.moveRight = true;
    }
  }

  handleKeyUp(e) {
    if ((e.code === 'ArrowLeft' || e.code === 'KeyA') && this.player) {
      this.player.moveLeft = false;
    }
    if ((e.code === 'ArrowRight' || e.code === 'KeyD') && this.player) {
      this.player.moveRight = false;
    }
  }

  handleJump() {
    if (!this.running || this.paused) return;
    
    if (this.player && this.player.jump()) {
      this.sound.playJump();
    }
  }

  handleShoot() {
    if (!this.running || this.paused) return;
    
    if (this.spawnManager.spawnPlayerBullet(this.player, this.bullets)) {
      this.sound.playShoot();
    }
  }

  updateDimensions() {
    const rect = this.gameContainer.getBoundingClientRect();
    this.width = rect.width || CONFIG.game.width;
    this.height = rect.height || CONFIG.game.height;
    this.groundHeight = this.height * CONFIG.game.groundHeightRatio;
  }

  loadPreferences() {
    const prefs = this.ui.loadPreferences(this.highscore, this.buttons.theme, this.buttons.mute);
    
    if (prefs.highscore !== undefined) {
      this.highscore = prefs.highscore;
    }
    
    if (prefs.muted) {
      this.sound.mute();
    }
  }

  toggleMute() {
    const muted = this.sound.toggleMute();
    if (this.buttons.mute) {
      this.buttons.mute.classList.toggle('muted', muted);
    }
    this.ui.saveMute(muted);
  }

  toggleTheme() {
    const isLight = document.body.classList.toggle('light-theme');
    
    if (this.buttons.theme) {
      this.buttons.theme.classList.toggle('light', isLight);
      const icon = this.buttons.theme.querySelector('.theme-icon');
      if (icon) icon.textContent = isLight ? '☀️' : '🌙';
    }
    
    this.ui.saveTheme(isLight);
  }

  showPauseMenu() {
    if (!this.running) return;
    this.paused = true;
    this.ui.showPauseMenu();
  }

  hidePauseMenu() {
    if (!this.running) return;
    this.paused = false;
    this.lastTime = null;
    this.ui.hidePauseMenu();
    this.ui.updateBackground(this.bgSpeedSeconds, this.joker?.active);
  }

  togglePause() {
    if (!this.running) return;
    
    if (this.paused) {
      this.hidePauseMenu();
    } else {
      this.showPauseMenu();
    }
  }

  startGame() {
    this.sound.unlock();
    this.resetGameState();
    this.running = true;
    this.paused = false;
    this.ui.showScreen('game');
    this.lastTime = null;
    requestAnimationFrame((ts) => this.gameLoop(ts));
  }

  resetGameState() {
    this.updateDimensions();
    this.clearAllEntities();

    this.score = 0;
    this.phase = 1;
    this.bossCount = 0;
    this.lastBossScore = 0;
    this.nextBossScore = CONFIG.boss.scoreStep;
    
    this.ui.updateScore(0);
    this.ui.hideJokerHP();
    
    // Create player
    this.player = new Player(
      this.width * CONFIG.player.baseXRatio, 
      this.groundHeight, 
      this.groundHeight, 
      this.height
    );
    this.player.el = this.playerEl;
    this.player.updatePosition();
    
    // Create Joker
    this.joker = new Joker(this.width - CONFIG.joker.xOffset, this.groundHeight, this.height);
    this.joker.el = this.jokerEl;
    this.joker.el.style.display = 'none';
    this.joker.updatePosition();
    
    // Reset spawn manager
    this.spawnManager.reset();
    
    // Update difficulty
    this.updateDifficulty();
  }

  clearAllEntities() {
    this.entities.forEach(e => e.remove());
    this.bullets.forEach(b => b.remove());
    this.jokerBullets.forEach(b => b.remove());
    
    this.entities = [];
    this.bullets = [];
    this.jokerBullets = [];
  }

  returnToMenu() {
    this.running = false;
    this.clearAllEntities();
    this.ui.showScreen('start');
  }

  endGame(message) {
    this.running = false;
    
    if (this.score > this.highscore) {
      this.highscore = Math.floor(this.score);
      this.ui.updateHighscore(this.highscore);
      this.ui.saveHighscore(this.highscore);
    }
    
    this.sound.playGameOver();
    this.ui.showEndScreen('Game Over', message, Math.floor(this.score));
  }

  updateDifficulty() {
    if (this.joker?.active) return;

    const segmentScore = this.score - this.lastBossScore;
    
    if (segmentScore < CONFIG.spawning.phaseThresholds.enemies) {
      this.phase = 1;
    } else if (segmentScore < CONFIG.spawning.phaseThresholds.civilians) {
      this.phase = 2;
    } else {
      this.phase = 3;
    }

    const phaseConfig = CONFIG.phases[this.phase];
    const difficultyMultiplier = 1 + this.bossCount * CONFIG.boss.difficultyIncrease;

    this.worldSpeed = phaseConfig.worldSpeed * difficultyMultiplier;
    this.obstacleInterval = phaseConfig.obstacleInterval / difficultyMultiplier;
    this.enemyInterval = phaseConfig.enemyInterval / difficultyMultiplier;
    this.civilianInterval = phaseConfig.civilianInterval / difficultyMultiplier;
    this.bgSpeedSeconds = phaseConfig.bgSpeed / (0.9 + this.bossCount * 0.1);

    this.ui.updateBackground(this.bgSpeedSeconds, false);
  }

  enterBossPhase() {
    this.clearAllEntities();
    
    this.joker.positionAtRight(this.width);
    this.joker.activate();
    this.phase = 4;
    
    this.ui.showJokerHP(this.joker.hp);
    this.ui.updateBackground(0, true);
    this.ui.showBossBanner(`BOSS FIGHT ${this.bossCount + 1}`);
    this.sound.playBossIntro();
  }

  exitBossPhase() {
    this.joker.deactivate();
    this.bossCount++;
    
    this.lastBossScore = this.nextBossScore;
    this.nextBossScore += CONFIG.boss.scoreStep;
    
    this.ui.hideJokerHP();
    
    this.jokerBullets.forEach(b => b.remove());
    this.jokerBullets = [];
    this.bullets.forEach(b => b.remove());
    this.bullets = [];
    
    this.updateDifficulty();
  }

  updateEntities(deltaTime) {
    // Update all entities
    for (let i = this.entities.length - 1; i >= 0; i--) {
      const entity = this.entities[i];
      entity.update(deltaTime);
      
      if (entity.isOutOfBounds(this.width)) {
        entity.remove();
        this.entities.splice(i, 1);
      }
    }

    // Update bullets
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];
      bullet.update(deltaTime);
      
      if (bullet.x > this.width + 100) {
        bullet.remove();
        this.bullets.splice(i, 1);
      }
    }

    // Update Joker bullets
    for (let i = this.jokerBullets.length - 1; i >= 0; i--) {
      const bullet = this.jokerBullets[i];
      bullet.update(deltaTime);
      
      if (bullet.x < -100) {
        bullet.remove();
        this.jokerBullets.splice(i, 1);
      }
    }
  }

  checkCollisions() {
    if (!this.joker?.active) {
      // Normal phase: player vs entities
      const playerCollision = this.collision.checkPlayerVsEntities(
        this.player, 
        this.entities, 
        (entity, index) => {
          if (entity.type === 'obstacle') {
            this.endGame('You hit an obstacle.');
            return true;
          }
          if (entity.type === 'enemy') {
            this.endGame('You collided with an enemy.');
            return true;
          }
          if (entity.type === 'civilian') {
            this.score += 5;
            this.ui.updateScore(this.score);
            entity.remove();
            this.entities.splice(index, 1);
            this.sound.playCivilianSave();
          }
          return false;
        }
      );
      
      if (playerCollision) return true;

      // Bullets vs entities
      const bulletCollision = this.collision.checkBulletsVsEntities(
        this.bullets,
        this.entities,
        (bullet, bulletIndex, entity, entityIndex) => {
          if (entity.type === 'enemy') {
            this.score += 3;
            this.ui.updateScore(this.score);
            bullet.remove();
            this.bullets.splice(bulletIndex, 1);
            entity.remove();
            this.entities.splice(entityIndex, 1);
            this.sound.playEnemyHit();
            return 'hit';
          }
          
          if (entity.type === 'civilian') {
            this.endGame('You shot a civilian!');
            return true;
          }
          
          if (entity.type === 'obstacle') {
            bullet.remove();
            this.bullets.splice(bulletIndex, 1);
            return 'hit';
          }
          
          return false;
        }
      );
      
      if (bulletCollision === true) return true;

    } else {
      // Boss phase: player bullets vs Joker
      const jokerHit = this.collision.checkBulletsVsTarget(
        this.bullets,
        this.joker,
        (bullet, index) => {
          bullet.remove();
          this.bullets.splice(index, 1);
          
          if (this.joker.takeDamage()) {
            this.exitBossPhase();
            return 'defeated';
          }
          
          this.ui.updateJokerHP(this.joker.hp);
          this.sound.playJokerHit();
          return true;
        }
      );

      // Joker bullets vs Player
      const playerHit = this.collision.checkBulletsVsTarget(
        this.jokerBullets,
        this.player,
        () => {
          this.endGame('Joker shot you.');
          return true;
        }
      );
      
      if (playerHit) return true;
    }

    return false;
  }

  gameLoop(timestamp) {
    if (!this.running) return;
    
    if (this.paused) {
      requestAnimationFrame((ts) => this.gameLoop(ts));
      return;
    }

    if (this.lastTime === null) {
      this.lastTime = timestamp;
      requestAnimationFrame((ts) => this.gameLoop(ts));
      return;
    }

    const deltaTime = Math.min((timestamp - this.lastTime) / 1000, 0.1);
    this.lastTime = timestamp;

    // Update score
    if (!this.joker?.active) {
      this.score += deltaTime * CONFIG.game.scorePerSecond;
      this.ui.updateScore(this.score);
      
      // Check for boss trigger
      if (this.score >= this.nextBossScore) {
        this.enterBossPhase();
        requestAnimationFrame((ts) => this.gameLoop(ts));
        return;
      }
      
      // Update high score
      if (this.score > this.highscore) {
        this.highscore = Math.floor(this.score);
        this.ui.updateHighscore(this.highscore);
      }
    }

    // Update difficulty
    this.updateDifficulty();

    // Update game objects
    this.player.update(deltaTime, this.joker?.active, this.width);
    this.joker?.update(deltaTime);
    
    // Spawn entities
    this.spawnManager.updateSpawning(
      timestamp,
      this.phase,
      this.joker?.active,
      this.width,
      this.groundHeight,
      this.worldSpeed,
      this.obstacleInterval,
      this.enemyInterval,
      this.civilianInterval,
      this.entities,
      this.jokerBullets,
      this.joker
    );
    
    // Update entities
    this.updateEntities(deltaTime);
    
    // Check collisions
    if (this.checkCollisions()) {
      return;
    }

    requestAnimationFrame((ts) => this.gameLoop(ts));
  }
}