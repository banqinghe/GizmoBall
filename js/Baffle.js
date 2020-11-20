import Item from "./Item.js";
import config from "./config.js";
import Line from "./collision/Line.js";
import Circle from "./collision/Circle.js";

export default class Baffle extends Item {
  constructor(coorX, coorY, size) {
    super(coorX, coorY, size, 10);
    this.init();
  }

  init() {
    this.element.classList.add('baffle');

    this.lineList.push(new Line(this.x, this.y, this.size, 0));
    this.lineList.push(new Line(this.x, this.y, this.height/config.GRID_WIDTH, Math.acos(0)));
    this.lineList.push(new Line(this.x, this.y + this.height, this.size, 0));
    this.lineList.push(new Line(this.x + this.width, this.y, this.height/config.GRID_WIDTH, Math.acos(0)));
    this.circleList.push(new Circle(this.x, this.y,0));
    this.circleList.push(new Circle(this.x + this.width, this.y,0));
    this.circleList.push(new Circle(this.x, this.y + this.height,0));
    this.circleList.push(new Circle(this.x + this.width, this.y + this.height,0));

    document.addEventListener('keydown', (e) => this.moveBaffle(e, this));
  }

  moveBaffle(e, self) {
    switch(e.keyCode) {
      case 37: 
        if(self.x > 0) {
          self.x -= config.GRID_WIDTH;
          self.element.style.transform = `translate(${self.x}px, ${self.y}px)`;  
        }
        break;
      case 39: 
        if (self.x < config.BOARD_WIDTH - config.GRID_WIDTH * self.size) {
          self.x += config.GRID_WIDTH;
          self.element.style.transform = `translate(${self.x}px, ${self.y}px)`;
        }
        break;
    }
    //由于 x 和 y 发生改变，清空 lineList 和 circleList 重新添加
    this.lineList = [];
    this.circleList = [];
    this.lineList.push(new Line(this.x, this.y, this.size, 0));
    this.lineList.push(new Line(this.x, this.y, this.height/config.GRID_WIDTH, Math.acos(0)));
    this.lineList.push(new Line(this.x, this.y + this.height, this.size, 0));
    this.lineList.push(new Line(this.x + this.width, this.y, this.height/config.GRID_WIDTH, Math.acos(0)  ));

    this.circleList.push(new Circle(this.x, this.y,0));
    this.circleList.push(new Circle(this.x + this.width, this.y,0));
    this.circleList.push(new Circle(this.x, this.y + this.height,0));
    this.circleList.push(new Circle(this.x + this.width, this.y + this.height,0));
  }
}