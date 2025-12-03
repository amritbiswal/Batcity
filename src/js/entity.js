export class Entity {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.el = null;
  }

  createElement(className) {
    this.el = document.createElement('div');
    this.el.className = className;
    return this.el;
  }

  updatePosition() {
    if (this.el) {
      this.el.style.left = `${this.x}px`;
      this.el.style.bottom = `${this.y}px`;
    }
  }

  update(deltaTime) {
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;
    this.updatePosition();
  }

  remove() {
    if (this.el && this.el.parentNode) {
      this.el.parentNode.removeChild(this.el);
    }
  }

  getBounds() {
    if (!this.el) return null;
    return this.el.getBoundingClientRect();
  }

  isOutOfBounds(width) {
    return this.x < -100 || this.x > width + 100;
  }
}