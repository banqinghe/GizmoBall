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