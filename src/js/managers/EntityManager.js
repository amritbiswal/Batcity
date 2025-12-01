/**
 * ENTITY MANAGER
 * Handles spawning, updating, and managing all game entities
 */

class EntityManager {
    constructor(container) {
        this.container = container;
        
        // Entity arrays
        this.obstacles = [];
        this.enemies = [];
        this.civilians = [];
        this.projectiles = [];
        
        // Spawn timing
        this.lastSpawnTime = 0;
        this.nextSpawnDelay = 0;
        
        // Speed management
        this.currentSpeed = CONSTANTS.ENTITY.BASE_SPEED;
        
        // State
        this.isActive = false;
    }

    start() {
        this.isActive = true;
        this.lastSpawnTime = performance.now();
        this.scheduleNextSpawn();
    }

    stop() {
        this.isActive = false;
    }

    scheduleNextSpawn() {
        this.nextSpawnDelay = Helpers.randomInt(
            CONSTANTS.ENTITY.SPAWN_MIN,
            CONSTANTS.ENTITY.SPAWN_MAX
        );
    }

    updateSpeed(score) {
        const speedIncrease = Math.floor(score / 10) * CONSTANTS.ENTITY.SPEED_INCREMENT;
        this.currentSpeed = CONSTANTS.ENTITY.BASE_SPEED + speedIncrease;
    }

    spawnEntity() {
        const entityTypes = Object.keys(CONSTANTS.SPAWN_WEIGHTS);
        const entityType = Helpers.weightedRandom(entityTypes, CONSTANTS.SPAWN_WEIGHTS);

        let entity;
        switch (entityType) {
            case ENTITY_TYPE.OBSTACLE:
                entity = new Obstacle(this.container, this.currentSpeed);
                this.obstacles.push(entity);
                break;
            case ENTITY_TYPE.ENEMY:
                entity = new Enemy(this.container, this.currentSpeed);
                this.enemies.push(entity);
                break;
            case ENTITY_TYPE.CIVILIAN:
                entity = new Civilian(this.container, this.currentSpeed);
                this.civilians.push(entity);
                break;
        }

        this.scheduleNextSpawn();
    }

    spawnProjectile(startLeft, startBottom) {
        const projectile = new Projectile(this.container, startLeft, startBottom);
        this.projectiles.push(projectile);
    }

    update(currentTime, deltaTime) {
        if (this.isActive && (currentTime - this.lastSpawnTime) >= this.nextSpawnDelay) {
            this.spawnEntity();
            this.lastSpawnTime = currentTime;
        }

        this.cleanupEntities();
    }

    cleanupEntities() {
        this.obstacles = this.obstacles.filter(obstacle => {
            if (obstacle.destroyed || obstacle.isOffScreen()) {
                obstacle.destroy();
                return false;
            }
            return true;
        });

        this.enemies = this.enemies.filter(enemy => {
            if (enemy.destroyed || enemy.isOffScreen()) {
                enemy.destroy();
                return false;
            }
            return true;
        });

        this.civilians = this.civilians.filter(civilian => {
            if (civilian.destroyed || civilian.isOffScreen()) {
                civilian.destroy();
                return false;
            }
            return true;
        });

        this.projectiles = this.projectiles.filter(projectile => {
            if (projectile.destroyed || projectile.isOffScreen()) {
                projectile.destroy();
                return false;
            }
            return true;
        });
    }

    getAllEntities() {
        return {
            obstacles: this.obstacles,
            enemies: this.enemies,
            civilians: this.civilians,
            projectiles: this.projectiles
        };
    }

    clearAll() {
        this.obstacles.forEach(obstacle => obstacle.destroy());
        this.obstacles = [];

        this.enemies.forEach(enemy => enemy.destroy());
        this.enemies = [];

        this.civilians.forEach(civilian => civilian.destroy());
        this.civilians = [];

        this.projectiles.forEach(projectile => projectile.destroy());
        this.projectiles = [];
    }

    reset() {
        this.stop();
        this.clearAll();
        this.currentSpeed = CONSTANTS.ENTITY.BASE_SPEED;
        this.lastSpawnTime = 0;
        this.nextSpawnDelay = 0;
    }

    getEntityCount() {
        return {
            obstacles: this.obstacles.length,
            enemies: this.enemies.length,
            civilians: this.civilians.length,
            projectiles: this.projectiles.length,
            total: this.obstacles.length + this.enemies.length + 
                   this.civilians.length + this.projectiles.length
        };
    }
}