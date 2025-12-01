/**
 * ENEMY CLASS
 * Hostile entities that can be shot
 */

class Enemy {
    constructor(container, speed) {
        this.container = container;
        this.speed = speed;
        this.destroyed = false;
        this.passed = false;
        
        this.element = this.createElement();
        this.container.appendChild(this.element);
    }

    createElement() {
        const element = document.createElement('div');
        element.className = 'entity entity--enemy';
        
        const containerWidth = this.container.getBoundingClientRect().width;
        const distance = containerWidth * 1.2;
        const duration = Helpers.calculateDuration(distance, this.speed);
        
        element.style.animationDuration = `${duration}ms`;
        
        const icon = document.createElement('div');
        icon.className = 'entity__icon';
        icon.textContent = '👾';
        element.appendChild(icon);
        
        return element;
    }

    getBounds() {
        return this.element.getBoundingClientRect();
    }

    isOffScreen() {
        const rect = this.getBounds();
        const containerRect = this.container.getBoundingClientRect();
        return rect.right < containerRect.left;
    }

    hasPlayerPassed(playerBounds) {
        if (this.passed) return false;
        
        const bounds = this.getBounds();
        if (bounds.right < playerBounds.left) {
            this.passed = true;
            return true;
        }
        return false;
    }

    /**
     * Enemy is hit by projectile
     */
    hit() {
        if (this.destroyed) return false;
        
        this.element.classList.add('entity--hit');
        this.destroy();
        return true;
    }

    destroy() {
        if (this.destroyed) return;
        this.destroyed = true;
        
        // Add explosion effect before removing
        setTimeout(() => {
            if (this.element && this.element.parentElement) {
                this.element.remove();
            }
        }, 100);
    }
}