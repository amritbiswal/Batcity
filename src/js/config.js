export const CONFIG = {
  game: {
    width: 800,
    height: 300,
    groundHeightRatio: 0.2,
    gravity: -1600,
    scorePerSecond: 10
  },
  
  player: {
    jumpVelocity: 600,
    maxJumps: 2,
    speed: 220,
    baseXRatio: 0.15,
    bulletYOffset: 18
  },
  
  joker: {
    maxHp: 10,
    verticalSpeed: 80,
    minYRatio: 0.2,
    maxYRatio: 0.7,
    bulletSpeed: 220,
    bulletInterval: 900,
    xOffset: 100,
    bulletYOffset: 25
  },
  
  bullet: {
    speed: 320,
    cooldown: 200
  },
  
  boss: {
    scoreStep: 600,
    difficultyIncrease: 0.25
  },
  
  phases: {
    1: { 
      worldSpeed: 150, 
      obstacleInterval: 2100, 
      enemyInterval: 2600, 
      civilianInterval: 3500, 
      bgSpeed: 5 
    },
    2: { 
      worldSpeed: 170, 
      obstacleInterval: 1900, 
      enemyInterval: 2600, 
      civilianInterval: 3500, 
      bgSpeed: 4.6 
    },
    3: { 
      worldSpeed: 190, 
      obstacleInterval: 1700, 
      enemyInterval: 2400, 
      civilianInterval: 3200, 
      bgSpeed: 4.2 
    }
  },
  
  spawning: {
    phaseThresholds: {
      enemies: 30,
      civilians: 80
    }
  },
  
  storage: {
    highscoreKey: 'batmanRunnerHighScore',
    themeKey: 'batmanRunnerTheme',
    muteKey: 'batmanRunnerMuted'
  }
};