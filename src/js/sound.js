export class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.muted = false;
  }

  ensureContext() {
    if (!this.enabled) return null;
    
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        this.enabled = false;
        return null;
      }
      this.ctx = new AudioContextClass();
    }
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    
    return this.ctx;
  }

  beep({ freq = 440, duration = 0.1, type = 'square', volume = 0.2 }) {
    if (this.muted) return;
    
    const audio = this.ensureContext();
    if (!audio) return;

    const osc = audio.createOscillator();
    const gain = audio.createGain();

    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = volume;

    osc.connect(gain);
    gain.connect(audio.destination);

    const now = audio.currentTime;
    osc.start(now);
    osc.stop(now + duration);
  }

  sweep({ from = 440, to = 880, duration = 0.15, volume = 0.15 }) {
    if (this.muted) return;
    
    const audio = this.ensureContext();
    if (!audio) return;

    const osc = audio.createOscillator();
    const gain = audio.createGain();
    
    osc.type = 'square';
    gain.gain.value = volume;

    osc.connect(gain);
    gain.connect(audio.destination);

    const now = audio.currentTime;
    osc.frequency.setValueAtTime(from, now);
    osc.frequency.linearRampToValueAtTime(to, now + duration);

    osc.start(now);
    osc.stop(now + duration);
  }

  unlock() {
    this.ensureContext();
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  mute() {
    this.muted = true;
  }

  unmute() {
    this.muted = false;
  }

  isMuted() {
    return this.muted;
  }

  // Game sound effects
  playJump() {
    this.sweep({ from: 400, to: 750, duration: 0.12, volume: 0.18 });
  }

  playShoot() {
    this.beep({ freq: 900, duration: 0.05, type: 'square', volume: 0.18 });
  }

  playEnemyHit() {
    this.sweep({ from: 800, to: 400, duration: 0.12, volume: 0.2 });
  }

  playCivilianSave() {
    this.sweep({ from: 500, to: 900, duration: 0.18, volume: 0.15 });
  }

  playBossIntro() {
    this.beep({ freq: 220, duration: 0.12, type: 'sawtooth', volume: 0.25 });
    setTimeout(() => {
      if (!this.muted) {
        this.beep({ freq: 200, duration: 0.16, type: 'sawtooth', volume: 0.25 });
      }
    }, 130);
  }

  playJokerHit() {
    this.sweep({ from: 700, to: 300, duration: 0.18, volume: 0.22 });
  }

  playGameOver() {
    this.sweep({ from: 400, to: 150, duration: 0.3, volume: 0.25 });
  }

  playJokerShot() {
    this.beep({ freq: 260, duration: 0.12, type: 'square', volume: 0.22 });
  }
}