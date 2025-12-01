/**
 * PROJECTILE CLASS
 * Bullets fired by the player
 */

class Projectile {
    constructor(container, startLeft, startBottom) {
        this.container = container;
        this.startLeft = startLeft;
        this.startBottom = startBottom;
        this.destroyed = false;
        
        this.element = this.createElement();
        this.container.appendChild(this.element);
    }

    createElement() {
        const element = document.createElement('div');
        element.className = 'projectile';
        
        // Set starting position
        element.style.left = `${this.startLeft}%`;
        element.style.bottom = `${this.startBottom}px`;
        
        // Calculate animation duration
        const containerWidth = this.container.getBoundingClientRect().width;
        const startPixels = (this.startLeft / 100) * containerWidth;
        const distance = containerWidth - startPixels + 50; // Extra 50px off-screen
        const duration = Helpers.calculateDuration(distance, CONSTANTS.PROJECTILE.SPEED);
        
        element.style.animationDuration = `${duration}ms`;
        
        // Start animation
        requestAnimationFrame(() => {
            element.classList.add('projectile--moving');
        });
        
        return element;
    }

    getBounds() {
        return this.element.getBoundingClientRect();
    }

    /**
     * Check if projectile is off screen (right side)
     */
    isOffScreen() {
        const rect = this.getBounds();
        const containerRect = this.container.getBoundingClientRect();
        return rect.left > containerRect.right;
    }

    destroy() {
        if (this.destroyed) return;
        this.destroyed = true;
        
        if (this.element && this.element.parentElement) {
            this.element.remove();
        }
    }
}