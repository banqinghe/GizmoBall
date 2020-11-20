import config from './config.js'
import Util from './Util.js';
import Item from "./Item.js";

export default class Ball extends Item{
  constructor(coordX, coordY, size) {
    super(coordX, coordY, size);
    // 速度设置
    this.vx = .6;
    this.vy = 0;
    this.startTime = 0;
    this.lastTime = 0;
    // 开始移动
    this.start();
  }

  // 为Ball对象添加class，并将其添加到父元素下
  start() {
    // 设定
    this.element.classList.add('ball');
    this.startTime = new Date().getTime();
    this.lastTime = this.startTime;
    let self = this;
    this.move(self);
  }

  // 小球移动
  move() {
    let lastVy = this.vy;
    let lastVx = this.vx;
    let currentTime = new Date().getTime();
    let interval = currentTime - this.lastTime;
    this.lastTime = currentTime;
    
    // 改变速度
    if (this.vy >= 0) {
      // 下落
      this.vy = lastVy + interval / 1000 * (config.G - config.F);
    } else {
      // 上升
      this.vy = lastVy + interval / 1000 * (config.G +  config.F);
    }

    if (this.vx > 0) {
      this.vx = lastVx + interval / 1000  *  -config.F / 4;
    } else {
      this.vx = lastVx + interval / 1000  *  config.F / 4;
    }

    this.y += (lastVy + this.vy) / 2 * interval;
    this.x += this.vx * interval;

    //console.log("The position is" + this.x + " " + this.y);
    this.element.style.transform = `translate(${this.x}px, ${this.y}px)`

    // 反弹判断
    this.collisionDetection(this);
    // if(this.collisionDetection(self)) {
    //   return;
    // }
    // console.log(self.vy);
    //window.requestAnimationFrame(() => self.move(self));
  }

  // 挡板碰撞检测
  // 边缘碰撞检测
  collisionDetection(self) {
    switch (self.hitTheWall(self)) {
      case 'T':
        self.vy = Math.abs(self.vy);
        break;
      case 'L':
        self.vx = Math.abs(self.vx);
        break;
      case 'R':
        self.vx = -Math.abs(self.vx);
        break;
      case 'B':
        self.vy = -Math.abs(self.vy);
        break;
      case 'corner':
        self.vy = -self.vy;
        self.vx = -self.vx;
        break;
    }
  }

  hitTheWall(self) {
    if (self.y <= 0) {
      if ((self.x >= config.BOARD_WIDTH - self.size * config.GRID_WIDTH && self.vx > 0) ||
      self.x <= 0) {
        return 'corner';
      }
      return 'T';
    } else if (self.y >= config.BOARD_HEIGHT - self.size * config.GRID_WIDTH && self.vy > 0) {
      if ((self.x >= config.BOARD_WIDTH - self.size * config.GRID_WIDTH && self.vx > 0) ||
        self.x <= 0) {
        return 'corner';
      }
      return 'B';
    } else if (self.x >= config.BOARD_WIDTH - self.size * config.GRID_WIDTH && self.vx > 0) {
      return 'R';
    } else if (self.x <= 0) {
      return 'L';
    }
  }

  hitItem(self) {
    let itemList = document.querySelector('.game-board').children();
  
  }
}