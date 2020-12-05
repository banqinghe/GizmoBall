import Baffle from "./Baffle.js";
import Ball from "./Ball.js";
import Square from "./Square.js";
import Triangle from "./Triangle.js";
import Border from "./Border.js";
import Circle from "./Circle.js";
import Hole from "./Hole.js";
import BentPipe from "./BentPipe.js";
import StraightPipe from "./StraightPipe.js";
import config from './config.js';
import Item from "./Item.js";

export default class ItemGenerator {
  // 由 CSS 类名映射到 JavaScript Class
  static styleToConstructor = {
    'baffle': Baffle,
    'ball': Ball,
    'square': Square,
    'triangle': Triangle,
    'border': Border,
    'circle': Circle,
    'hole': Hole,
    'curve': BentPipe,
    'pipe': StraightPipe
  }

  // 类型字符串映射到 JavaScript Class
  static typeToConstructor = {
    'Baffle': Baffle,
    'Ball': Ball,
    'Square': Square,
    'Triangle': Triangle,
    'Border': Border,
    'Circle': Circle,
    'Hole': Hole,
    'BentPipe': BentPipe,
    'StraightPipe': StraightPipe
  }

  // 由 CSS 类名映射到 默认大小
  static styleToDefaultSize = {
    'baffle': config.defaultSize.BAFFLE,
    'ball': config.defaultSize.BALL,
    'square': config.defaultSize.SQUARE,
    'triangle': config.defaultSize.TRIANGLE,
    'circle': config.defaultSize.CIRCLE,
    'hole': config.defaultSize.HOLE,
    'curve': config.defaultSize.CURVE,
    'pipe': config.defaultSize.PIPE
  }

  static styleToDefaultHeight = {
    'baffle': config.defaultHeight.BAFFLE,
    'ball': config.defaultHeight.BALL,
    'square': config.defaultHeight.SQUARE,
    'triangle': config.defaultHeight.TRIANGLE,
    'circle': config.defaultHeight.CIRCLE,
    'hole': config.defaultHeight.HOLE,
    'curve': config.defaultHeight.CURVE,
    'pipe': config.defaultHeight.PIPE
  }

  // 根据 Info 数组创建对应的 Item 对象并返回
  // Info [type, x, y, width, height, angle]

  // type 为 CSS 类名
  static createItemByCSSName(info, board) {
    // console.log(info);
    const result = new this.styleToConstructor[info[0]](info[1], info[2], info[3], info[4]);
    this.setStatus(result, info, board);
    return result;
  }

  // type 为 JavaScript 类名
  static createItem(info, board) {
    const result = new this.typeToConstructor[info[0]](info[1], info[2], info[3], info[4]);
    this.setStatus(result, info, board);
    return result;
  }

  // 设置 旋转角度 和 占位信息
  static setStatus(itemObj, info, board) {
    for (let i = 0; i < info[5]; i++) {
      itemObj.rotate();
    }
    board.setBoardStatusTrue(info[1], info[2], info[3], info[4]);
    // console.log(itemObj);
    itemObj.element.addEventListener('dragstart', (e) => {
      // console.log('dragstart', itemObj);
      e.dataTransfer.setData('text', info[0]);
      e.dataTransfer.setDragImage(itemObj.element, config.GRID_WIDTH / 2, config.GRID_WIDTH / 2);
    });
  }
}