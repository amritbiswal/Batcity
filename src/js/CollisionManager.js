export class CollisionManager {
  rectsOverlap(a, b) {
    return !(
      a.right < b.left ||
      a.left > b.right ||
      a.bottom < b.top ||
      a.top > b.bottom
    );
  }

  checkPlayerVsEntities(player, entities, onCollision) {
    const playerRect = player.getBounds();
    
    for (let i = entities.length - 1; i >= 0; i--) {
      const entity = entities[i];
      const entityRect = entity.getBounds();
      
      if (this.rectsOverlap(playerRect, entityRect)) {
        const result = onCollision(entity, i);
        if (result) return result;
      }
    }
    
    return null;
  }

  checkBulletsVsEntities(bullets, entities, onHit) {
    for (let i = bullets.length - 1; i >= 0; i--) {
      const bullet = bullets[i];
      const bulletRect = bullet.getBounds();
      
      for (let j = entities.length - 1; j >= 0; j--) {
        const entity = entities[j];
        const entityRect = entity.getBounds();
        
        if (this.rectsOverlap(bulletRect, entityRect)) {
          const result = onHit(bullet, i, entity, j);
          if (result) return result;
        }
      }
    }
    
    return null;
  }

  checkBulletsVsTarget(bullets, target, onHit) {
    const targetRect = target.getBounds();
    
    for (let i = bullets.length - 1; i >= 0; i--) {
      const bullet = bullets[i];
      const bulletRect = bullet.getBounds();
      
      if (this.rectsOverlap(bulletRect, targetRect)) {
        const result = onHit(bullet, i);
        if (result) return result;
      }
    }
    
    return null;
  }
}