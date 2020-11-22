import config from "../config.js";

export default class Line {
    constructor(x1, y1, size, angle) {
        this.x1 = x1;
        this.y1 = y1;
        this.angle = angle; // 取直线与x轴正方向的夹角
        let length = size * config.GRID_WIDTH;

        this.x2 = Math.cos(angle) * length + this.x1;
        this.y2 = Math.sin(angle) * length + this.y1;
    }

    checkCollision(ball){

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
            (Math.cos(this.angle) < 0.01 ?  (ballMiddleY >= this.y1 && ballMiddleY <=  this.y2) : (ballMiddleX >=  Math.min(limitL, limitR) && ballMiddleX <= Math.max(limitL, limitR)
        ));
    }

    changeV(ball){
        let ballR = ball.size * config.GRID_WIDTH / 2;
        let ballMiddleX = ball.x + ballR;
        let ballMiddleY = ball.y + ballR;

        let tanA = Math.tan(this.angle);

        let v = Math.sqrt(ball.vx ** 2 + ball.vy ** 2);
        console.log(v);
        let angleV = ball.vy / ball.vx ? Math.atan(ball.vy / ball.vx) : Math.acos(0);

        // 画图可知 方向angleV的向量 撞在方向为angle的线段上后，出去的向量方向为 2 * angle - angleV
        let newAngelV = 2 * this.angle - angleV;

        if(Math.abs(tanA) > 0.01){ // 若对于y, 线段的x唯一, 即线段不为水平的, 那么x偏大速度为正, x偏小速度为负
            ball.vx = v * Math.abs(Math.cos(newAngelV)) * (ballMiddleX > ((ballMiddleY - this.y1) / tanA + this.x1) ? 1:-1);
        } //若是线段水平，则vx不变
        if(Math.abs(Math.cos(this.angle)) > 0.01){ //竖直/非竖直线段也同理
            ball.vy = v * Math.abs(Math.sin(newAngelV)) * (ballMiddleY > ((ballMiddleX - this.x1) * tanA + this.y1) ? 1:-1);
        }
    }

    hit(ball) {
        if(this.checkCollision(ball)){
            this.changeV(ball);
        }
    }
}