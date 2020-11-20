import Item from "./Item.js";
import Line from "./collision/Line.js";
import Circle from "./collision/Circle.js";

export default class BentPile extends Item {
    constructor(coordX, coordY, size) {
        super(coordX, coordY, size);
        this.init();
    }

    init(){
        // 根绝参数设定初始位置
        this.element.classList.add('curve');

        this.lineList.push(new Line(this.x, this.y, this.size, Math.acos(0)/2));
        this.lineList.push(new Line(this.x + this.width, this.y, this.size, Math.acos(0)/2));

        this.circleList.push(new Circle(this.x, this.y,0));
        this.circleList.push(new Circle(this.x + this.width, this.y,0));
        this.circleList.push(new Circle(this.x, this.y + this.height,0));
        this.circleList.push(new Circle(this.x + this.width, this.y + this.height,0));

    }


}