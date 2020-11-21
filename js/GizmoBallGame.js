import GameBoard from "./GameBoard.js";

export default class GizmoBallGame{
  constructor(){
    this.gameBoard = new GameBoard();

    this.dragListener();
  }

  dragListener() {
    // 传递拖动item的类型
    document.querySelectorAll('.item').forEach(element => {
      element.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text', element.className.split(' ')[0]);
      })
    })
  }
}