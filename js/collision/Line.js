import config from "../config.js";

export default class Line {
    constructor(x1, y1, size, angle) {
        this.x1 = x1;
        this.y1 = y1;
        this.angle = angle; // 取直线与x轴正方向的夹角
        this.size = size;
        let length = size * config.GRID_WIDTH;

        this.x2 = Math.cos(angle) * length + this.x1;
        this.y2 = Math.sin(angle) * length + this.y1;
    }

    checkCollision(ball) {
        let ballR = ball.size * config.GRID_WIDTH / 2;
        let ballMiddleX = ball.x + ballR;
        let ballMiddleY = ball.y + ballR;

        let tanA = Math.tan(this.angle);
        let cosA = Math.cos(this.angle);
        let sinA = Math.sin(this.angle);

        let limitL = this.x1 - ballR * sinA;
        let limitR = this.x2 + ballR * sinA;

        let dis = Math.abs((tanA * (ballMiddleX - this.x1) + this.y1 - ballMiddleY) * cosA);

        //线段竖直时需要特判
        return (dis <= ballR) &&
            (Math.abs(Math.cos(this.angle)) < config.NUMBER_OFFSET ? (ballMiddleY >= this.y1 && ballMiddleY <= this.y2) : (ballMiddleX >= Math.min(limitL, limitR) && ballMiddleX <= Math.max(limitL, limitR)
            ));
    }


    checkLineCollision(line){
        //线段方向相同时，若要碰撞，y=tanA x + b形式式子中b相等，且绝对值大的x1的绝对值要小于绝对值小的x2的绝对值
        if(Math.abs(this.angle - line.angle) < config.NUMBER_OFFSET){
            if(Math.abs(Math.cos(this.angle)) > config.NUMBER_OFFSET){ //竖直线段需特判
                let tanA = Math.tan(this.angle);
                let b1 = this.y1 - tanA * this.x1;
                let b2 = line.y1 - tanA * line.x1;

                return Math.abs(b1 - b2) < config.NUMBER_OFFSET && Math.max(Math.abs(this.x1), Math.abs(line.x1)) - Math.min(Math.abs(this.x2), Math.abs(this.x2)) < config.NUMBER_OFFSET;
            } else{
                return Math.abs(this.x1 - line.x1) < config.NUMBER_OFFSET && Math.max(Math.abs(this.y1), Math.abs(line.y1)) - Math.min(Math.abs(this.y2), Math.abs(this.y2)) < config.NUMBER_OFFSET;
            }
        } else{ // 线段不平行时，必有交点， 交点若出现在两条线段上，那么两条线段相交
            let k1 = Math.tan(this.angle);
            let k2 = Math.tan(line.angle);
            let b1 = this.y1 - k1 * this.x1;
            let b2 = this.y2 - k2 * this.x2;

            //对于直线y = k1 x + b1 与 y = k2 + b2 的交点横坐标为 (b2 - b1) / (k1 - k2)
            let collisionX = (b2 - b1) / (k1 - k2);
            //交点横坐标要处于左端点以右 右端点以左
            return collisionX - Math.max(Math.min(this.x1, this.x2), Math.min(line.x1, line.x2)) > -config.NUMBER_OFFSET
                && collisionX - Math.min(Math.max(this.x1, this.x2), Math.max(line.x1, line.x2)) < config.NUMBER_OFFSET;
        }
    }

    moveOutside(ball){
        //以下处理穿模问题
        let ballR = ball.size * config.GRID_WIDTH / 2;
        let ballMiddleX = ball.x + ballR;
        let ballMiddleY = ball.y + ballR;

        let tanA = Math.tan(this.angle);
        let cosA = Math.cos(this.angle);

        let dis = Math.abs((tanA * (ballMiddleX - this.x1) + this.y1 - ballMiddleY) * cosA);

        //取圆心到线的垂足
        let footX;
        let footY;
        if(Math.abs(cosA) < config.NUMBER_OFFSET){
            footX = this.x1;
            footY = ballMiddleY;
        } else {
            if(Math.abs(tanA) < config.NUMBER_OFFSET){
                footX = ballMiddleX;
            } else{
                footX = ((ballMiddleX / tanA) + ballMiddleY - this.y1 + tanA * this.x1) / (tanA + 1 / tanA) ;
            }
            footY = (footX - this.x1) * tanA + this.y1;
        }
        console.log("foot: " + footX + " " + footY);
        let newBallMiddleX = (ballMiddleX - footX) * ballR / dis + footX;
        let newBallMiddleY = (ballMiddleY - footY) * ballR / dis + footY;
        ball.x = newBallMiddleX - ballR;
        ball.y = newBallMiddleY - ballR;
    }

    changeV(ball){
        this.moveOutside(ball);
        let v = Math.sqrt(ball.vx ** 2 + ball.vy ** 2);
        console.log("The v is (" + ball.vx + ", " + ball.vy);

        let angleV = ball.vy / ball.vx ? Math.atan(ball.vy / ball.vx) : Math.acos(0);
        if(ball.vx < 0) angleV += Math.acos(-1); //对速度方向偏左部分速度角进行修正

        console.log("AngleV is " + angleV);
        // 画图可知 方向angleV的向量 撞在方向为angle的线段上后，出去的向量方向为 2 * angle - angleV
        let newAngelV = 2 * this.angle - angleV;
        console.log("NewAngleV is " + newAngelV);
        ball.vx = v * Math.cos(newAngelV);
        ball.vy = v * Math.sin(newAngelV);

        //已知线段方程为 y = tanA (x - x1) + y1
        // if(Math.abs(tanA) > config.NUMBER_OFFSET){ // 若对于y, 线段的x唯一, 即线段不为水平的, 那么x偏大速度为正, x偏小速度为负
        //     ball.vx = v * Math.abs(Math.cos(newAngelV)) * (ballMiddleX > ((ballMiddleY - this.y1) / tanA + this.x1) ? 1:-1);
        //
        // } //若是线段水平，则vx不变
        // if(Math.abs(Math.cos(this.angle)) > config.NUMBER_OFFSET){ //竖直/非竖直线段也同理
        //     ball.vy = v * Math.abs(Math.sin(newAngelV)) * (ballMiddleY > ((ballMiddleX - this.x1) * tanA + this.y1) ? 1:-1);
        // }
    }

    hit(ball) {
        if(this.checkCollision(ball)){
            this.changeV(ball);
            return true;
        }
        return false;
    }
}