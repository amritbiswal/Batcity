import { Entity } from './entity.js';

export class Enemy extends Entity {
  constructor(x, y, speed) {
    super(x, y);
    this.type = 'enemy';
    this.vx = -speed * 1.05;
  }
}