import config from "../config.js";
import Line from "./Line.js";

export default class Circle {
    constructor(x1, y1, size){  //圆形的左边界、上边界、直径格数
        this.x1 = x1;
        this.y1 = y1;
        this.size = size;

        this.r = size * config.GRID_WIDTH / 2;
        this.middleX = x1 + this.r;
        this.middleY = y1 + this.r;
    }

    checkCollision(ball){
        let ballR = ball.size * config.GRID_WIDTH / 2;
        let ballMiddleX = ball.x + ballR;
        let ballMiddleY = ball.y + ballR;
        return ((ballR + this.r) ** 2 >= (ballMiddleX - this.middleX) ** 2 + (ballMiddleY - this.middleY) ** 2);
    }

    changeV(ball){
        let ballR = ball.size * config.GRID_WIDTH / 2;
        let ballMiddleX = ball.x + ballR;
        let ballMiddleY = ball.y + ballR;

        //作图可得,与圆心连线垂直的直线与x正方向夹角满足  tan angle = (x1 - x2) / (y2 - y1),需要特判 y1 = y2的情况
        let lineAngle = ballMiddleY === this.middleY ? Math.acos(0) : Math.atan((ballMiddleX - this.middleX) / (this.middleY - ballMiddleY));
        //console.log(lineAngle);
        //console.log(Math.tan(lineAngle));
        //考虑到球的运动是离散的，故相切点以被撞圆的边界为准
        let lineX = this.middleX - this.r * Math.sin(lineAngle);
        let lineY = this.middleY + this.r * Math.cos(lineAngle);
        //console.log("Hit position is " + lineX + " " + lineY);
        new Line(lineX, lineY, 1, lineAngle).changeV(ball);
    }

    hit(ball) {
        if(this.checkCollision(ball)){
            this.changeV(ball);
        }
    }
}