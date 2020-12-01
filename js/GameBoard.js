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

        this.dropListener();
        this.focusListener();

    }

    dropListener() {
        // 修改默认行为，使game board成为可放置目标
        config.GAME_BOARD.addEventListener('dragover', e => {
            e.preventDefault();
        });

        config.GAME_BOARD.addEventListener('dragenter', e => {
            e.preventDefault();
        });

        // 处理放置事件
        config.GAME_BOARD.addEventListener('drop', e => {
            let x = Math.floor((e.pageX -1) / 30);
            let y = Math.floor((e.pageY - 22) / 30);
            let width = 0;
            let height = 0;
            switch (e.dataTransfer.getData('text')) {
                case 'ball':
                    width = config.defaultSize.BALL;
                    if (this.checkCollision(x, y, width, width)) {
                        this.addBall(new Ball(x,  y,  config.defaultSize.BALL));
                        this.setBoardStatusTrue(x, y, width, width);
                    }
                    break;
                case 'square':
                    width = config.defaultSize.SQUARE;
                    if (this.checkCollision(x, y, width, width)) {
                        this.addItem(new Square(x, y, config.defaultSize.SQUARE));
                        this.setBoardStatusTrue(x, y, width, width);
                    }
                    break;
                case 'triangle':
                    width = config.defaultSize.TRIANGLE;
                    if (this.checkCollision(x, y, width, width)) {
                        this.addItem(new Triangle(x,  y,  config.defaultSize.TRIANGLE));
                        this.setBoardStatusTrue(x, y, width, width);
                    }
                    break;
                case 'circle':
                    width = config.defaultSize.CIRCLE;
                    if (this.checkCollision(x, y, width, width)) {
                        this.addItem(new Circle(x,  y,  config.defaultSize.CIRCLE));
                        this.setBoardStatusTrue(x, y, width, width);
                    }
                    break;
                case 'baffle':
                    width = config.defaultSize.BAFFLE;
                    height = Math.ceil(config.BAFFLE_HEIGHT / config.GRID_WIDTH);
                    if (this.checkCollision(x, y, width, height)) {
                        this.addItem(new Baffle(x,  y,  config.defaultSize.BAFFLE));
                        this.setBoardStatusTrue(x, y, width, height);
                    }
                    this.addItem(new Baffle(x,  y,  config.defaultSize.BAFFLE, config.BAFFLE_HEIGHT));
                    break;
                case 'hole':
                    width = config.defaultSize.HOLE;
                    if (this.checkCollision(x, y, width, width)) {
                        this.addItem(new Hole(x,  y,  config.defaultSize.HOLE));
                        this.setBoardStatusTrue(x, y, width, width);
                    }
                    break;
                case 'curve':
                    width = config.defaultSize.CURVE;
                    if (this.checkCollision(x, y, width, width)) {
                        this.addItem(new BentPile(x,  y,  config.defaultSize.CURVE));
                        this.setBoardStatusTrue(x, y, width, width);
                    }
                    break;
                case 'pipe':
                    width = config.defaultSize.PIPE ;
                    if (this.checkCollision(x, y, width, width)) {
                        this.addItem(new StraightPipe(x,  y,  config.defaultSize.PIPE));
                        this.setBoardStatusTrue(x, y, width, width);
                    }
                    break;
            }
        })
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

    focusListener() {
        config.GAME_BOARD.addEventListener('click', e => {
            // 清除上一个 focus 元素的 outline 样式
            if (this.focusElement) {
                this.focusElement.classList.remove('focus');
            }
            // 选定新的 focus 元素
            if ((!e.target.classList.contains('border')) && e.target !== config.GAME_BOARD) {
                this.focusElement = e.target;
                this.focusElement.classList.add('focus');
            } else {
                this.focusElement = null;
            }
        });
    }

    addBall(ball) {

        this.ballList.push(ball);
    }

    addItem(item) {
        this.itemList.push(item);
    }

    start(){
        this.ballList.forEach(ball => ball.timeStart());
        this.creeping(this);
    }

    creeping(self){

        self.ballList.forEach(function (ball) {
            ball.move();
            //检测 item 和小球的碰撞
            self.itemList.forEach(function (item) {
                item.collision(ball);
            });
            //检测与其他小球的碰撞
            self.ballList.forEach(function (item) {
                if (item !== ball)
                    item.collision(ball);
            });
            //小球进行一次移动

        });
        window.requestAnimationFrame(() => self.creeping(self));
    }

    //  对象 size + 1
    biggerItem(targetElement){
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
            item.width  / config.GRID_WIDTH + 1, item.height  / config.GRID_WIDTH + 1)) {
            this.setBoardStatusTrue(item.x / config.GRID_WIDTH, item.y / config.GRID_WIDTH,
                item.width / config.GRID_WIDTH, item.height / config.GRID_WIDTH);
            return;
        }
        item.bigger();
        this.setBoardStatusTrue(item.x / config.GRID_WIDTH, item.y / config.GRID_WIDTH,
            item.width / config.GRID_WIDTH, item.height / config.GRID_WIDTH);
    }

    // 对象 size - 1
    smallerItem(targetElement){
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
    rotateItem(targetElement){
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

        // 遍历 item，寻找并删除目标元素
        if (targetElement.classList.contains('ball')) {
            this.deleteListItem(this.ballList, targetElement);
        } else {
            this.deleteListItem(this.itemList, targetElement);
        }
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
                list[i].deleteElement();
                list.splice(i, 1);
                break;
            }
        }
    }
}