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

    this.times = 0;
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
    let _this = this;
    this.move(_this);
  }

  // 小球移动
  move(_this) {
    let lastVy = _this.vy;
    let currentTime = new Date().getTime();
    let interval = currentTime - _this.lastTime;
    _this.lastTime = currentTime;
    
    // 改变速度
    if (_this.vy >= 0) {
      // 下落
      _this.vy = lastVy + interval / 1000 * (config.G - config.F);
      
    } else {
      // 上升
      _this.vy = lastVy + interval / 1000 * (config.G + config.F);
    }

    _this.y += (lastVy + _this.vy) / 2 * interval;

    _this.element.style.transform = `translate(${_this.x}px, ${_this.y}px)`

    if (_this.y >= 570 && _this.vy > 0) {
      if (_this.vy < 0.01) {
        _this.vy = 0;
        return;
      }
      _this.vy = -_this.vy;
    }
    window.requestAnimationFrame(() => _this.move(_this));
  }

  // 碰撞检测

  

}