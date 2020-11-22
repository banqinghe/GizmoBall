import Item from "./Item.js";
import Line from "./collision/Line.js";
import Circle from "./collision/Circle.js";


export default class Border extends Item{
    constructor() {
        super(0, 0, 20);
        this.init();
    }

    init(){
        this.element.classList.add('border');

        this.lineList.push(new Line(this.x, this.y, this.size, 0));
        this.lineList.push(new Line(this.x, this.y, this.size, Math.acos(0)));
        this.lineList.push(new Line(this.x, this.y + this.height, this.size + 1, 0));
        this.lineList.push(new Line(this.x + this.width, this.y, this.size, Math.acos(0)));

    }

}