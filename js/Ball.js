import config from './config.js'

export default class Ball {
  constructor(coordX, coordY, parentElement) {    
    // 坐标值
    this.x = coordX *  config.GRID_WIDTH;
    this.y = coordY * config.GRID_WIDTH;

    // 大小：直径所占的网格数
    this.diameter = 1;

    // 父元素：棋盘元素
    this.parentElement = parentElement;

    // DOM元素
    this.element = document.createElement('div');

    // 速度设置
    this.vx = 0;
    this.vy = 0;

    this.Falling = true;

    this.startTime = 0;
    this.lastTime = 0;
  }

  // 为Ball对象添加class，并将其添加到父元素下
  start() {
    // 根绝参数设定初始位置
    this.element.style.transform = `translate(${this.x}px, ${this.y}px)`

    // 设定
    this.element.classList.add('ball');
    this.parentElement.appendChild(this.element);
    
    this.startTime = new Date().getTime();
    this.lastTime = this.startTime;
    let self = this;
    this.move(self);
  }

  // 小球移动
  move(self) {
    let lastVy = self.vy;
    let currentTime = new Date().getTime();
    let interval = currentTime - self.lastTime;
    self.lastTime = currentTime;
    
    // 改变速度
    if (self.vy >= 0) {
      // 下落
      self.vy = lastVy + interval / 1000 * (config.G - config.F);
    } else {
      // 上升
      self.vy = lastVy + interval / 1000 * (config.G + config.F);
    }

    self.y += (lastVy + self.vy) / 2 * interval;

    self.element.style.transform = `translate(${self.x}px, ${self.y}px)`

    // 反弹判断
    if (self.y >= 570 && self.vy > 0) {
      if (self.vy < 0.01) {
        self.vy = 0;
        return;
      }
      self.vy = -self.vy;
    }
    window.requestAnimationFrame(() => self.move(self));
  }

  // 碰撞检测
  collisionDetection(self) {
    switch (self.hitTheWall(self)) {
      case 'T':
        self.vy = -self.vy;
        break;
      case 'L':
        self.vx = -self.vx;
        break;
      case 'R':
        self.vx = -self.vx;
        break;
      case 'B':
        self.vy = -self.vy;
        if (self.vy < 0.01) {
          self.vy = 0;
          return;
        }
        break;
    }
  }
  

}