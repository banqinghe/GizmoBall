import config from './config.js'
import Item from "./Item.js";
import Circle from "./collision/Circle.js";

export default class Ball extends Item{
  constructor(coordX, coordY, size) {
    super(coordX, coordY, size);
    // 速度设置
    this.radius = config.GRID_WIDTH * size / 2;
    this.centerX = this.x + config.GRID_WIDTH * size / 2;
    this.centerY = this.y + config.GRID_WIDTH * size / 2;

    this.vx = 0;
    this.vy = 0;
    // this.startTime = 0;
    this.lastTime = 0;

    this.init();
    // 开始移动
    // this.start();

  }

  //初始化样式和碰撞队列
  init(){
    // 设定
    this.element.classList.add('ball');
    this.circleList.push(new Circle(this.x, this.y, this.size));
    this.setLineAndCircleList(this.size);
  }

  checkCollision(item) {
    super.checkCollision();
    this.circleList.forEach(function (circle) {
      if(circle.checkCollision(this)){

      }
    });
  }

  bigger() {
    super.bigger();
    this.setLineAndCircleList(this.size);
  }

  smaller() {
    if (this.size === 1) {
      return;
    }
    super.smaller();
    this.setLineAndCircleList(this.size);
  }

  setLineAndCircleList(size) {
    this.circleList = [];
    this.circleList.push(new Circle(this.x, this.y, size));
  }

  // 设定时间变量
  timeStart() {
    this.lastTime = new Date().getTime();
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

    // console.log("The position is" + this.x + " " + this.y);
    this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;

    // 反弹判断
    //this.collisionDetection(this);

    this.circleList = [];
    this.circleList.push(new Circle(this.x, this.y, this.size));
  }

}