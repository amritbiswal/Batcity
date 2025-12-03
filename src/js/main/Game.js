/**
 * MAIN GAME CLASS
 * Orchestrates all game systems and game loop
 */

class Game {
    constructor() {
        // Get game container
        this.container = document.getElementById('game-container');
        this.entitiesContainer = document.getElementById('entities-container');
        this.background = document.querySelector('.game-bg');
        
        // Initialize all managers
        this.screenManager = new ScreenManager();
        this.uiManager = new UIManager();
        this.scoreManager = new ScoreManager();
        this.entityManager = new EntityManager(this.entitiesContainer);
        this.collisionManager = new CollisionManager();
        this.inputManager = new InputManager();
        
        // Initialize player
        this.player = new Player(this.container);
        
        // Game state
        this.state = GAME_STATE.START;
        this.isRunning = false;
        this.animationFrameId = null;
        this.lastFrameTime = 0;
        this.isGameOverTriggered = false; // NEW: Prevent multiple game over calls
        
        // Initialize
        this.init();
    }

    init() {
        console.log('🦇 Batcity Runner - Initializing...');
        
        // Setup input manager
        this.inputManager.init();
        this.inputManager.registerJump(() => this.handleJump());
        this.inputManager.registerShoot(() => this.handleShoot());
        
        // Setup score manager callbacks
        this.scoreManager.onScore((score) => {
            this.uiManager.updateScore(score);
            this.entityManager.updateSpeed(score);
        });
        
        // Setup collision manager callbacks
        this.setupCollisionCallbacks();
        
        // Setup button event listeners
        this.setupButtons();
        
        console.log('✅ Game initialized');
    }

    setupCollisionCallbacks() {
        // Obstacle passed (score points)
        this.collisionManager.on('onObstaclePassed', () => {
            if (this.state === GAME_STATE.PLAYING) {
                this.scoreManager.onObstaclePassed();
            }
        });

        // Enemy killed (score points)
        this.collisionManager.on('onEnemyKilled', () => {
            if (this.state === GAME_STATE.PLAYING) {
                this.scoreManager.onEnemyKilled();
            }
        });

        // Civilian saved (score points)
        this.collisionManager.on('onCivilianSaved', () => {
            if (this.state === GAME_STATE.PLAYING) {
                this.scoreManager.onCivilianSaved();
            }
        });

        // Civilian shot (GAME OVER)
        this.collisionManager.on('onCivilianShot', () => {
            if (this.state === GAME_STATE.PLAYING && !this.isGameOverTriggered) {
                this.gameOver('You shot a civilian! 😢');
            }
        });

        // Player hit obstacle or enemy (GAME OVER)
        this.collisionManager.on('onPlayerHit', (data) => {
            if (this.state === GAME_STATE.PLAYING && !this.isGameOverTriggered) {
                const message = data.type === 'obstacle' 
                    ? 'You crashed into an obstacle! 💥'
                    : 'You got hit by an enemy! 👾';
                this.gameOver(message);
            }
        });
    }

    setupButtons() {
        const startBtn = document.getElementById('start-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startGame());
        }

        const restartBtn = document.getElementById('restart-btn');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => this.restartGame());
        }

        const menuBtn = document.getElementById('menu-btn');
        if (menuBtn) {
            menuBtn.addEventListener('click', () => this.backToMenu());
        }
    }

    startGame() {
        console.log('🎮 Starting game...');
        
        // Reset game over flag
        this.isGameOverTriggered = false;
        
        // Reset all systems
        this.player.reset();
        this.entityManager.reset();
        this.scoreManager.reset();
        this.collisionManager.reset();
        this.uiManager.reset();
        
        // Change to game screen
        this.screenManager.showGame();
        
        // Update state
        this.state = GAME_STATE.PLAYING;
        this.isRunning = true;
        
        // Enable input
        this.inputManager.enable();
        
        // Start managers
        this.scoreManager.start();
        this.entityManager.start();

        // Resume background animation
        if (this.background) {
            this.background.classList.remove('game-bg--frozen');
            this.background.style.animationPlayState = 'running';
        }
        
        // Start game loop
        this.lastFrameTime = performance.now();
        this.gameLoop();
        
        console.log('✅ Game started');
    }

    gameLoop(currentTime = performance.now()) {
        if (!this.isRunning) return;

        const deltaTime = (currentTime - this.lastFrameTime) / 1000;
        this.lastFrameTime = currentTime;

        // Update all systems
        this.update(currentTime, deltaTime);

        // Continue loop
        this.animationFrameId = requestAnimationFrame((time) => this.gameLoop(time));
    }

    update(currentTime, deltaTime) {
        // Don't update if game over is triggered
        if (this.isGameOverTriggered) return;

        // Update score (time-based)
        this.scoreManager.update(currentTime);

        // Update entity manager (spawning, cleanup)
        this.entityManager.update(currentTime, deltaTime);

        // Check collisions
        const entities = this.entityManager.getAllEntities();
        this.collisionManager.checkCollisions(this.player, entities);
    }

    handleJump() {
        if (this.state !== GAME_STATE.PLAYING || this.isGameOverTriggered) return;
        this.player.jump();
    }

    handleShoot() {
        if (this.state !== GAME_STATE.PLAYING || this.isGameOverTriggered) return;
        
        const shootPos = this.player.getShootPosition();
        this.entityManager.spawnProjectile(shootPos.left, shootPos.bottom);
    }

    gameOver(reason = 'Game Over') {
        // Prevent multiple game over calls
        if (this.isGameOverTriggered) return;
        
        console.log('💀 Game Over:', reason);
        
        // Set flag immediately
        this.isGameOverTriggered = true;
        
        // Update state
        this.state = GAME_STATE.GAME_OVER;
        this.isRunning = false;
        
        // Stop game loop FIRST
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        
        // Disable input
        this.inputManager.disable();
        
        // Stop managers
        this.entityManager.stop();
        
        // Pause background
        if (this.background) {
            this.background.classList.add('game-bg--frozen');
            this.background.style.animationPlayState = 'paused';
        }
        
        // Player death animation
        this.player.die();
        
        // Get final scores BEFORE showing screen
        const finalScore = this.scoreManager.getScore();
        const highScore = this.scoreManager.getHighScore();
        
        // Show game over screen after delay
        setTimeout(() => {
            this.uiManager.showGameOver(finalScore, highScore, reason);
            this.screenManager.showEnd();
        }, 800); // Increased delay for death animation
    }

    restartGame() {
        console.log('🔄 Restarting game...');
        
        // Clear any lingering entities
        this.entityManager.clearAll();
        
        // Small delay before restart
        setTimeout(() => {
            this.startGame();
        }, 100);
    }

    backToMenu() {
        console.log('🏠 Back to menu');
        
        // Stop everything
        this.isRunning = false;
        this.isGameOverTriggered = false;
        
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        
        // Reset all systems
        this.player.reset();
        this.entityManager.reset();
        this.inputManager.reset();
        
        // Pause background
        if (this.background) {
            // this.background.style.animationPlayState = 'paused';
            this.background.classList.add('game-bg--frozen');
        }
        
        // Show start screen
        this.state = GAME_STATE.START;
        this.screenManager.showStart();
    }

    pause() {
        if (this.state !== GAME_STATE.PLAYING) return;
        
        this.isRunning = false;
        this.state = GAME_STATE.PAUSED;
        this.inputManager.disable();
        
        if (this.background) {
            this.background.style.animationPlayState = 'paused';
        }
    }

    resume() {
        if (this.state !== GAME_STATE.PAUSED) return;
        
        this.isRunning = true;
        this.state = GAME_STATE.PLAYING;
        this.inputManager.enable();
        
        if (this.background) {
            this.background.style.animationPlayState = 'running';
        }
        
        this.lastFrameTime = performance.now();
        this.gameLoop();
    }
}