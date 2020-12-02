import config from "../config.js";
import Circle from "./Circle.js";

export default class Arc {
    constructor(x1, y1, size,angle){  //弧形的左边界、上边界、直径格数、旋转次数
        this.x1 = x1;
        this.y1 = y1;
        this.size = size;
        this.angle = angle;

        this.r = size * config.GRID_WIDTH;
        this.x2 = x1 + this.r;
        this.y2 = y1 + this.r;
        this.middleX = x1 + this.r * (angle == 1 || angle == 2); //旋转1、2次时圆心与左上角水平距离为r
        this.middleY = y1 + this.r * (angle > 1);                //旋转2、3次时圆心与左上角竖直距离为r
    }

    checkCollision(ball){
        let ballR = ball.size * config.GRID_WIDTH / 2;
        let ballMiddleX = ball.x + ballR;
        let ballMiddleY = ball.y + ballR;

        let limL = this.x1 - (this.angle == 1 || this.angle == 2) * ballR;
        let limR = this.x2 + (this.angle == 0 || this.angle == 3) * ballR;
        let limU = this.y1 - (this.angle == 2 || this.angle == 3) * ballR;
        let limD = this.y2 + (this.angle == 0 || this.angle == 1) * ballR;

        if( ballMiddleX - limL > -config.NUMBER_OFFSET && ballMiddleX - limR < config.NUMBER_OFFSET &&
            ballMiddleY - limU > -config.NUMBER_OFFSET && ballMiddleY - limD < config.NUMBER_OFFSET){ //判断条件用于排除另外三部分弧形的影响
                return  this.r ** 2 - ((ballMiddleX - this.middleX) ** 2 + (ballMiddleY - this.middleY) ** 2) < config.NUMBER_OFFSET //弧形半径小于圆心距离
                    &&  (ballR + this.r) ** 2 - ((ballMiddleX - this.middleX) ** 2 + (ballMiddleY - this.middleY) ** 2) > -config.NUMBER_OFFSET;//弧形半径与小球半径大于圆心距离
        }
        return false;
    }

    changeV(ball){
        new Circle(this.x1, this.y1, this.size).changeV(ball);
    }

    hit(ball) {
        if(this.checkCollision(ball)){
            this.changeV(ball);
        }
    }
}