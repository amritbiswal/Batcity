import { Entity } from './entity.js';

export class Bullet extends Entity {
  constructor(x, y, speed) {
    super(x, y);
    this.vx = speed;
  }
}