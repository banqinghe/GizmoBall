import Ball from './Ball.js';
import Baffle from './Baffle.js';
import config from './config.js';
import Util from './Util.js';
import Square from "./Square.js";

export default class GizmoBallGame{
  constructor(){
    this.gameBoard = document.querySelector('.game-board');
    this.baffle = new Baffle(9, 16, this.gameBoard); 
    this.ball = new Ball(3, 2, this.gameBoard);
    this.square = new Square(15, 10, this.gameBoard, 2);
    this.start();
  }
 
  start(){
    this.creeping(this);
  }
  
  creeping(self){
    //小球进行一次移动
    self.ball.move();
    //检测挡板和小球的碰撞
    Util.hitRect(self.ball, self.baffle);
    Util.hitRect(self.ball, self.square);
    window.requestAnimationFrame(() => self.creeping(self));
  }
}