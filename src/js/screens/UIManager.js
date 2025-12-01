/**
 * UI MANAGER
 * Handles all UI updates and display
 */

class UIManager {
    constructor() {
        // Game screen elements
        this.scoreDisplay = document.getElementById('score-display');
        this.phaseDisplay = document.getElementById('phase-display');
        
        // End screen elements
        this.endTitle = document.getElementById('end-title');
        this.endMessage = document.getElementById('end-message');
        this.finalScoreDisplay = document.getElementById('final-score');
        this.highScoreDisplay = document.getElementById('high-score-display');
        this.highScoreValue = document.getElementById('high-score');
    }

    /**
     * Update score display
     */
    updateScore(score) {
        if (this.scoreDisplay) {
            this.scoreDisplay.textContent = Helpers.formatScore(score);
        }
    }

    /**
     * Update phase display
     */
    updatePhase(phase) {
        if (this.phaseDisplay) {
            this.phaseDisplay.textContent = phase;
        }
    }

    /**
     * Show game over screen
     */
    showGameOver(score, highScore, reason = 'Game Over') {
        // Update end screen title
        if (this.endTitle) {
            this.endTitle.textContent = 'GAME OVER';
            this.endTitle.style.color = '#ff0000';
        }

        // Update end message
        if (this.endMessage) {
            this.endMessage.textContent = reason;
        }

        // Update final score
        if (this.finalScoreDisplay) {
            this.finalScoreDisplay.textContent = Helpers.formatScore(score);
        }

        // Update high score
        this.updateHighScore(highScore);
    }

    /**
     * Update high score display
     */
    updateHighScore(highScore) {
        if (highScore > 0) {
            if (this.highScoreDisplay) {
                this.highScoreDisplay.classList.remove('hidden');
            }
            if (this.highScoreValue) {
                this.highScoreValue.textContent = Helpers.formatScore(highScore);
            }
        } else {
            if (this.highScoreDisplay) {
                this.highScoreDisplay.classList.add('hidden');
            }
        }
    }

    /**
     * Reset game UI
     */
    reset() {
        this.updateScore(0);
        this.updatePhase(1);
    }
}