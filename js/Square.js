import config from "./config.js";
import Item from "./Item.js";

export default class Square extends Item{
    constructor(coordX, coordY, size) {
        super(coordX, coordY, size);
        this.init();
    }

    init(){
        // 根绝参数设定初始位置
        this.element.classList.add('square');
    }
}