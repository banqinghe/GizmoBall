import GameBoard from "./GameBoard.js";

export default class GizmoBallGame{
  constructor(){
    this.gameBoard = new GameBoard();

    this.dragListener();
    this.topbarListener();
  }

  // 为组件栏添加拖动监听
  dragListener() {
    // 传递拖动item的类型
    document.querySelectorAll('.item').forEach(element => {
      element.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text', element.className.split(' ')[0]);
      })
    })
  }

  // 为顶栏添加按钮监听
  topbarListener() {
    const fileButton = document.querySelector('#file-button');
    const aboutButton = document.querySelector('#about-button');
    const closeAbout = document.querySelector('.about-box-top span');
    
    fileButton.addEventListener('click', e => {
      console.log('file');
    });

    const aboutPage = document.querySelector('.about-page');
    const aboutBox = document.querySelector('.about-box');

    // 弹出信息框
    aboutButton.addEventListener('click', e => {
      aboutPage.style.display = 'flex';
      // 渲染完成后展示，开始过渡动画
      setTimeout(() => aboutBox.classList.add('show-box'), 0);
    });

    // 关闭信息框
    closeAbout.addEventListener('click', e => {
      aboutBox.classList.remove('show-box');
      aboutPage.style.display = 'none'
    });
  }
}