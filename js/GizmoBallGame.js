import GameBoard from "./GameBoard.js";

export default class GizmoBallGame{
  constructor(){
    this.gameBoard = new GameBoard();

    this.documentListener();
    this.dragListener();
    this.topbarListener();
    this.toolListener();
    this.modeListener();
  }

  documentListener() {
    const fileContainer = document.querySelector('.file-container');
    const fileList = document.querySelector('.file-list');

    // 检测祖先关系
    function isAncestor(ancestor, child) {
      if (child === document.body) {
        return false;
      }
      let currentParent = child.parentElement;
      while (currentParent !== document.body && currentParent !== ancestor) {
        currentParent = currentParent.parentElement; 
      }
      return currentParent === ancestor;
    }

    document.addEventListener('click', (e) => {
      if (!isAncestor(fileContainer, e.target) || e.target === document.body) {
        fileList.classList.remove('show');
      }
    });
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
    const fileList = document.querySelector('.file-list');
    
    fileButton.addEventListener('click', (e) => {
      fileList.classList.add('show');
      // console.log(fileList.className);
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

  // 工具栏监听
  toolListener() {

    const tools = document.querySelector('.tools .container');
    tools.addEventListener('click', e => {
      switch (e.target.id) {
        case 'smaller':
          this.gameBoard.smallerItem(this.gameBoard.focusElement);
          console.log('smaller');
          break;
        case 'bigger':
          console.log('bigger');
          this.gameBoard.biggerItem(this.gameBoard.focusElement);
          break;
        case 'rotate':
          console.log('rotate');
          this.gameBoard.rotateItem(this.gameBoard.focusElement);
          break;
        case 'delete':
          console.log('delete');
          this.gameBoard.deleteItem(this.gameBoard.focusElement);
          break;
      }
    })    
  }



  modeListener() {
    const designButton = document.querySelector('#design');
    const playButton = document.querySelector('#play');

    playButton.addEventListener('click', e => {
      this.gameBoard.start();
    });
  }
}