import config from "./config.js";
import GameBoard from "./GameBoard.js";
import {
  saveLocation,
  loadLocation
} from './lib/FileVisitor.js';

export default class GizmoBallGame {
  constructor() {
    this.gameBoard = new GameBoard();

    this.mode = 'design';

    this.dragListener(); // 组件栏监听
    this.dropListener(); // 放置动作监听
    this.focusListener(); // focus 选定监听
    this.fileListener(); // 文件操作监听
    this.aboutListener(); // 关于弹窗监听 
    this.toolListener(); // 工具栏监听
    this.modeListener(); // 模式变更监听
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

  // game board 添加放置事件监听
  dropListener() {
    // 修改默认行为，使game board成为可放置目标
    config.GAME_BOARD.addEventListener('dragover', e => {
      e.preventDefault();
    });

    config.GAME_BOARD.addEventListener('dragenter', e => {
      e.preventDefault();
    });

    // 调用 gameboard 的放置函数
    config.GAME_BOARD.addEventListener('drop', e => {
      // 设计模式下允许放置
      if (this.mode === 'design') {
        const x = Math.floor((e.pageX - config.GAME_BOARD.getBoundingClientRect().left) / 30);
        const y = Math.floor((e.pageY - config.GAME_BOARD.getBoundingClientRect().top) / 30);
        const type = e.dataTransfer.getData('text');
        this.gameBoard.dropItem(type, x, y);
      }
    })
  }

  // 为顶栏添加按钮监听
  fileListener() {
    const fileButton = document.querySelector('#file-button'); // 文件按钮
    const fileList = document.querySelector('.file-list'); // 文件列表
    const fileContainer = document.querySelector('.file-container'); // 文件列表与文件按钮

    const fileInput = document.querySelector('#location-input'); // 隐藏的 input:file


    // 显示文件菜单
    fileButton.addEventListener('click', (e) => {
      fileList.classList.add('show');
      // console.log(fileList.className);
    });

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

    // 点击其他地方，菜单消失
    document.addEventListener('click', (e) => {
      if (!isAncestor(fileContainer, e.target) || e.target === document.body) {
        fileList.classList.remove('show');
      }
    });

    // 文件操作监听
    fileList.addEventListener('click', (e) => {
      switch (e.target.id) {
        // 导出文件
        case 'export-file':
          saveLocation(JSON.parse(localStorage.getItem('tempLocation')));
          break;
        // 导入文件
        case 'import-file':
          loadLocation(fileInput)
            .then(location => {
              this.gameBoard.end();
              // 根据 location 设置元素位置
              this.gameBoard.setItemsByLocation(location);
              this.mode = 'design';
            })
            .catch(msg => {
              console.error(msg);
            });
          break;
        // 新游戏
        case 'new-game':
          this.gameBoard.end();
          this.mode = 'design';
          break;
      }
      fileList.classList.remove('show');
    });
  }

  // 关于按键 监听
  aboutListener() {
    const aboutButton = document.querySelector('#about-button'); // 关于按钮  
    const closeAbout = document.querySelector('.about-box-top span'); // 关闭关于对话框

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

    // 游玩模式，小球开始运动
    playButton.addEventListener('click', e => {
      if (this.mode === 'design') {
        this.mode = 'play';
        if (this.gameBoard.focusElement) {
          this.gameBoard.focusElement.classList.remove('focus');
          this.gameBoard.focusElement = null;
        }
        this.gameBoard.start();
      }
    });

    // 设计模式，清空面板，复原 start() 之前的布局
    designButton.addEventListener('click', e => {
      if (this.mode === 'play') {
        this.gameBoard.end();
        this.gameBoard.setItemsByLocation(JSON.parse(localStorage.getItem('tempLocation')));
        this.mode = 'design';
      }
    });
  }

  // 检测 focus 元素
  focusListener() {
    config.GAME_BOARD.addEventListener('click', e => {
      if (this.mode === 'design') {
        this.gameBoard.setFocusElement(e.target);
      }
    });
  }
}