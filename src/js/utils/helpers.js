/**
 * HELPER UTILITIES
 * Reusable functions for game logic
 */

const Helpers = {
    /**
     * Check if two rectangles overlap (AABB collision)
     * @param {DOMRect} rect1 - First bounding box
     * @param {DOMRect} rect2 - Second bounding box
     * @param {number} tolerance - Pixel tolerance for collision
     * @returns {boolean}
     */
    checkCollision(rect1, rect2, tolerance = CONSTANTS.COLLISION_TOLERANCE) {
        return !(
            rect1.right - tolerance < rect2.left ||
            rect1.left + tolerance > rect2.right ||
            rect1.bottom - tolerance < rect2.top ||
            rect1.top + tolerance > rect2.bottom
        );
    },

    /**
     * Get random integer between min and max (inclusive)
     */
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * Get random float between min and max
     */
    randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    },

    /**
     * Weighted random selection
     * @param {Array} items - Array of items to choose from
     * @param {Object} weights - Object with weights for each item
     * @returns {*} Selected item
     */
    weightedRandom(items, weights) {
        const total = items.reduce((sum, item) => sum + weights[item], 0);
        let random = Math.random() * total;
        
        for (const item of items) {
            random -= weights[item];
            if (random <= 0) {
                return item;
            }
        }
        
        return items[items.length - 1];
    },

    /**
     * Clamp value between min and max
     */
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },

    /**
     * Linear interpolation
     */
    lerp(start, end, t) {
        return start + (end - start) * t;
    },

    /**
     * Get element's position relative to container
     */
    getRelativePosition(element, container) {
        const elemRect = element.getBoundingClientRect();
        const contRect = container.getBoundingClientRect();
        
        return {
            left: elemRect.left - contRect.left,
            top: elemRect.top - contRect.top,
            right: elemRect.right - contRect.left,
            bottom: elemRect.bottom - contRect.top
        };
    },

    /**
     * Calculate animation duration based on speed
     */
    calculateDuration(distance, speed) {
        return (distance / speed) * 1000; // Convert to ms
    },

    /**
     * Debounce function calls
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Format score with leading zeros
     */
    formatScore(score) {
        return Math.floor(score).toString().padStart(5, '0');
    }
};