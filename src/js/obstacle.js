import { Entity } from './entity.js';

export class Obstacle extends Entity {
  constructor(x, y, speed) {
    super(x, y);
    this.type = 'obstacle';
    this.vx = -speed;
  }
}