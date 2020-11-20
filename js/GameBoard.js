import Baffle from "./Baffle.js";
import Ball from "./Ball.js";
import Square from "./Square.js";
import Circle from "./Circle.js";
import Triangle from "./Triangle.js";

export default class GameBoard {
    constructor() {
        //小球列表
        this.ballList = [];
        for(let i = 0; i < 20; i++){
            this.ballList.push(new Ball(i, 5.5, 1));
        }
        //其他需要检测碰撞的 item 列表
        this.itemList = [];
        this.itemList.push(new Baffle(9, 16, 4));
        this.itemList.push(new Square(15, 10, 2));
        this.itemList.push(new Triangle(5, 10, 3));
        this.itemList.push(new Circle(5, 4, 4));
        this.start();
    }

    start(){
        this.creeping(this);
    }

    creeping(self){
        self.ballList.forEach(function (ball) {
            //小球进行一次移动
            ball.move();
            //检测 item 和小球的碰撞
            self.itemList.forEach(function (item) {
                item.collision(ball);
            })
            //检测与其他小球的碰撞
            /*self.ballList.forEach(function (item) {
                if (item !== ball)
                item.collision(ball);
            })*/
        })
        window.requestAnimationFrame(() => self.creeping(self));
    }

    addToItemList(){

    }
}