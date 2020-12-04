import Baffle from "./Baffle.js";
import Ball from "./Ball.js";
import Square from "./Square.js";
import Triangle from "./Triangle.js";
import config from "./config.js";
import Border from "./Border.js";
import Circle from "./Circle.js";
import Hole from "./Hole.js";
import BentPile from "./BentPipe.js";
import StraightPipe from "./StraightPipe.js";

export default class GameBoard {
    constructor() {
        // 除小球外需检测碰撞的 item 列表
        this.itemList = [];

        // 将边框类放在最下方，不遮挡其他 active 元素
        this.addItem(new Border());

        //小球列表
        this.ballList = [];

        this.boardStatus = new Array(20);
        for (let i = 0; i < 20; i++) {
            this.boardStatus[i] = new Array(20).fill(false);
        }

        this.setBoardStatusFalse(0, 0, 20, 20);

        this.focusElement = null;

        this.animationId = 0;

    }

    // 接受放置类型和位置，将目标添加进 game board
    dropItem(type, x, y) {
        let width = 0;
        let height = 0;
        switch (type) {
            case 'ball':
                width = config.defaultSize.BALL;
                if (this.checkCollision(x, y, width, width)) {
                    let ball = new Ball(x, y, config.defaultSize.BALL);
                    this.addBall(ball);
                    this.setFocusElement(ball.element);
                    this.setBoardStatusTrue(x, y, width, width);
                }
                break;
            case 'square':
                width = config.defaultSize.SQUARE;
                if (this.checkCollision(x, y, width, width)) {
                    let square = new Square(x, y, config.defaultSize.SQUARE);
                    this.addItem(square);
                    this.setFocusElement(square.element);
                    this.setBoardStatusTrue(x, y, width, width);
                }
                break;
            case 'triangle':
                width = config.defaultSize.TRIANGLE;
                if (this.checkCollision(x, y, width, width)) {
                    let triangle = new Triangle(x, y, config.defaultSize.TRIANGLE);
                    this.addItem(triangle);
                    this.setFocusElement(triangle.element);
                    this.setBoardStatusTrue(x, y, width, width);
                }
                break;
            case 'circle':
                width = config.defaultSize.CIRCLE;
                if (this.checkCollision(x, y, width, width)) {
                    let circle = new Circle(x, y, config.defaultSize.CIRCLE);
                    this.addItem(circle);
                    this.setFocusElement(circle.element);
                    this.setBoardStatusTrue(x, y, width, width);
                }
                break;
            case 'baffle':
                width = config.defaultSize.BAFFLE;
                height = Math.ceil(config.BAFFLE_HEIGHT / config.GRID_WIDTH);
                if (this.checkCollision(x, y, width, height)) {
                    let baffle = new Baffle(x, y, config.defaultSize.BAFFLE);
                    this.addItem(baffle);
                    this.setFocusElement(baffle.element);
                    this.setBoardStatusTrue(x, y, width, height);
                }
                break;
            case 'hole':
                width = config.defaultSize.HOLE;
                if (this.checkCollision(x, y, width, width)) {
                    let hole = new Hole(x, y, config.defaultSize.HOLE);
                    this.addItem(hole);
                    this.setFocusElement(hole.element);
                    this.setBoardStatusTrue(x, y, width, width);
                }
                break;
            case 'curve':
                width = config.defaultSize.CURVE;
                if (this.checkCollision(x, y, width, width)) {
                    let bentPile = new BentPile(x, y, config.defaultSize.CURVE);
                    this.addItem(bentPile);
                    this.setFocusElement(bentPile.element);
                    this.setBoardStatusTrue(x, y, width, width);
                }
                break;
            case 'pipe':
                width = config.defaultSize.PIPE;
                if (this.checkCollision(x, y, width, width)) {
                    let straightPipe = new StraightPipe(x, y, config.defaultSize.PIPE);
                    this.addItem(straightPipe);
                    this.setFocusElement(straightPipe.element);
                    this.setBoardStatusTrue(x, y, width, width);
                }
                break;
        }
    }

    /*以格子作为单位长度*/
    checkCollision(x, y, width, height) {
        if (x + width > 20 || y + height > 20) {
            return false;
        }

        for (let i = y; i < y + height; i++) {
            for (let j = x; j < x + width; j++) {
                if (this.boardStatus[i][j] === true) {
                    return false;
                }
            }
        }
        return true;
    }

    /*将相应区域面板方格设置为 True*/
    setBoardStatusTrue(x, y, width, height) {
        for (let i = y; i < y + height; i++) {
            for (let j = x; j < x + width; j++) {
                this.boardStatus[i][j] = true;
            }
        }
    }

    /*将相应区域面板方格设置为 False*/
    setBoardStatusFalse(x, y, width, height) {
        for (let i = y; i < y + height; i++) {
            for (let j = x; j < x + width; j++) {
                this.boardStatus[i][j] = false;
            }
        }
    }

    // 选中 focus 元素
    setFocusElement(target) {
        // 清除上一个 focus 元素的 outline 样式
        if (this.focusElement) {
            this.focusElement.classList.remove('focus');
        }
        // 选定新的 focus 元素
        if ((!target.classList.contains('border')) && target !== config.GAME_BOARD) {
            this.focusElement = target;
            this.focusElement.classList.add('focus');
        } else {
            this.focusElement = null;
        }
    }

    addBall(ball) {
        this.ballList.push(ball);
    }

    addItem(item) {
        this.itemList.push(item);
    }

    start() {
        localStorage.setItem('tempLocation', JSON.stringify(this.getItemsLocation()));
        this.ballList.forEach(ball => ball.timeStart());
        this.animationId = this.creeping(this);
    }

    end() {
        window.cancelAnimationFrame(this.animationId);
        this.clearBoard();
    }

    creeping(self) {

        for (let i = 0; i < self.ballList.length; i++) {
            let ball = self.ballList[i];
            ball.move();
            //检测 item 和小球的碰撞
            self.itemList.forEach(function (item) {
                if (item.element.classList.contains('hole') && item.isCollided(ball)) {
                    self.ballList.splice(i, 1);
                    i--;
                }
                item.collision(ball);
            });
            //检测与其他小球的碰撞
            self.ballList.forEach(function (item) {
                if (item !== ball)
                    item.collision(ball);
            });
            //小球进行一次移动
        }
        this.animationId = window.requestAnimationFrame(() => self.creeping(self));
    }

    //  对象 size + 1
    biggerItem(targetElement) {
        if (!targetElement) {
            return;
        }

        let item = null;
        //获取相应 item 对象，执行 bigger 方法
        if (targetElement.classList.contains('ball')) {
            item = this.getListItem(this.ballList, targetElement)
        } else {
            item = this.getListItem(this.itemList, targetElement);
        }

        // 如果有碰撞或越过边框边界，则放弃
        this.setBoardStatusFalse(item.x / config.GRID_WIDTH, item.y / config.GRID_WIDTH,
            item.width / config.GRID_WIDTH, item.height / config.GRID_WIDTH);
        if (!this.checkCollision(item.x / config.GRID_WIDTH, item.y / config.GRID_WIDTH,
                item.width / config.GRID_WIDTH + 1, item.height / config.GRID_WIDTH + 1)) {
            this.setBoardStatusTrue(item.x / config.GRID_WIDTH, item.y / config.GRID_WIDTH,
                item.width / config.GRID_WIDTH, item.height / config.GRID_WIDTH);
            return;
        }
        item.bigger();
        this.setBoardStatusTrue(item.x / config.GRID_WIDTH, item.y / config.GRID_WIDTH,
            item.width / config.GRID_WIDTH, item.height / config.GRID_WIDTH);
    }

    // 对象 size - 1
    smallerItem(targetElement) {
        if (!targetElement) {
            return;
        }

        let item = null;
        //获取相应 item 对象，执行 smaller 方法
        if (targetElement.classList.contains('ball')) {
            item = this.getListItem(this.ballList, targetElement)
        } else {
            item = this.getListItem(this.itemList, targetElement);
        }
        this.setBoardStatusFalse(item.x / config.GRID_WIDTH, item.y / config.GRID_WIDTH,
            item.width / config.GRID_WIDTH, item.height / config.GRID_WIDTH);
        item.smaller();
        this.setBoardStatusTrue(item.x / config.GRID_WIDTH, item.y / config.GRID_WIDTH,
            item.width / config.GRID_WIDTH, item.height / config.GRID_WIDTH);
    }

    // 对象顺时针旋转 90°
    rotateItem(targetElement) {
        if (!targetElement) {
            return;
        }

        let item = null;
        //获取相应 item 对象，执行 smaller 方法
        if (targetElement.classList.contains('ball')) {
            item = this.getListItem(this.ballList, targetElement);

        } else {
            item = this.getListItem(this.itemList, targetElement);
        }
        item.rotate();
    }

    // 删除元素
    deleteItem(targetElement) {
        if (!targetElement) {
            return;
        }
        let item = null;
        // 遍历 item，寻找并删除目标元素
        if (targetElement.classList.contains('ball')) {
            item = this.deleteListItem(this.ballList, targetElement);
        } else {
            item = this.deleteListItem(this.itemList, targetElement);
        }
        this.setBoardStatusFalse(item.x / config.GRID_WIDTH, item.y / config.GRID_WIDTH,
            item.width / config.GRID_WIDTH, item.height / config.GRID_WIDTH);
        // 清除 focus 元素
        this.focusElement = null;
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
                let target = list[i];
                list[i].deleteElement();
                list.splice(i, 1);
                return target;
            }
        }
    }

    // 获取所有 Item 的位置
    getItemsLocation() {
        let location = [];
        this.ballList.forEach(item => {
            location.push([item.constructor.name, item.x / config.GRID_WIDTH, item.y / config.GRID_WIDTH, // type, x, y
                item.width / config.GRID_WIDTH, item.height / config.GRID_WIDTH, // width, height
                item.angle
            ]); // angle
        });

        this.itemList.forEach(item => {
            if (item.constructor.name !== 'Border') {
                location.push([item.constructor.name, item.x / config.GRID_WIDTH, item.y / config.GRID_WIDTH, // type, x, y
                    item.width / config.GRID_WIDTH, item.height / config.GRID_WIDTH, // width, height
                    item.angle
                ]); // angle
            }
        });
        return location;
    }

    // 开始新的游戏，清空 board
    clearBoard() {
        this.ballList.forEach((item) => {
            item.deleteElement();
        });
        this.itemList.forEach((item) => {
            if (!(item instanceof Border)) {
                item.deleteElement();
            }
        });
        this.ballList = [];
        this.itemList = [new Border()];
        this.focusElement = null;
        this.setBoardStatusFalse(0, 0, 20, 20);
    }

    // 根据信息数组创建 Item 对象
    // info [type, x, y, width, height, angle]
    setItemByInfo(info) {
        let result;
        switch (info[0]) {
            case 'Ball':
                result = new Ball(info[1], info[2], info[3]);
                break;
            case 'Square':
                result = new Square(info[1], info[2], info[3]);
                break;
            case 'Hole':
                result = new Hole(info[1], info[2], info[3]);
                break;
            case 'Triangle':
                result = new Triangle(info[1], info[2], info[3]);
                break;
            case 'Circle':
                result = new Circle(info[1], info[2], info[3]);
                break;
            case 'StraightPipe':
                result = new StraightPipe(info[1], info[2], info[3]);
                break;
            case 'BentPile':
                result = new BentPile(info[1], info[2], info[3]);
                break;
            case 'Baffle':
                result = new Baffle(info[1], info[2], info[3], info[4]);
                break;
        }
        for (let i = 0; i < info[5]; i++) {
            result.rotate();
        }
        this.setBoardStatusTrue(info[1], info[2], info[3], info[4]);
        return result;
    }

    // 根据位置信息设置布局
    setItemsByLocation(location) {
        location.forEach((info) => {
            if (info[0] === 'Ball') {
                this.ballList.push(this.setItemByInfo(info));
            } else {
                this.itemList.push(this.setItemByInfo(info));
            }
        });
        localStorage.setItem('tempLocation', JSON.stringify(location));
    }
}