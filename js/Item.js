import config from "./config.js";

export default class Item {
  constructor(coordX, coordY, parentElement) {    
    // 坐标值
    this.x = coordX *  config.GRID_WIDTH;
    this.y = coordY * config.GRID_WIDTH;

    this.size = 1;

    // 父元素：棋盘元素
    this.parentElement = parentElement;

    // DOM元素
    this.element = document.createElement('div');
  }
}