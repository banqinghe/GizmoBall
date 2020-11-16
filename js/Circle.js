import config from "./config.js";
import Item from "./Item.js";

export default class Circle extends Item{
    constructor(coordX, coordY, parentElement, size) {
        super(coordX, coordY, parentElement);
        this.size = size;
        this.radius = config.GRID_WIDTH * size / 2;
        this.center = config.GRID_WIDTH * size / 2;
    }
}