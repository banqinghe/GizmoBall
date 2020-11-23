import config from "./config.js";
import Item from "./Item.js";
import CollisionCircle from "./collision/Circle.js";

export default class Circle extends Item{
    constructor(coordX, coordY, size) {
        super(coordX, coordY, size);
        this.radius = config.GRID_WIDTH * size / 2;
        this.centerX = this.x + config.GRID_WIDTH * size / 2;
        this.centerY = this.y + config.GRID_WIDTH * size / 2;
        this.init();
    }

    init() {
        // 设定
        this.element.classList.add('circle');
        this.setLineAndCircleList(this.size);
    }

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