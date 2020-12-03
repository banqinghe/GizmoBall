import Item from "./Item.js";
import Line from "./collision/Line.js";
import Circle from "./collision/Circle.js";
import config from "./config.js";

export default class Triangle extends Item {
    constructor(coordX, coordY, size, type) {
        super(coordX, coordY, size);
        this.init();
    }

    init(){
        // 根绝参数设定初始位置
        this.element.classList.add('triangle');
        this.element.style.height = '0px';
        this.element.style.width = '0px';
        this.element.style.borderBottomWidth = this.height + 'px';
        this.element.style.borderRightWidth = this.width + 'px';
        this.initQueue();
        this.initLineAndCircleList();
    }

    initQueue() {
        this.lineQueue = [
            new Line(this.x, this.y + this.height, this.size, 0),
            new Line(this.x, this.y, this.size, Math.acos(0)),
            new Line(this.x, this.y, this.size, 0),
            new Line(this.x + this.width, this.y, this.size, Math.acos(0))
        ];
        this.slashQueue = [
            new Line(this.x, this.y, this.size * Math.sqrt(2), Math.acos(0)/2),
            new Line(this.x + this.width, this.y, this.size * Math.sqrt(2), Math.acos(0)*3/2)
        ];
        this.circleQueue = [
            new Circle(this.x + this.width, this.y + this.height,0),
            new Circle(this.x, this.y + this.height,0),
            new Circle(this.x, this.y,0),
            new Circle(this.x + this.width, this.y,0),
        ];
    }

    initLineAndCircleList() {
        this.lineList.push(this.lineQueue[0]);
        this.lineList.push(this.lineQueue[1]);
        this.lineList.push(this.slashQueue[0]);
        for (let i = 0 ; i < 3 ; i++) {
            this.circleList.push(this.circleQueue[i]);
        }
    }

    //重写 bigger 方法
    bigger() {
        super.bigger();
        this.element.style.height = '0px';
        this.element.style.width = '0px';
        this.element.style.borderBottomWidth = this.height + 'px';
        this.element.style.borderRightWidth = this.width + 'px';
        this.setLineAndCircleList(this.size);
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
        this.setLineAndCircleList(this.size);
        console.log(this.lineList);
    }

    //旋转，利用队列的先进先出的性质保持 line 和 circle 的顺序
    rotate() {
        super.rotate();
        let line_front = this.lineQueue.shift();
        this.lineList = [];
        this.lineList.push(this.lineQueue[0]);
        this.lineList.push(this.lineQueue[1]);
        this.lineQueue.push(line_front);

        let slash_front = this.slashQueue.shift();
        this.lineList.push(this.slashQueue[0]);
        this.slashQueue.push(slash_front);

        let circle_front = this.circleQueue.shift();
        this.circleList = [];
        this.circleQueue.forEach((circle) => {
            this.circleList.push(circle);
        });
        this.circleQueue.push(circle_front);
    }

    setLineAndCircleList(size) {
        this.lineList = this.updateLineList(this.lineList, size);
        this.lineQueue  = this.updateLineList(this.lineQueue, size);
        this.slashQueue = this.updateLineList(this.slashQueue, size);
        this.circleList = this.updateCircleList(this.circleList, size);
        this.circleQueue = this.updateCircleList(this.circleQueue, size);
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
                newLineList.push(new Line(trans_x, line.y1, size * Math.sqrt(2), line.angle));
            } else if (line.y1 !== this.y) {
                //底线
                newLineList.push(new Line(line.x1, trans_y, size, line.angle));
            } else if (line.angle === Math.acos(0)/2) {
                //右斜
                newLineList.push(new Line(line.x1, line.y1, size * Math.sqrt(2), line.angle));
            } else {
                //其他初始点不变的情况
                newLineList.push(new Line(line.x1, line.y1, size, line.angle));
            }
        });
        return newLineList;
    }
}