import { GameManager } from './GameManager.js';

// Initialize game
let game;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    game = new GameManager();
  });
} else {
  game = new GameManager();
}

// Expose game to window for debugging
window.game = game;