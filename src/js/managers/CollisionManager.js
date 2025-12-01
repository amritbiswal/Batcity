/**
 * COLLISION MANAGER
 * Handles all collision detection and responses
 */

class CollisionManager {
    constructor() {
        this.events = {
            onObstaclePassed: null,
            onEnemyKilled: null,
            onCivilianSaved: null,
            onCivilianShot: null,
            onPlayerHit: null
        };
        
        this.collisionOccurred = false; // NEW: Track if collision happened
    }

    on(eventName, callback) {
        if (this.events.hasOwnProperty(eventName)) {
            this.events[eventName] = callback;
        }
    }

    trigger(eventName, data = null) {
        if (this.events[eventName]) {
            this.events[eventName](data);
        }
    }

    checkCollisions(player, entities) {
        // Don't check collisions if one already occurred
        if (this.collisionOccurred) return;

        const playerBounds = player.getBounds();

        // Check fatal collisions first
        if (this.checkPlayerObstacleCollisions(playerBounds, entities.obstacles)) {
            this.collisionOccurred = true;
            return;
        }

        if (this.checkPlayerEnemyCollisions(playerBounds, entities.enemies)) {
            this.collisionOccurred = true;
            return;
        }

        if (this.checkProjectileCivilianCollisions(entities.projectiles, entities.civilians)) {
            this.collisionOccurred = true;
            return;
        }

        // Check non-fatal collisions
        this.checkPlayerCivilianCollisions(playerBounds, entities.civilians);
        this.checkProjectileEnemyCollisions(entities.projectiles, entities.enemies);
        this.checkObstaclePassing(playerBounds, entities.obstacles);
    }

    checkPlayerObstacleCollisions(playerBounds, obstacles) {
        for (const obstacle of obstacles) {
            if (obstacle.destroyed) continue;

            const obstacleBounds = obstacle.getBounds();
            
            if (Helpers.checkCollision(playerBounds, obstacleBounds)) {
                this.trigger('onPlayerHit', { type: 'obstacle', entity: obstacle });
                obstacle.destroy(); // Destroy immediately
                return true;
            }
        }
        return false;
    }

    checkPlayerEnemyCollisions(playerBounds, enemies) {
        for (const enemy of enemies) {
            if (enemy.destroyed) continue;

            const enemyBounds = enemy.getBounds();
            
            if (Helpers.checkCollision(playerBounds, enemyBounds)) {
                this.trigger('onPlayerHit', { type: 'enemy', entity: enemy });
                enemy.destroy(); // Destroy immediately
                return true;
            }
        }
        return false;
    }

    checkPlayerCivilianCollisions(playerBounds, civilians) {
        for (const civilian of civilians) {
            if (civilian.destroyed || civilian.saved) continue;

            const civilianBounds = civilian.getBounds();
            
            if (Helpers.checkCollision(playerBounds, civilianBounds)) {
                if (civilian.save()) {
                    this.trigger('onCivilianSaved', { entity: civilian });
                }
            }
        }
    }

    checkProjectileEnemyCollisions(projectiles, enemies) {
        for (const projectile of projectiles) {
            if (projectile.destroyed) continue;

            const projectileBounds = projectile.getBounds();

            for (const enemy of enemies) {
                if (enemy.destroyed) continue;

                const enemyBounds = enemy.getBounds();
                
                if (Helpers.checkCollision(projectileBounds, enemyBounds)) {
                    projectile.destroy();
                    if (enemy.hit()) {
                        this.trigger('onEnemyKilled', { entity: enemy });
                    }
                    break;
                }
            }
        }
    }

    checkProjectileCivilianCollisions(projectiles, civilians) {
        for (const projectile of projectiles) {
            if (projectile.destroyed) continue;

            const projectileBounds = projectile.getBounds();

            for (const civilian of civilians) {
                if (civilian.destroyed) continue;

                const civilianBounds = civilian.getBounds();
                
                if (Helpers.checkCollision(projectileBounds, civilianBounds)) {
                    projectile.destroy();
                    if (civilian.hit()) {
                        this.trigger('onCivilianShot', { entity: civilian });
                    }
                    return true;
                }
            }
        }
        return false;
    }

    checkObstaclePassing(playerBounds, obstacles) {
        for (const obstacle of obstacles) {
            if (obstacle.destroyed) continue;

            if (obstacle.hasPlayerPassed(playerBounds)) {
                this.trigger('onObstaclePassed', { entity: obstacle });
            }
        }
    }

    reset() {
        this.collisionOccurred = false; // Reset flag
    }
}