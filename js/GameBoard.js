import Baffle from "./Baffle.js";
import Ball from "./Ball.js";
import Square from "./Square.js";
import Triangle from "./Triangle.js";

export default class GameBoard {
    constructor() {
        //小球列表
        this.ballList = [];
        for(let i = 0; i < 1; i++){
            this.addBall(new Ball(i, 5, 3));
        }
        //其他需要检测碰撞的 item 列表
        this.itemList = [];
        this.addItem(new Baffle(9, 16, 4));
        this.addItem(new Square(15, 10, 2));
        this.addItem(new Square(15, 10, 2));
        this.addItem(new Triangle(5, 15, 3));

        this.start();
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
            //小球进行一次移动
            // ball.move();
            //检测 item 和小球的碰撞
            self.itemList.forEach(function (item) {
                item.collision(ball);
            });
            //检测与其他小球的碰撞
            self.ballList.forEach(function (item) {
                if (item !== ball)
                item.collision(ball);
            });
            ball.move();
        });
        window.requestAnimationFrame(() => self.creeping(self));
    }

    addToItemList(){

    }
}