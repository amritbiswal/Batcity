// --------- SOUND ENGINE (Web Audio) ---------

const Sound = (() => {
  let ctx = null;
  let enabled = true;
  let muted = false;

  function ensureContext() {
    if (!enabled) return null;
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) {
        enabled = false;
        return null;
      }
      ctx = new AC();
    }
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    return ctx;
  }

  function beep({ freq = 440, duration = 0.1, type = "square", volume = 0.2 }) {

    if (muted) return;

    const audio = ensureContext();
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

  function sweep({ from = 440, to = 880, duration = 0.15, volume = 0.15 }) {

    if (muted) return;

    const audio = ensureContext();
    if (!audio) return;

    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = "square";
    gain.gain.value = volume;

    osc.connect(gain);
    gain.connect(audio.destination);

    const now = audio.currentTime;
    osc.frequency.setValueAtTime(from, now);
    osc.frequency.linearRampToValueAtTime(to, now + duration);

    osc.start(now);
    osc.stop(now + duration);
  }

  return {
    unlock() {
      ensureContext();
    },
    toggleMute() {
      muted = !muted;
      return muted;
    },
    isMuted() {
      return muted;
    },
    mute() {
      muted = true;
    },
    unmute() {
      muted = false;
    },
    playJump() {
      sweep({ from: 400, to: 750, duration: 0.12, volume: 0.18 });
    },
    playShoot() {
      beep({ freq: 900, duration: 0.05, type: "square", volume: 0.18 });
    },
    playEnemyHit() {
      sweep({ from: 800, to: 400, duration: 0.12, volume: 0.2 });
    },
    playCivilianSave() {
      sweep({ from: 500, to: 900, duration: 0.18, volume: 0.15 });
    },
    playBossIntro() {
      // two quick low beeps
      beep({ freq: 220, duration: 0.12, type: "sawtooth", volume: 0.25 });
      setTimeout(
        () =>
          beep({
            freq: 200,
            duration: 0.16,
            type: "sawtooth",
            volume: 0.25,
          }),
        130
      );
    },
    playJokerHit() {
      sweep({ from: 700, to: 300, duration: 0.18, volume: 0.22 });
    },
    playGameOver() {
      sweep({ from: 400, to: 150, duration: 0.3, volume: 0.25 });
    },
    playJokerShot() {
      beep({ freq: 260, duration: 0.12, type: "square", volume: 0.22 });
    },
  };
})();

// --------- DOM ELEMENTS ---------

const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const endScreen = document.getElementById("end-screen");

const btnStart = document.getElementById("btn-start");
const btnRestart = document.getElementById("btn-restart");
const btnBack = document.getElementById("btn-back");
const btnMute = document.getElementById("btn-mute");
const btnTheme = document.getElementById("btn-theme");

const gameContainer = document.getElementById("game-container");
const playerEl = document.getElementById("player");
const jokerEl = document.getElementById("joker");

const scoreEl = document.getElementById("score");
const highscoreEl = document.getElementById("highscore");
const jokerHpWrapperEl = document.getElementById("joker-hp-wrapper");
const jokerHpEl = document.getElementById("joker-hp");

const btnJump = document.getElementById("btn-jump");
const btnShoot = document.getElementById("btn-shoot");

const endTitleEl = document.getElementById("end-title");
const endMessageEl = document.getElementById("end-message");
const finalScoreEl = document.getElementById("final-score");

const bgEl = document.querySelector(".game-bg");
const bossBannerEl = document.getElementById("boss-banner");

// ✅ ADD: Pause menu elements
const pauseMenu = document.getElementById("pause-menu");
const btnPause = document.getElementById("btn-pause");
const btnContinue = document.getElementById("btn-continue");
const btnRestartPause = document.getElementById("btn-restart-pause");
const btnQuit = document.getElementById("btn-quit");

// --------- CORE STATE ---------

let GAME_WIDTH = 800;
let GAME_HEIGHT = 300;
let GROUND_HEIGHT_PX = 60;

// Player physics (vertical)
let playerX = 0;
let playerY = 0;
let playerVy = 0;
const GRAVITY = -1600;
const JUMP_VELOCITY = 600;
let onGround = true;

// Horizontal movement (boss phase)
const PLAYER_BASE_X_RATIO = 0.15;  // default X as fraction of width
const PLAYER_SPEED = 220;          // px/s
let moveLeft = false;
let moveRight = false;

// Double jump
let jumpsUsed = 0;
const MAX_JUMPS = 2;

// Joker vertical movement (boss phase)
let jokerY = 0;
let jokerVy = 0;
let JOKER_MIN_Y = 0;
let JOKER_MAX_Y = 0;
const JOKER_VERTICAL_SPEED = 80;

// Game state
let running = false;
let paused = false;
let score = 0;
let highscore = 0;
let phase = 1; // runner phase (1 = only obst., 2 = +enemies, 3 = +civilians)

// Boss cycle state
let bossActive = false;
const JOKER_MAX_HP = 10;
let jokerHp = JOKER_MAX_HP;

// Boss appears every 600 score
const BOSS_SCORE_STEP = 600;
let lastBossScore = 0;
let nextBossScore = BOSS_SCORE_STEP;
let bossCount = 0; // how many bosses defeated => difficulty scaling

// Time
let lastTime = null;

// Entities
let entities = [];   // obstacles, enemies, civilians
let bullets = [];    // Batman bullets
let jokerBullets = [];

// Spawn timers
let lastObstacleSpawn = 0;
let lastEnemySpawn = 0;
let lastCivilianSpawn = 0;
let lastBulletTime = 0;
let lastJokerBulletTime = 0;

// World config (base; will be scaled by bossCount)
let worldSpeed = 160;
let obstacleInterval = 2000;
let enemyInterval = 2600;
let civilianInterval = 3500;
let bgSpeedSeconds = 5;

// Bullet config
const BULLET_SPEED = 320;
const BULLET_COOLDOWN = 200;

const JOKER_BULLET_SPEED = 220;
const JOKER_BULLET_INTERVAL = 900;

// --------- HELPERS ---------

function showScreen(screen) {
  [startScreen, gameScreen, endScreen].forEach((s) =>
    s.classList.remove("screen--active")
  );
  screen.classList.add("screen--active");
}

function updateDimensions() {
  const rect = gameContainer.getBoundingClientRect();
  GAME_WIDTH = rect.width || 800;
  GAME_HEIGHT = rect.height || 300;
  GROUND_HEIGHT_PX = GAME_HEIGHT * 0.2;

  // Joker vertical bounds
  JOKER_MIN_Y = GROUND_HEIGHT_PX;
  JOKER_MAX_Y = GAME_HEIGHT * 0.7;
}

function clearAllObjects() {
  entities.forEach((e) => e.el.remove());
  bullets.forEach((b) => b.el.remove());
  jokerBullets.forEach((b) => b.el.remove());
  entities = [];
  bullets = [];
  jokerBullets = [];
}

function applyDifficultyConfig() {
  if (!bgEl) return;

  if (bossActive) {
    bgEl.style.animationPlayState = "paused";
  } else {
    bgEl.style.animationPlayState = "running";
    bgEl.style.animationDuration = `${bgSpeedSeconds}s`;
  }
}

// Update difficulty for runner phases based on:
// - score within current cycle (score - lastBossScore)
// - bossCount (each defeated boss increases difficulty)
function updateDifficulty() {
  if (bossActive) {
    // Boss fight has its own fixed feel; no change here
    return;
  }

  const segmentScore = score - lastBossScore; // score since last boss
  // Keep original "easy" thresholds within a cycle
  if (segmentScore < 30) {
    phase = 1;
  } else if (segmentScore < 80) {
    phase = 2;
  } else {
    phase = 3;
  }

  // Base values per runner phase
  let baseSpeed;
  let baseObstacleInterval;
  let baseEnemyInterval;
  let baseCivilianInterval;
  let baseBgSeconds;

  if (phase === 1) {
    baseSpeed = 150;
    baseObstacleInterval = 2100;
    baseEnemyInterval = 2600;
    baseCivilianInterval = 3500;
    baseBgSeconds = 5;
  } else if (phase === 2) {
    baseSpeed = 170;
    baseObstacleInterval = 1900;
    baseEnemyInterval = 2600;
    baseCivilianInterval = 3500;
    baseBgSeconds = 4.6;
  } else {
    baseSpeed = 190;
    baseObstacleInterval = 1700;
    baseEnemyInterval = 2400;
    baseCivilianInterval = 3200;
    baseBgSeconds = 4.2;
  }

  // Difficulty scaling with each defeated boss
  const difficultyFactor = 1 + bossCount * 0.25; // +25% per boss

  worldSpeed = baseSpeed * difficultyFactor;

  obstacleInterval = baseObstacleInterval / difficultyFactor;
  enemyInterval = baseEnemyInterval / difficultyFactor;
  civilianInterval = baseCivilianInterval / difficultyFactor;

  bgSpeedSeconds = baseBgSeconds / (0.9 + bossCount * 0.1); // speed up background a bit

  applyDifficultyConfig();
}

function enterBossPhase() {
  bossActive = true;
  phase = 4;
  clearAllObjects();

  jokerHp = JOKER_MAX_HP;
  if (jokerHpWrapperEl && jokerHpEl) {
    jokerHpWrapperEl.classList.add("hud-joker--active");
    jokerHpEl.textContent = jokerHp;
  }

  // Joker starts at ground and moves vertically
  jokerY = JOKER_MIN_Y;
  jokerVy = JOKER_VERTICAL_SPEED;
  jokerEl.style.bottom = `${jokerY}px`;

  applyDifficultyConfig();

  // PLAY BOSS INTRO SOUND
  Sound.playBossIntro();
}

// Boss banner
function showBossBanner(text) {
  if (!bossBannerEl) return;
  bossBannerEl.textContent = text;
  bossBannerEl.classList.add("boss-banner--visible");

  setTimeout(() => {
    if (bossBannerEl) {
      bossBannerEl.classList.remove("boss-banner--visible");
    }
  }, 1200);
}
// Enter boss phase

function enterBossPhase() {
  bossActive = true;
  phase = 4;
  clearAllObjects();

  jokerHp = JOKER_MAX_HP;
  if (jokerHpWrapperEl && jokerHpEl) {
    jokerHpWrapperEl.classList.add("hud-joker--active");
    jokerHpEl.textContent = jokerHp;
  }

  // Joker starts at ground and moves vertically
  jokerY = JOKER_MIN_Y;
  jokerVy = JOKER_VERTICAL_SPEED;
  jokerEl.style.bottom = `${jokerY}px`;

  applyDifficultyConfig();

  showBossBanner(`BOSS FIGHT ${bossCount + 1}`);
}

function exitBossPhaseAfterVictory() {
  bossActive = false;
  bossCount += 1;

  // Update boss cycle thresholds
  lastBossScore = nextBossScore;
  nextBossScore += BOSS_SCORE_STEP;

  // Clean boss bullets
  jokerBullets.forEach((b) => b.el.remove());
  jokerBullets = [];
  bullets.forEach((b) => b.el.remove());
  bullets = [];

  // Reset Joker to ground, no vertical movement (just being chased again)
  jokerY = JOKER_MIN_Y;
  jokerVy = 0;
  jokerEl.style.bottom = `${jokerY}px`;

  // Hide HP HUD again until next boss
  if (jokerHpWrapperEl && jokerHpEl) {
    jokerHpWrapperEl.classList.remove("hud-joker--active");
    jokerHpEl.textContent = "-";
  }

  // Recalculate runner difficulty with new bossCount
  updateDifficulty();
}

// --------- RESET / START / END ---------

function resetGameState() {
  updateDimensions();
  clearAllObjects();

  score = 0;
  scoreEl.textContent = "0";
  phase = 1;
  bossActive = false;
  jokerHp = JOKER_MAX_HP;

  bossCount = 0;
  lastBossScore = 0;
  nextBossScore = BOSS_SCORE_STEP;

  if (jokerHpWrapperEl && jokerHpEl) {
    jokerHpWrapperEl.classList.remove("hud-joker--active");
    jokerHpEl.textContent = "-";
  }

  updateDifficulty();

  // Player initial position
  playerX = GAME_WIDTH * PLAYER_BASE_X_RATIO;
  playerY = GROUND_HEIGHT_PX;
  playerVy = 0;
  onGround = true;
  jumpsUsed = 0;
  playerEl.style.left = `${playerX}px`;
  playerEl.style.bottom = `${playerY}px`;

  // Joker initial position (chased from start, ground level)
  jokerY = GROUND_HEIGHT_PX;
  jokerVy = 0;
  jokerEl.style.bottom = `${jokerY}px`;

  lastTime = null;
  lastObstacleSpawn = 0;
  lastEnemySpawn = 0;
  lastCivilianSpawn = 0;
  lastBulletTime = 0;
  lastJokerBulletTime = 0;

  moveLeft = false;
  moveRight = false;
}

function startGame() {
  resetGameState();
  running = true;
  showScreen(gameScreen);
  requestAnimationFrame(gameLoop);
}

function endGame(reasonText, options = {}) {
  running = false;

  endTitleEl.textContent = options.title || "Game Over";
  endMessageEl.textContent = reasonText;
  finalScoreEl.textContent = Math.floor(score);

  localStorage.setItem("batmanRunnerHighScore", String(highscore));

  showScreen(endScreen);
}

// --------- ENTITY HELPERS ---------

function positionEntity(entity) {
  entity.el.style.left = `${entity.x}px`;
  entity.el.style.bottom = `${entity.y}px`;
}

function spawnObstacle() {
  const el = document.createElement("div");
  el.className = "obstacle";
  gameContainer.appendChild(el);

  const e = {
    el,
    type: "obstacle",
    x: GAME_WIDTH,
    y: GROUND_HEIGHT_PX,
    vx: -worldSpeed,
  };
  positionEntity(e);
  entities.push(e);
}

function spawnEnemy() {
  const el = document.createElement("div");
  el.className = "enemy";
  gameContainer.appendChild(el);

  const e = {
    el,
    type: "enemy",
    x: GAME_WIDTH,
    y: GROUND_HEIGHT_PX,
    vx: -worldSpeed * 1.05,
  };
  positionEntity(e);
  entities.push(e);
}

function spawnCivilian() {
  const el = document.createElement("div");
  el.className = "civilian";
  gameContainer.appendChild(el);

  const e = {
    el,
    type: "civilian",
    x: GAME_WIDTH,
    y: GROUND_HEIGHT_PX,
    vx: -worldSpeed * 0.9,
  };
  positionEntity(e);
  entities.push(e);
}

function spawnBullet(ts) {
  if (ts - lastBulletTime < BULLET_COOLDOWN) return;

  const el = document.createElement("div");
  el.className = "bullet";
  gameContainer.appendChild(el);

  const playerRect = playerEl.getBoundingClientRect();
  const containerRect = gameContainer.getBoundingClientRect();

  const startX = playerRect.right - containerRect.left;
  const bulletY = playerY + 18;

  const b = {
    el,
    x: startX,
    y: bulletY,
    vx: BULLET_SPEED,
  };

  positionEntity(b);
  bullets.push(b);
  lastBulletTime = ts;
}

function spawnJokerBullet(ts) {
  if (!bossActive) return;
  if (ts - lastJokerBulletTime < JOKER_BULLET_INTERVAL) return;

  const el = document.createElement("div");
  el.className = "bullet";
  gameContainer.appendChild(el);

  const jokerRect = jokerEl.getBoundingClientRect();
  const containerRect = gameContainer.getBoundingClientRect();

  const startX = jokerRect.left - containerRect.left - 16; // bullet width
  const bulletY = jokerY + 18; // Joker's vertical position

  const b = {
    el,
    x: startX,
    y: bulletY,
    vx: -JOKER_BULLET_SPEED,
  };

  positionEntity(b);
  jokerBullets.push(b);
  lastJokerBulletTime = ts;

  // PLAY JOKER SHOT SOUND
  Sound.playJokerShot();
}

// --------- COLLISIONS ---------

function rectsOverlap(a, b) {
  return !(
    a.right < b.left ||
    a.left > b.right ||
    a.bottom < b.top ||
    a.top > b.bottom
  );
}

function checkPlayerCollisions() {
  if (bossActive) return false; // no ground entities in boss phase

  const playerRect = playerEl.getBoundingClientRect();

  for (let i = entities.length - 1; i >= 0; i--) {
    const e = entities[i];
    const r = e.el.getBoundingClientRect();

    if (!rectsOverlap(playerRect, r)) continue;

    if (e.type === "obstacle") {
      endGame("You hit an obstacle.");

      // PLAY GAME OVER SOUND
      Sound.playGameOver();
      return true;
    }

    if (e.type === "enemy") {
      endGame("You collided with an enemy.");

      // PLAY GAME OVER SOUND
      Sound.playGameOver();
      return true;
    }

    if (e.type === "civilian") {
      score += 5;
      scoreEl.textContent = Math.floor(score);

      e.el.remove();
      entities.splice(i, 1);

      // PLAY CIVILIAN SAVE SOUND
      Sound.playCivilianSave();
    }
  }

  return false;
}

function checkBulletCollisionsNormalPhase() {
  if (bossActive) return false;

  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];
    const bRect = bullet.el.getBoundingClientRect();

    for (let j = entities.length - 1; j >= 0; j--) {
      const target = entities[j];
      const tRect = target.el.getBoundingClientRect();

      if (!rectsOverlap(bRect, tRect)) continue;

      if (target.type === "enemy") {
        score += 3;
        scoreEl.textContent = Math.floor(score);

        target.el.remove();
        entities.splice(j, 1);

        bullet.el.remove();
        bullets.splice(i, 1);

        // PLAY ENEMY HIT SOUND
        Sound.playEnemyHit();
        break;
      }

      if (target.type === "civilian") {
        endGame("You shot a civilian!");
        
        // PLAY GAME OVER SOUND
        Sound.playGameOver();
        return true;
      }

      if (target.type === "obstacle") {
        bullet.el.remove();
        bullets.splice(i, 1);
        break;
      }
    }
  }

  return false;
}

function checkPlayerBulletsVsJoker() {
  if (!bossActive) return false;

  const jokerRect = jokerEl.getBoundingClientRect();

  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    const bRect = b.el.getBoundingClientRect();

    if (!rectsOverlap(bRect, jokerRect)) continue;

    // Hit Joker
    b.el.remove();
    bullets.splice(i, 1);

    jokerHp--;
    if (jokerHpEl) {
      jokerHpEl.textContent = jokerHp;
    }

    // PLAY JOKER HIT SOUND
    Sound.playJokerHit();

    if (jokerHp <= 0) {
      // Boss defeated -> go back to runner mode, harder
      exitBossPhaseAfterVictory();
      return true; // we handled the transition; let next frame continue
    }
  }

  return false;
}

function checkJokerBulletsVsPlayer() {
  if (!bossActive) return false;

  const playerRect = playerEl.getBoundingClientRect();

  for (let i = jokerBullets.length - 1; i >= 0; i--) {
    const b = jokerBullets[i];
    const bRect = b.el.getBoundingClientRect();

    if (!rectsOverlap(playerRect, bRect)) continue;

    endGame("Joker shot you.");

    // PLAY GAME OVER SOUND
    Sound.playGameOver();

    return true;
  }

  return false;
}

// --------- GAME LOOP ---------

function gameLoop(ts) {
  if (!running) return;

  // Skip frame if paused
  if (paused) {
    requestAnimationFrame(gameLoop);
    return;
  }

  if (lastTime == null) {
    lastTime = ts;
    requestAnimationFrame(gameLoop);
    return;
  }

  const dt = (ts - lastTime) / 1000;
  lastTime = ts;

   // Clamp delta time to prevent large jumps when tab regains focus
  const clampedDt = Math.min(dt, 0.1); // Max 100ms per frame

  // Score & difficulty
  if (!bossActive) {
    score += dt * 10;
  }
  const displayScore = Math.floor(score);
  scoreEl.textContent = displayScore;

  // Boss trigger every 2000 score
  if (!bossActive && score >= nextBossScore) {
    enterBossPhase();
  }

  updateDifficulty();

  if (displayScore > highscore) {
    highscore = displayScore;
    highscoreEl.textContent = highscore;
  }

  // Player vertical physics
  playerVy += GRAVITY * clampedDt; // ✅ CHANGED: Use clamped delta time
  playerY += playerVy * clampedDt; // ✅ CHANGED: Use clamped delta time

  if (playerY <= GROUND_HEIGHT_PX) {
    playerY = GROUND_HEIGHT_PX;
    playerVy = 0;

    if (!onGround) {
      jumpsUsed = 0;
    }

    onGround = true;
  } else {
    onGround = false;
  }

  // Player horizontal movement (boss phase only)
  if (bossActive) {
    if (moveLeft) {
      playerX -= PLAYER_SPEED * clampedDt; // ✅ CHANGED: Use clamped delta time
    }
    if (moveRight) {
      playerX += PLAYER_SPEED * clampedDt; // ✅ CHANGED: Use clamped delta time
    }

    const minX = GAME_WIDTH * 0.05;
    const maxX = GAME_WIDTH * 0.6;
    if (playerX < minX) playerX = minX;
    if (playerX > maxX) playerX = maxX;
  }

  playerEl.style.left = `${playerX}px`;
  playerEl.style.bottom = `${playerY}px`;

  // Joker vertical movement in boss phase
  if (bossActive) {
    jokerY += jokerVy * clampedDt; // ✅ CHANGED: Use clamped delta time

    if (jokerY < JOKER_MIN_Y) {
      jokerY = JOKER_MIN_Y;
      jokerVy = Math.abs(jokerVy);
    } else if (jokerY > JOKER_MAX_Y) {
      jokerY = JOKER_MAX_Y;
      jokerVy = -Math.abs(jokerVy);
    }

    jokerEl.style.bottom = `${jokerY}px`;
  }

  // Spawns (runner only)
  if (!bossActive && ts - lastObstacleSpawn > obstacleInterval) {
    spawnObstacle();
    lastObstacleSpawn = ts;
  }

  if (!bossActive && phase >= 2 && ts - lastEnemySpawn > enemyInterval) {
    spawnEnemy();
    lastEnemySpawn = ts;
  }

  if (!bossActive && phase >= 3 && ts - lastCivilianSpawn > civilianInterval) {
    spawnCivilian();
    lastCivilianSpawn = ts;
  }

  // Joker bullets in boss phase
  if (bossActive) {
    spawnJokerBullet(ts);
  }

  // Move entities
  for (let i = entities.length - 1; i >= 0; i--) {
    const e = entities[i];
    e.x += e.vx * clampedDt; // ✅ CHANGED: Use clamped delta time
    positionEntity(e);

    if (e.x < -100 || e.x > GAME_WIDTH + 100) {
      e.el.remove();
      entities.splice(i, 1);
    }
  }

  // Move Batman bullets
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.x += b.vx * clampedDt; // ✅ CHANGED: Use clamped delta time
    positionEntity(b);

    if (b.x > GAME_WIDTH + 100) {
      b.el.remove();
      bullets.splice(i, 1);
    }
  }

  // Move Joker bullets
  for (let i = jokerBullets.length - 1; i >= 0; i--) {
    const b = jokerBullets[i];
    b.x += b.vx * clampedDt; // ✅ CHANGED: Use clamped delta time
    positionEntity(b);

    if (b.x < -100) {
      b.el.remove();
      jokerBullets.splice(i, 1);
    }
  }

  // Collisions
  if (checkPlayerCollisions()) return;

  if (!bossActive) {
    if (checkBulletCollisionsNormalPhase()) return;
  } else {
    if (checkPlayerBulletsVsJoker()) {
      // Boss defeated: we returned true; just continue next frame
      requestAnimationFrame(gameLoop);
      return;
    }
    if (checkJokerBulletsVsPlayer()) return;
  }

  requestAnimationFrame(gameLoop);
}

function showPauseMenu() {
  if (!running) return;
  
  paused = true;
  
  if (pauseMenu) {
    pauseMenu.classList.add("pause-menu--visible");
  }
  
  if (bgEl) {
    bgEl.style.animationPlayState = "paused";
  }
  
  console.log("⏸️ Game paused (manual)");
}

function hidePauseMenu() {
  if (!running) return;
  
  paused = false;
  lastTime = null; // Reset timing to prevent delta jump
  
  if (pauseMenu) {
    pauseMenu.classList.remove("pause-menu--visible");
  }
  
  if (bgEl && !bossActive) {
    bgEl.style.animationPlayState = "running";
  }
  
  console.log("▶️ Game resumed (manual)");
}

function togglePause() {
  if (!running) return;
  
  if (paused) {
    hidePauseMenu();
  } else {
    showPauseMenu();
  }
}

// --------- INPUT ---------

function handleJump() {
  if (!running) return;

  if (onGround || jumpsUsed < MAX_JUMPS) {
    playerVy = JUMP_VELOCITY;
    jumpsUsed++;
    onGround = false;

    // PLAY JUMP SOUND
    Sound.playJump();
  }
}

function handleShoot() {
  if (!running) return;
  spawnBullet(performance.now());

  // PLAY SHOOT SOUND
  Sound.playShoot();
}

// Toggle mute function with visual update
function handleMuteToggle() {
  const isMuted = Sound.toggleMute();
  
  // Update button appearance
  if (btnMute) {
    if (isMuted) {
      btnMute.classList.add("muted");
    } else {
      btnMute.classList.remove("muted");
    }
  }
  
  // Save mute preference to localStorage
  localStorage.setItem("batmanRunnerMuted", String(isMuted));
}

function handleThemeToggle() {
  const body = document.body;
  const isLight = body.classList.toggle("light-theme");
  
  // Update theme toggle button
  if (btnTheme) {
    const icon = btnTheme.querySelector(".theme-icon");
    
    if (isLight) {
      btnTheme.classList.add("light");
      if (icon) icon.textContent = "☀️";
    } else {
      btnTheme.classList.remove("light");
      if (icon) icon.textContent = "🌙";
    }
  }
  
  // Save theme preference to localStorage
  localStorage.setItem("batmanRunnerTheme", isLight ? "light" : "dark");
}


// Keyboard
window.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    e.preventDefault();
    if (!paused) { // ✅ Only jump if not paused
      handleJump();
    }
  }
  if (e.code === "KeyF") {
    e.preventDefault();
    if (!paused) { // ✅ Only shoot if not paused
      handleShoot();
    }
  }
    // ✅ ADD: Pause/unpause with ESC or P
  if (e.code === "Escape" || e.code === "KeyP") {
    e.preventDefault();
    togglePause();
  }

  if (e.code === "ArrowLeft" || e.code === "KeyA") {
    moveLeft = true;
  }
  if (e.code === "ArrowRight" || e.code === "KeyD") {
    moveRight = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (e.code === "ArrowLeft" || e.code === "KeyA") {
    moveLeft = false;
  }
  if (e.code === "ArrowRight" || e.code === "KeyD") {
    moveRight = false;
  }
});

// Mobile - disable controls when paused
btnJump.addEventListener("click", () => {
  if (!paused) handleJump(); // ✅ Only if not paused
});

btnShoot.addEventListener("click", () => {
  if (!paused) handleShoot(); // ✅ Only if not paused
});

// ✅ ADD: Pause button event listeners
if (btnPause) {
  btnPause.addEventListener("click", togglePause);
}

if (btnContinue) {
  btnContinue.addEventListener("click", hidePauseMenu);
}

if (btnRestartPause) {
  btnRestartPause.addEventListener("click", () => {
    hidePauseMenu();
    Sound.unlock();
    startGame();
  });
}

if (btnQuit) {
  btnQuit.addEventListener("click", () => {
    hidePauseMenu();
    running = false;
    resetGameState();
    showScreen(startScreen);
  });
}

// Buttons
btnStart.addEventListener("click", () => {
  Sound.unlock();
  startGame();
});
btnRestart.addEventListener("click", () => {
  Sound.unlock();
  startGame();
});
btnBack.addEventListener("click", () => {
  resetGameState();
  showScreen(startScreen);
});

// Theme button
if (btnTheme) {
  btnTheme.addEventListener("click", handleThemeToggle);
}

// Mute button
if (btnMute) {
  btnMute.addEventListener("click", handleMuteToggle);
}

// ✅ MODIFY: Window blur/focus - now shows pause menu
window.addEventListener("blur", () => {
  if (running && !paused) {
    showPauseMenu(); // ✅ Show pause menu instead of silent pause
  }
});

window.addEventListener("focus", () => {
  // Don't auto-resume - player must click Continue
  // This is intentional so player doesn't accidentally resume
  console.log("👀 Window focused - click Continue to resume");
});

// ✅ ADD: Visibility change - show pause menu
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    if (running && !paused) {
      showPauseMenu();
    }
  }
});

// Resize
window.addEventListener("resize", updateDimensions);

// Highscore from storage
const stored = localStorage.getItem("batmanRunnerHighScore");
if (stored) {
  highscore = Number(stored) || 0;
  highscoreEl.textContent = highscore;
}

// Load mute preference from storage
const storedMute = localStorage.getItem("batmanRunnerMuted");
if (storedMute === "true") {
  Sound.mute();
  if (btnMute) {
    btnMute.classList.add("muted");
  }
}

// Load theme preference from storage
const storedTheme = localStorage.getItem("batmanRunnerTheme");
if (storedTheme === "light") {
  document.body.classList.add("light-theme");
  if (btnTheme) {
    btnTheme.classList.add("light");
    const icon = btnTheme.querySelector(".theme-icon");
    if (icon) icon.textContent = "☀️";
  }
}

// Init
resetGameState();
showScreen(startScreen);
