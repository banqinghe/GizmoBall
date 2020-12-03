import Item from "./Item.js";
import Circle from "./collision/Circle.js";

export default class Hole extends Item {
    constructor(coordX, coordY, size) {
        super(coordX, coordY, size);
        this.init();
    }

    init(){
        // 根绝参数设定初始位置
        this.element.classList.add('hole');
        this.setLineAndCircleList(this.size);
    }

    /*取出构成 Hole 的圆形与小球进行碰撞检测*/
    collision(ball) {
        if (this.circleList[0].checkCollision(ball)) {
            ball.deleteElement();
        }
    }

    isCollided(ball) {
        return this.circleList[0].checkCollision(ball);
    }

    // 没有碰撞....
    bigger() {
        super.bigger();
        this.setLineAndCircleList(this.size);
    }

    smaller() {
        if (this.size === 1) {
            return;
        }
        super.smaller();
        this.setLineAndCircleList(this.size);
    }

    setLineAndCircleList(size) {
        this.circleList = [];
        this.circleList.push(new Circle(this.x, this.y, size));
    }

}