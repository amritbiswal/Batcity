/**
 * PLAYER CLASS
 * Represents the main character (Batman in Batmobile)
 */

class Player {
    constructor(containerElement) {
        this.container = containerElement;
        this.element = document.getElementById('game-player');
        
        // State
        this.isJumping = false;
        this.isAlive = true;
        
        // Jump animation timeout
        this.jumpTimeout = null;
        
        this.init();
    }

    init() {
        // Set initial position
        this.reset();
    }

    /**
     * Make the player jump
     */
    jump() {
        // Prevent double jumping
        if (this.isJumping || !this.isAlive) {
            return false;
        }

        this.isJumping = true;
        this.element.classList.add('jumping');

        // Clear any existing timeout
        if (this.jumpTimeout) {
            clearTimeout(this.jumpTimeout);
        }

        // Remove jumping class after animation completes
        this.jumpTimeout = setTimeout(() => {
            this.element.classList.remove('jumping');
            this.isJumping = false;
        }, CONSTANTS.PLAYER.JUMP_DURATION);

        return true;
    }

    /**
     * Get player's bounding box for collision detection
     */
    getBounds() {
        return this.element.getBoundingClientRect();
    }

    /**
     * Get shooting position (front of player)
     */
    getShootPosition() {
        const playerRect = this.getBounds();
        const containerRect = this.container.getBoundingClientRect();
        
        // Calculate position relative to container
        const leftPercent = ((playerRect.right - containerRect.left) / containerRect.width) * 100;
        const bottomPixels = containerRect.bottom - playerRect.top - (playerRect.height / 2);
        
        return {
            left: leftPercent,
            bottom: bottomPixels
        };
    }

    /**
     * Reset player to initial state
     */
    reset() {
        this.isJumping = false;
        this.isAlive = true;
        this.element.classList.remove('jumping');
        
        if (this.jumpTimeout) {
            clearTimeout(this.jumpTimeout);
            this.jumpTimeout = null;
        }
    }

    /**
     * Player died
     */
    die() {
        this.isAlive = false;
        // Add death animation class
        this.element.classList.add('dead');
    }

    /**
     * Cleanup
     */
    destroy() {
        if (this.jumpTimeout) {
            clearTimeout(this.jumpTimeout);
        }
    }
}