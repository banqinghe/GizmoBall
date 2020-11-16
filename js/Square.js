import config from "./config.js";
import Item from "./Item.js";

export default class Square extends Item{
    constructor(coordX, coordY, parentElement, size) {
        super(coordX, coordY, parentElement);
        this.size = size;
        this.width = size * config.GRID_WIDTH;
        this.height = size * config.GRID_WIDTH;
        this.init();
    }

    init(){
        // 根绝参数设定初始位置
        this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
        this.element.classList.add('square');
        this.parentElement.appendChild(this.element);
        this.element.style.height = this.height + 'px';
        this.element.style.width = this.width + 'px';
    }
}