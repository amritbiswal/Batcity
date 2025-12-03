/**
 * MAIN ENTRY POINT
 * Initialize game when DOM is ready
 */

// Global game instance
let game = null;

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🦇 Batcity Runner Loading...');
    
    try {
        // Create game instance
        game = new Game();
        
        // Make game accessible in console for debugging
        window.game = game;
        
        console.log('🎮 Game ready! Click Start to play.');
    } catch (error) {
        console.error('❌ Failed to initialize game:', error);
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (game) {
        game.isRunning = false;
        if (game.animationFrameId) {
            cancelAnimationFrame(game.animationFrameId);
        }
    }
});