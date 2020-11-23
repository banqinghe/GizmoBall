import Item from "./Item.js";
import Line from "./collision/Line.js";
import Circle from "./collision/Circle.js";

export default class Triangle extends Item {
    constructor(coordX, coordY, size, type) {
        super(coordX, coordY, size);
        this.type = type;
        this.init();
    }

    init(){
        // 根绝参数设定初始位置
        this.element.classList.add('triangle');
        this.element.style.height = '0px';
        this.element.style.width = '0px';
        this.element.style.borderBottomWidth = this.height + 'px';
        this.element.style.borderRightWidth = this.width + 'px';

        this.lineList.push(new Line(this.x, this.y, this.size, Math.acos(0)));
        this.lineList.push(new Line(this.x, this.y + this.height, this.size, 0));
        this.lineList.push(new Line(this.x, this.y, this.size * Math.sqrt(2), Math.acos(0)/2));

        this.circleList.push(new Circle(this.x, this.y,0));
        this.circleList.push(new Circle(this.x, this.y + this.height,0));
        this.circleList.push(new Circle(this.x + this.width, this.y + this.height,0));
    }

    //重写 bigger 方法
    bigger() {
        super.bigger();
        this.element.style.height = '0px';
        this.element.style.width = '0px';
        this.element.style.borderBottomWidth = this.height + 'px';
        this.element.style.borderRightWidth = this.width + 'px';
    }

    //重写 smaller 方法
    smaller() {
        if (this.size === 1) {
            return;
        }
        super.smaller();
        this.element.style.height = '0px';
        this.element.style.width = '0px';
        this.element.style.borderBottomWidth = this.height + 'px';
        this.element.style.borderRightWidth = this.width + 'px';
    }
}