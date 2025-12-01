/**
 * SCREEN MANAGER
 * Manages screen transitions and visibility
 */

class ScreenManager {
    constructor() {
        this.screens = {
            start: document.getElementById('start-screen'),
            game: document.getElementById('game-screen'),
            end: document.getElementById('end-screen')
        };
        
        this.currentScreen = 'start';
    }

    /**
     * Show a specific screen
     */
    show(screenName) {
        // Hide all screens
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('screen--active');
        });

        // Show requested screen
        if (this.screens[screenName]) {
            this.screens[screenName].classList.add('screen--active');
            this.currentScreen = screenName;
        }
    }

    /**
     * Get current active screen
     */
    getCurrent() {
        return this.currentScreen;
    }

    /**
     * Show start screen
     */
    showStart() {
        this.show('start');
    }

    /**
     * Show game screen
     */
    showGame() {
        this.show('game');
    }

    /**
     * Show end screen
     */
    showEnd() {
        this.show('end');
    }
}