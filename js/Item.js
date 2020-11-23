import config from "./config.js";

export default class Item {
  constructor(coordX, coordY, size, height) {
    // 坐标值
    this.x = coordX *  config.GRID_WIDTH;
    this.y = coordY * config.GRID_WIDTH;
    this.size = size;
    this.circleList = [];
    this.lineList = [];

    // DOM元素
    this.element = document.createElement('div');

    this.element.classList.add('active');

    // 根绝参数设定初始位置
    this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;

    config.GAME_BOARD.appendChild(this.element);

    this.width = size * config.GRID_WIDTH;
    if (height === undefined) {
      this.height = size * config.GRID_WIDTH;
    } else {
      this.height = height;
    }

    this.element.style.height = this.height + 'px';
    this.element.style.width = this.width + 'px';
  }


  // 放大方法，如果不符合则需要重写
  bigger() {
    this.size = this.size + 1;
    this.width = this.size * config.GRID_WIDTH;
    this.height = this.size * config.GRID_WIDTH;

    this.element.style.height = this.height + 'px';
    this.element.style.width = this.width + 'px';
  }

  // 缩小方法，如果不符合则需要重写
  smaller() {
    if (this.size === 1) {
      return;
    }
    this.size = this.size - 1 ;
    this.width = this.size * config.GRID_WIDTH;
    this.height = this.size * config.GRID_WIDTH;

    this.element.style.height = this.height + 'px';
    this.element.style.width = this.width + 'px';
  }

  collision(ball){
    this.lineList.forEach(function (line) {
      line.hit(ball);
    });
    this.circleList.forEach(function (circle) {
      circle.hit(ball);
    });
  }

  setSize(size){

  }

  setHeight(){
    
  }

  // 删除 DOM 元素
  deleteElement() {
    this.element.remove();
  }
}