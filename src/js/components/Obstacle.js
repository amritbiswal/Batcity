/**
 * OBSTACLE CLASS
 * Hazards that must be jumped over
 */

class Obstacle {
    constructor(container, speed) {
        this.container = container;
        this.speed = speed;
        this.destroyed = false;
        this.passed = false; // Track if player passed it
        
        this.element = this.createElement();
        this.container.appendChild(this.element);
    }

    createElement() {
        const element = document.createElement('div');
        element.className = 'entity entity--obstacle';
        
        // Calculate animation duration based on speed
        const containerWidth = this.container.getBoundingClientRect().width;
        const distance = containerWidth * 1.2; // Start off-screen
        const duration = Helpers.calculateDuration(distance, this.speed);
        
        element.style.animationDuration = `${duration}ms`;
        
        // Add obstacle icon
        const icon = document.createElement('div');
        icon.className = 'entity__icon';
        icon.textContent = '⚠️';
        element.appendChild(icon);
        
        return element;
    }

    getBounds() {
        return this.element.getBoundingClientRect();
    }

    /**
     * Check if obstacle is off screen (left side)
     */
    isOffScreen() {
        const rect = this.getBounds();
        const containerRect = this.container.getBoundingClientRect();
        return rect.right < containerRect.left;
    }

    /**
     * Check if player has passed this obstacle
     */
    hasPlayerPassed(playerBounds) {
        if (this.passed) return false;
        
        const bounds = this.getBounds();
        if (bounds.right < playerBounds.left) {
            this.passed = true;
            return true;
        }
        return false;
    }

    destroy() {
        if (this.destroyed) return;
        this.destroyed = true;
        
        if (this.element && this.element.parentElement) {
            this.element.remove();
        }
    }
}