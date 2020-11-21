import Baffle from "./Baffle.js";
import Ball from "./Ball.js";
import Square from "./Square.js";
import Triangle from "./Triangle.js";
import config from "./config.js";
import Border from "./Border.js";

export default class GameBoard {
    constructor() {
        //小球列表
        this.ballList = [];
        for(let i = 0; i < 1; i++){
            this.addBall(new Ball(1, 5, 1));
        }
        //其他需要检测碰撞的 item 列表
        this.itemList = [];

        this.addItem(new Border());
        this.addItem(new Baffle(9, 16, 4));
        this.addItem(new Square(15, 10, 2));
        this.addItem(new Square(15, 10, 2));
        this.addItem(new Triangle(5, 15, 5));

        this.addListener();

        this.start();
    }

    addListener() {
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
            switch (e.dataTransfer.getData('text')) {
                case 'ball':
                    this.addBall(new Ball(x,  y,  config.defaultSize.BALL));
                    break;

            }
            // this.addElement(e.dataTransfer.getData('text'), e.pageX -1, e.pageY - 22);
            // console.log(e.dataTransfer.getData('text'));
            // console.log(e.pageX -1 , e.pageY - 22);
        })
    }

    addBall(ball) {
        this.ballList.push(ball);
    }

    addItem(item) {
        this.itemList.push(item);
    }

    start(){
        this.creeping(this);
    }

    creeping(self){

        self.ballList.forEach(function (ball) {

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
            ball.move();
        });
        window.requestAnimationFrame(() => self.creeping(self));
    }

    addToItemList(){

    }
}