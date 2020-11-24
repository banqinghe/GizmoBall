import GameBoard from "./GameBoard.js";

export default class GizmoBallGame{
  constructor(){
    this.gameBoard = new GameBoard();

    this.dragListener();
    this.topbarListener();
    this.toolListener();
    this.modeListener();
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

  // 工具栏监听
  toolListener() {
    // const smallerButton = document.querySelector('#smaller');
    // const biggerButton = document.querySelector('#bigger');
    // const rotateButton = document.querySelector('#rotate');
    // const deleteButton = document.querySelector('#delete');

    const tools = document.querySelector('.tools .container');
    tools.addEventListener('click', e => {
      switch (e.target.id) {
        case 'smaller':
          this.smallerItem(this.gameBoard.focusElement);
          console.log('smaller');
          break;
        case 'bigger':
          console.log('bigger');
          this.biggerItem(this.gameBoard.focusElement);
          break;
        case 'rotate':
          console.log('rotate');
          this.rotateItem(this.gameBoard.focusElement);
          break;
        case 'delete':
          this.deleteItem(this.gameBoard.focusElement);
          break;
      }
    })    
  }

  //  对象 size + 1
  biggerItem(targetElement){
    if (!targetElement) {
      return;
    }

    let item = null;
    //获取相应 item 对象，执行 bigger 方法
    if (targetElement.classList.contains('ball')) {
      item = this.getListItem(this.gameBoard.ballList, targetElement)
    } else {
      item = this.getListItem(this.gameBoard.itemList, targetElement);
    }
    item.bigger();
  }

  // 对象 size - 1
  smallerItem(targetElement){
    if (!targetElement) {
      return;
    }

    let item = null;
    //获取相应 item 对象，执行 smaller 方法
    if (targetElement.classList.contains('ball')) {
      item = this.getListItem(this.gameBoard.ballList, targetElement)
    } else {
      item = this.getListItem(this.gameBoard.itemList, targetElement);
    }
    item.smaller();
  }

  // 对象顺时针旋转 90°
  rotateItem(targetElement){
    if (!targetElement) {
      return;
    }

    let item = null;
    //获取相应 item 对象，执行 smaller 方法
    if (targetElement.classList.contains('ball')) {
      item = this.getListItem(this.gameBoard.ballList, targetElement);

    } else {
      item = this.getListItem(this.gameBoard.itemList, targetElement);
    }
    item.rotate();
  }


  // 删除元素
  deleteItem(targetElement) {
    if (!targetElement) {
      return;
    }

    // 遍历 item，寻找并删除目标元素
    if (targetElement.classList.contains('ball')) {
      this.deleteListItem(this.gameBoard.ballList, targetElement);
    } else {
      this.deleteListItem(this.gameBoard.itemList, targetElement);
    }
    // 清除 focus 元素
    this.gameBoard.focusElement = null;
  }

  // 工具函数，用于获取 list 中的指定项
  getListItem(list, targetElement) {
    for (let i = 0, len = list.length; i < len; i++) {
      if (list[i].element === targetElement) {
        return list[i];
      }
    }
  }

  // 工具函数，用于删除 list 中的指定项
  deleteListItem(list, targetElement) {
    for (let i = 0, len = list.length; i < len; i++) {
      if (list[i].element === targetElement) {
        list[i].deleteElement();
        list.splice(i, 1);
        break;
      }
    }
  }

  modeListener() {
    const designButton = document.querySelector('#design');
    const playButton = document.querySelector('#play');

    playButton.addEventListener('click', e => {
      this.gameBoard.start();
    });
  }
}