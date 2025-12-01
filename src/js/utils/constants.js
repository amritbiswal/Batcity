/**
 * GAME CONSTANTS
 * All configurable values for the game
 */

const CONSTANTS = {
    // Game dimensions (responsive)
    GAME_HEIGHT_RATIO: 0.5, // 50vh
    GROUND_HEIGHT_RATIO: 0.2, // 20% of container
    
    // Player settings
    PLAYER: {
        LEFT_POSITION: 10, // % from left
        JUMP_DURATION: 500, // ms
        JUMP_HEIGHT: 60, // % increase from ground
        SIZE: {
            WIDTH: 40,
            HEIGHT: 40
        }
    },
    
    // Entity settings
    ENTITY: {
        BASE_SPEED: 300, // pixels per second
        SPEED_INCREMENT: 20, // increase per 10 score points
        SIZE: {
            WIDTH: 30,
            HEIGHT: 30
        },
        SPAWN_MIN: 1200, // minimum ms between spawns
        SPAWN_MAX: 2500, // maximum ms between spawns
    },
    
    // Projectile settings
    PROJECTILE: {
        SPEED: 600, // pixels per second
        SIZE: {
            WIDTH: 20,
            HEIGHT: 6
        }
    },
    
    // Spawn probabilities (must sum to 1.0)
    SPAWN_WEIGHTS: {
        obstacle: 0.40,
        enemy: 0.35,
        civilian: 0.25
    },
    
    // Scoring
    SCORE: {
        TIME_MULTIPLIER: 1, // points per second
        OBSTACLE_PASS: 2,
        ENEMY_KILL: 3,
        CIVILIAN_SAVE: 5
    },
    
    // Collision tolerance (smaller = stricter)
    COLLISION_TOLERANCE: 8,
    
    // Input keys
    KEYS: {
        JUMP: [' ', 'ArrowUp', 'w', 'W'],
        SHOOT: ['f', 'F', 's', 'S']
    }
};

// Game states
const GAME_STATE = {
    START: 'start',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'gameover'
};

// Entity types
const ENTITY_TYPE = {
    OBSTACLE: 'obstacle',
    ENEMY: 'enemy',
    CIVILIAN: 'civilian'
};