import Item from "./Item.js";
import Line from "./collision/Line.js";
import Circle from "./collision/Circle.js";
import config from "./config";

export default class Hole extends Item {
    constructor(coordX, coordY, size) {
        super(coordX, coordY, size);
        this.init();
    }

    init(){
        // 根绝参数设定初始位置
        this.element.classList.add('Hole');
    }

    // 没有碰撞....


}