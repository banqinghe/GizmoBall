import Item from "./Item.js";
import Line from "./collision/Line.js";
import Circle from "./collision/Circle.js";
import config from "./config.js";

export default class StraightPipe extends Item {
    constructor(coordX, coordY, size) {
        super(coordX, coordY, size);
        this.init();
    }

    init(){
        // 根绝参数设定初始位置
        this.element.classList.add('pipe');
        //维护一个 lineQueue 用于旋转时的线段替换，下标 0 和下标 1 用于正向，下标 2 和下标 3 用于反向
        this.lineQueue = [
            new Line(this.x, this.y, this.size, Math.acos(0)),
            new Line(this.x + this.width, this.y, this.size, Math.acos(0)),
            new Line(this.x, this.y, this.size, 0),
            new Line(this.x , this.y + this.height, this.size, 0)
        ];
        this.initLineAndCircleList();
    }

    initLineAndCircleList() {
        this.lineList.push(this.lineQueue[0]);
        this.lineList.push(this.lineQueue[1]);
        this.circleList.push(new Circle(this.x, this.y,0));
        this.circleList.push(new Circle(this.x + this.width, this.y,0));
        this.circleList.push(new Circle(this.x, this.y + this.height,0));
        this.circleList.push(new Circle(this.x + this.width, this.y + this.height,0));
    }

    bigger() {
        super.bigger();
        this.setLineAndCircleList();
    }

    smaller() {
        if (this.size === 1) {
            return;
        }
        super.smaller();
        this.setLineAndCircleList();
    }

    setLineAndCircleList() {
        this.lineList = this.updateLineList(this.lineList, this.size);
        this.lineQueue = this.updateLineList(this.lineQueue, this.size);
        this.circleList = this.updateCircleList(this.circleList, this.size);
    }

    rotate() {
        super.rotate();
        this.lineList = [];
        let fst = this.lineQueue.shift();
        let snd = this.lineQueue.shift();
        this.lineQueue.push(fst);
        this.lineQueue.push(snd);
        this.lineList.push(this.lineQueue[0]);
        this.lineList.push(this.lineQueue[1]);
    }

    //放大或缩小后更新存有线段的 List 中
    updateLineList(list, size) {
        let newLineList = [];
        let trans_x = this.x + size * config.GRID_WIDTH;
        let trans_y = this.y + size * config.GRID_WIDTH;
        list.forEach((line) => {
            if (line.angle === Math.acos(0) && line.x1 !== this.x) {
                //竖直时调整端点 1
                newLineList.push(new Line(trans_x, line.y1, size, line.angle));
            } else if (line.x1 !== this.x) {
                //左斜时调整端点 1
                newLineList.push(new Line(trans_x, line.y1, size, line.angle));
            } else if (line.y1 !== this.y){
                //底线
                newLineList.push(new Line(line.x1, trans_y, size, line.angle));
            } else {
                newLineList.push(new Line(line.x1, line.y1, size, line.angle));
            }
        });
        return newLineList;
    }

    updateCircleList(list, size) {
        let newCircleList = [];
        let trans_x = this.x + size * config.GRID_WIDTH;
        let trans_y = this.y + size * config.GRID_WIDTH;
        list.forEach((circle) => {
            if (circle.x1 !== this.x && circle.y1 !== this.y) {
                newCircleList.push(new Circle(trans_x , trans_y, circle.size));
            } else if (circle.x1 !== this.x) {
                newCircleList.push(new Circle(trans_x , circle.y1, circle.size));
            } else if (circle.y1 !== this.y) {
                newCircleList.push(new Circle(circle.x1, trans_y, circle.size));
            } else {
                newCircleList.push(new Circle(circle.x1, circle.y1, circle.size));
            }
        });
        return newCircleList;
    }

}