import { CONFIG } from './config.js';

export class UIManager {
  constructor() {
    this.initElements();
  }

  initElements() {
    this.screens = {
      start: document.getElementById('start-screen'),
      game: document.getElementById('game-screen'),
      end: document.getElementById('end-screen')
    };

    this.scoreEl = document.getElementById('score');
    this.highscoreEl = document.getElementById('highscore');
    this.jokerHpWrapper = document.getElementById('joker-hp-wrapper');
    this.jokerHpEl = document.getElementById('joker-hp');
    this.bgEl = document.querySelector('.game-bg');
    this.bossBanner = document.getElementById('boss-banner');
    this.pauseMenu = document.getElementById('pause-menu');
    this.endTitle = document.getElementById('end-title');
    this.endMessage = document.getElementById('end-message');
    this.finalScore = document.getElementById('final-score');
  }

  showScreen(screenName) {
    Object.values(this.screens).forEach(s => s?.classList.remove('screen--active'));
    this.screens[screenName]?.classList.add('screen--active');
  }

  updateScore(score) {
    if (this.scoreEl) {
      this.scoreEl.textContent = Math.floor(score);
    }
  }

  updateHighscore(highscore) {
    if (this.highscoreEl) {
      this.highscoreEl.textContent = highscore;
    }
  }

  showJokerHP(hp) {
    if (this.jokerHpWrapper) {
      this.jokerHpWrapper.classList.add('hud-joker--active');
    }
    if (this.jokerHpEl) {
      this.jokerHpEl.textContent = hp;
    }
  }

  hideJokerHP() {
    if (this.jokerHpWrapper) {
      this.jokerHpWrapper.classList.remove('hud-joker--active');
    }
    if (this.jokerHpEl) {
      this.jokerHpEl.textContent = '-';
    }
  }

  updateJokerHP(hp) {
    if (this.jokerHpEl) {
      this.jokerHpEl.textContent = hp;
    }
  }

  showBossBanner(text) {
    if (!this.bossBanner) return;
    
    this.bossBanner.textContent = text;
    this.bossBanner.classList.add('boss-banner--visible');
    
    setTimeout(() => {
      this.bossBanner?.classList.remove('boss-banner--visible');
    }, 1200);
  }

  showPauseMenu() {
    if (this.pauseMenu) {
      this.pauseMenu.classList.add('pause-menu--visible');
    }
    if (this.bgEl) {
      this.bgEl.style.animationPlayState = 'paused';
    }
  }

  hidePauseMenu() {
    if (this.pauseMenu) {
      this.pauseMenu.classList.remove('pause-menu--visible');
    }
  }

  updateBackground(speed, paused) {
    if (!this.bgEl) return;
    
    if (paused) {
      this.bgEl.style.animationPlayState = 'paused';
    } else {
      this.bgEl.style.animationPlayState = 'running';
      this.bgEl.style.animationDuration = `${speed}s`;
    }
  }

  showEndScreen(title, message, finalScore) {
    if (this.endTitle) this.endTitle.textContent = title;
    if (this.endMessage) this.endMessage.textContent = message;
    if (this.finalScore) this.finalScore.textContent = finalScore;
    this.showScreen('end');
  }

  loadPreferences(highscore, themeButton, muteButton) {
    // Load high score
    const storedHighscore = localStorage.getItem(CONFIG.storage.highscoreKey);
    if (storedHighscore) {
      const score = parseInt(storedHighscore) || 0;
      this.updateHighscore(score);
      return score;
    }

    // Load theme
    const storedTheme = localStorage.getItem(CONFIG.storage.themeKey);
    if (storedTheme === 'light') {
      document.body.classList.add('light-theme');
      if (themeButton) {
        themeButton.classList.add('light');
        const icon = themeButton.querySelector('.theme-icon');
        if (icon) icon.textContent = '☀️';
      }
    }

    // Load mute preference
    const storedMute = localStorage.getItem(CONFIG.storage.muteKey);
    if (storedMute === 'true' && muteButton) {
      muteButton.classList.add('muted');
      return { muted: true };
    }

    return { highscore: highscore || 0, muted: false };
  }

  saveHighscore(score) {
    localStorage.setItem(CONFIG.storage.highscoreKey, String(score));
  }

  saveTheme(isLight) {
    localStorage.setItem(CONFIG.storage.themeKey, isLight ? 'light' : 'dark');
  }

  saveMute(muted) {
    localStorage.setItem(CONFIG.storage.muteKey, String(muted));
  }
}