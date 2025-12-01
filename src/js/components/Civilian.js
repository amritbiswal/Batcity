/**
 * CIVILIAN CLASS
 * NPCs to be saved (don't shoot!)
 */

class Civilian {
    constructor(container, speed) {
        this.container = container;
        this.speed = speed;
        this.destroyed = false;
        this.saved = false;
        
        this.element = this.createElement();
        this.container.appendChild(this.element);
    }

    createElement() {
        const element = document.createElement('div');
        element.className = 'entity entity--civilian';
        
        const containerWidth = this.container.getBoundingClientRect().width;
        const distance = containerWidth * 1.2;
        const duration = Helpers.calculateDuration(distance, this.speed);
        
        element.style.animationDuration = `${duration}ms`;
        
        const icon = document.createElement('div');
        icon.className = 'entity__icon';
        icon.textContent = '👤';
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

    /**
     * Civilian is saved by player contact
     */
    save() {
        if (this.destroyed || this.saved) return false;
        
        this.saved = true;
        this.element.classList.add('entity--saved');
        this.destroy();
        return true;
    }

    /**
     * Civilian is hit by projectile (BAD!)
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
        
        setTimeout(() => {
            if (this.element && this.element.parentElement) {
                this.element.remove();
            }
        }, 100);
    }
}