import { Entity } from './entity.js';

export class Civilian extends Entity {
  constructor(x, y, speed) {
    super(x, y);
    this.type = 'civilian';
    this.vx = -speed * 0.9;
  }
}