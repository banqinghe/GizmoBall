import Item from "./Item.js";
import config from "./config.js";

export default class Baffle extends Item {
  constructor(coorX, coorY, size) {
    super(coorX, coorY, size, 10);
    this.init();
  }

  init() {
    this.element.classList.add('baffle');
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
  }
}