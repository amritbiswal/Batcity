/**
 * INPUT MANAGER
 * Handles keyboard and touch input
 */

class InputManager {
    constructor() {
        this.keys = {
            jump: false,
            shoot: false
        };
        
        // Callbacks
        this.onJump = null;
        this.onShoot = null;
        
        // Prevent repeated inputs
        this.jumpCooldown = false;
        this.shootCooldown = false;
        
        this.isEnabled = false;
    }

    /**
     * Initialize input listeners
     */
    init() {
        // Keyboard listeners
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        // Mobile button listeners
        this.initMobileControls();
    }

    /**
     * Initialize mobile button controls
     */
    initMobileControls() {
        const jumpBtn = document.getElementById('jump-btn');
        const shootBtn = document.getElementById('shoot-btn');

        if (jumpBtn) {
            // Support both click and touch
            jumpBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.triggerJump();
            });
            
            jumpBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.triggerJump();
            });
        }

        if (shootBtn) {
            shootBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.triggerShoot();
            });
            
            shootBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.triggerShoot();
            });
        }
    }

    /**
     * Handle keyboard key down
     */
    handleKeyDown(e) {
        if (!this.isEnabled) return;

        // Check if it's a jump key
        if (CONSTANTS.KEYS.JUMP.includes(e.key)) {
            e.preventDefault();
            this.triggerJump();
        }
        
        // Check if it's a shoot key
        if (CONSTANTS.KEYS.SHOOT.includes(e.key)) {
            e.preventDefault();
            this.triggerShoot();
        }
    }

    /**
     * Handle keyboard key up
     */
    handleKeyUp(e) {
        // Reset key states
        if (CONSTANTS.KEYS.JUMP.includes(e.key)) {
            this.keys.jump = false;
            this.jumpCooldown = false;
        }
        
        if (CONSTANTS.KEYS.SHOOT.includes(e.key)) {
            this.keys.shoot = false;
            this.shootCooldown = false;
        }
    }

    /**
     * Trigger jump action
     */
    triggerJump() {
        if (!this.isEnabled || this.jumpCooldown) return;

        this.keys.jump = true;
        this.jumpCooldown = true;

        if (this.onJump) {
            this.onJump();
        }

        // Reset cooldown after a short delay
        setTimeout(() => {
            this.jumpCooldown = false;
        }, 100);
    }

    /**
     * Trigger shoot action
     */
    triggerShoot() {
        if (!this.isEnabled || this.shootCooldown) return;

        this.keys.shoot = true;
        this.shootCooldown = true;

        if (this.onShoot) {
            this.onShoot();
        }

        // Reset cooldown
        setTimeout(() => {
            this.shootCooldown = false;
        }, 200);
    }

    /**
     * Register jump callback
     */
    registerJump(callback) {
        this.onJump = callback;
    }

    /**
     * Register shoot callback
     */
    registerShoot(callback) {
        this.onShoot = callback;
    }

    /**
     * Enable input handling
     */
    enable() {
        this.isEnabled = true;
    }

    /**
     * Disable input handling
     */
    disable() {
        this.isEnabled = false;
        this.keys.jump = false;
        this.keys.shoot = false;
        this.jumpCooldown = false;
        this.shootCooldown = false;
    }

    /**
     * Reset input state
     */
    reset() {
        this.disable();
    }
}