/**
 * SCORE MANAGER
 * Handles all scoring logic and high score persistence
 */

class ScoreManager {
    constructor() {
        this.score = 0;
        this.highScore = this.loadHighScore();
        
        // Time tracking for passive scoring
        this.lastScoreTime = 0;
        
        // Event callbacks
        this.onScoreChange = null;
        this.onHighScoreBeaten = null;
    }

    /**
     * Register score change callback
     */
    onScore(callback) {
        this.onScoreChange = callback;
    }

    /**
     * Register high score beaten callback
     */
    onHighScore(callback) {
        this.onHighScoreBeaten = callback;
    }

    /**
     * Start scoring (reset and begin time tracking)
     */
    start() {
        this.score = 0;
        this.lastScoreTime = performance.now();
        this.updateDisplay();
    }

    /**
     * Update score based on time elapsed
     */
    update(currentTime) {
        const deltaTime = (currentTime - this.lastScoreTime) / 1000; // Convert to seconds
        
        // Add time-based score
        const timeScore = deltaTime * CONSTANTS.SCORE.TIME_MULTIPLIER;
        this.addScore(timeScore);
        
        this.lastScoreTime = currentTime;
    }

    /**
     * Add score from events
     */
    addScore(points) {
        this.score += points;
        this.updateDisplay();
        
        // Check if high score was beaten
        if (this.score > this.highScore) {
            this.highScore = Math.floor(this.score);
            this.saveHighScore();
            
            if (this.onHighScoreBeaten) {
                this.onHighScoreBeaten(this.highScore);
            }
        }
    }

    /**
     * Score events
     */
    onObstaclePassed() {
        this.addScore(CONSTANTS.SCORE.OBSTACLE_PASS);
    }

    onEnemyKilled() {
        this.addScore(CONSTANTS.SCORE.ENEMY_KILL);
    }

    onCivilianSaved() {
        this.addScore(CONSTANTS.SCORE.CIVILIAN_SAVE);
    }

    /**
     * Get current score (rounded)
     */
    getScore() {
        return Math.floor(this.score);
    }

    /**
     * Get high score
     */
    getHighScore() {
        return this.highScore;
    }

    /**
     * Update score display
     */
    updateDisplay() {
        if (this.onScoreChange) {
            this.onScoreChange(this.getScore());
        }
    }

    /**
     * Load high score from localStorage
     */
    loadHighScore() {
        const stored = localStorage.getItem('batcity_highscore');
        return stored ? parseInt(stored, 10) : 0;
    }

    /**
     * Save high score to localStorage
     */
    saveHighScore() {
        localStorage.setItem('batcity_highscore', this.highScore.toString());
    }

    /**
     * Reset current score
     */
    reset() {
        this.score = 0;
        this.lastScoreTime = 0;
        this.updateDisplay();
    }

    /**
     * Clear high score (for debugging/testing)
     */
    clearHighScore() {
        this.highScore = 0;
        localStorage.removeItem('batcity_highscore');
        this.updateDisplay();
    }
}