import config from './config.js'
import Util from './Util.js';

export default class Ball {
  constructor(coordX, coordY, parentElement, baffle) {    
    // 坐标值
    this.x = coordX *  config.GRID_WIDTH;
    this.y = coordY * config.GRID_WIDTH;

    // 大小：直径所占的网格数
    this.size = 1;

    // 父元素：棋盘元素
    this.parentElement = parentElement;

    // DOM元素
    this.element = document.createElement('div');

    // 速度设置
    this.vx = .6;
    this.vy = 0;

    this.Falling = true;

    this.startTime = 0;
    this.lastTime = 0;

    this.baffle = baffle;
    // 开始移动
    this.start();
  }

  // 为Ball对象添加class，并将其添加到父元素下
  start() {
    // 根绝参数设定初始位置
    this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;

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
    let lastVx = self.vx;
    let currentTime = new Date().getTime();
    let interval = currentTime - self.lastTime;
    self.lastTime = currentTime;
    
    // 改变速度
    if (self.vy >= 0) {
      // 下落
      self.vy = lastVy + interval / 1000 * (config.G - config.F);
    } else {
      // 上升
      self.vy = lastVy + interval / 1000 * (config.G +  config.F);
    }

    if (self.vx > 0) {
      self.vx = lastVx + interval / 1000  *  -config.F / 4;
    } else {
      self.vx = lastVx + interval / 1000  *  config.F / 4;
    }

    self.y += (lastVy + self.vy) / 2 * interval;
    self.x += self.vx * interval;

    self.element.style.transform = `translate(${self.x}px, ${self.y}px)`

    // 反弹判断
    this.collisionDetection(self);
    // if(this.collisionDetection(self)) {
    //   return;
    // }
    // console.log(self.vy);
    window.requestAnimationFrame(() => self.move(self));
  }

  // 挡板碰撞检测
  // 边缘碰撞检测
  collisionDetection(self) {

    Util.hitItem(this,this.baffle);

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