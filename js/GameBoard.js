import Baffle from "./Baffle.js";
import Ball from "./Ball.js";
import Square from "./Square.js";
import Util from "./Util.js";
import Circle from "./Circle.js";

export default class GameBoard {
    constructor() {
        //小球列表
        this.ballList = [];
        this.ballList.push(new Ball(3, 2, 1));
        //其他需要检测碰撞的 item 列表
        this.itemList = [];
        this.itemList.push(new Baffle(9, 16, 4));
        this.itemList.push(new Square(15, 10, 2));
        new Circle(5, 6, 4);
        this.start();
    }

    start(){
        this.creeping(this);
    }

    creeping(self){
        self.ballList.forEach(function (ball) {
            //小球进行一次移动
            ball.move();
            self.itemList.forEach(function (item) {
                //检测 item 和小球的碰撞
                Util.hitRect(ball, item);
            })
        })
        window.requestAnimationFrame(() => self.creeping(self));
    }

    addToItemList(){

    }
}