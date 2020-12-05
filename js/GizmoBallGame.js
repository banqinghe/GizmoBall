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
      element.addEventListener('dragstart', (e) => this.handleDragStart(e, element));
    });
  }

  // 复用 dragstart 处理方法
  handleDragStart(e, element, item) {
    element.className.split(' ').forEach(name => {
      if (config.CSS_NAME.includes(name)) {
        let dragInfo = {
          name: name,
          x: -1,
          y: -1,
          width: -1, // 宽度 格子数
          height: -1, // 高度 格子数
          angle: -1
        }
        // 预备删除信息
        if (item !== undefined) {
          dragInfo.x = item.x / config.GRID_WIDTH,
            dragInfo.y = item.y / config.GRID_WIDTH,
            dragInfo.width = item.width / config.GRID_WIDTH;
          dragInfo.height = item.height / config.GRID_WIDTH;
          dragInfo.angle = item.angle;
          // console.log('when dragstart', dragInfo, item);
        }

        // CSS 类名
        e.dataTransfer.setData('text', JSON.stringify(dragInfo));
        // 鼠标相对位置
        e.dataTransfer.setDragImage(element, config.GRID_WIDTH / 2, config.GRID_WIDTH / 2);
      }
    });
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

        // const type = e.dataTransfer.getData('text');
        const dragInfo = JSON.parse(e.dataTransfer.getData('text'));
        // console.log(dragInfo);
        const type = dragInfo.name;

        const info = [type, x, y, dragInfo.width, dragInfo.height, dragInfo.angle];

        const item = this.gameBoard.dropItem(info);
        // console.log(item.element);

        // 如果放置成功
        if (item !== null) {
          // 对放置对象进行拖动监听，使 active 的 Item 依然可以被拖动
          item.element.addEventListener('dragstart', (e) => this.handleDragStart(e, item.element, item));

          // 如果需要删除原有元素
          // console.log(dragInfo.x, dragInfo.y);
          // console.log(this.gameBoard.getElementByCoord(dragInfo.x, dragInfo.y));
          this.gameBoard.deleteItem(this.gameBoard.getElementByCoord(dragInfo.x, dragInfo.y));
        }
      }
    })
  }

  // 为顶栏添加按钮监听
  fileListener() {
    const fileButton = document.querySelector('#file-button'); // 文件按钮
    const fileList = document.querySelector('.file-list'); // 文件列表
    const fileContainer = document.querySelector('.file-container'); // 文件列表与文件按钮

    let fileInput = document.querySelector('#location-input'); // 隐藏的 input:file


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
              // console.log('read result: ' + location);
              this.gameBoard.end();
              // 根据 location 设置元素位置
              const items = this.gameBoard.setItemsByLocation(location);
              items.forEach(item => {
                item.element.addEventListener('dragstart', (e) => this.handleDragStart(e, item.element, item));
              });
              this.mode = 'design';

              // 刷新Input元素，旨在取消其中的监听事件
              const newInput = fileInput.cloneNode(true);
              fileInput.parentNode.replaceChild(newInput, fileInput);
              fileInput = newInput;
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
        const items = this.gameBoard.setItemsByLocation(JSON.parse(localStorage.getItem('tempLocation')));
        items.forEach(item => {
          item.element.addEventListener('dragstart', (e) => this.handleDragStart(e, item.element, item));
        });
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