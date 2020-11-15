import Ball from './Ball.js';
import Baffle from './Baffle.js';
import config from './config.js';

export default class GizmoBallGame{
  constructor(){
    const gameBoard = document.querySelector('.game-board');
    const baffle = new Baffle(9, 16, gameBoard); 
    const ball = new Ball(3, 2, gameBoard, baffle);

  }
  
  
}