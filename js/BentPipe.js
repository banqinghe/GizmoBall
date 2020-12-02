import Item from "./Item.js";
import Line from "./collision/Line.js";
import Circle from "./collision/Circle.js";
import Arc from "./collision/Arc.js";
import config from "./config.js";

export default class BentPile extends Item {
    constructor(coordX, coordY, size) {
        super(coordX, coordY, size);
        this.init();
    }

    init(){
        // 根绝参数设定初始位置
        this.element.classList.add('curve');

        this.arcList = [];

        this.arcQueue = [
            new Arc(this.x, this.y, this.size, 0),
            new Arc(this.x, this.y, this.size, 1),
            new Arc(this.x, this.y, this.size, 2),
            new Arc(this.x, this.y, this.size, 3)
        ];

        //维护一个 lineQueue 用于旋转时的线段替换，下标 0 和下标 1 用于正向，下标 2 和下标 3 用于反向
        this.lineQueue = [
            new Line(this.x, this.y, this.size, Math.acos(0)),
            new Line(this.x, this.y, this.size, 0),
            new Line(this.x + this.width, this.y, this.size, Math.acos(0)),
            new Line(this.x , this.y + this.height, this.size, 0)
        ];
        
        this.circleQueue = [
            new Circle(this.x, this.y + this.height,0),
            new Circle(this.x, this.y,0),
            new Circle(this.x + this.width, this.y,0),
            new Circle(this.x + this.width, this.y + this.height,0)
        ];
        
        this.initLineAndCircleListAndArcList();

    }

    initLineAndCircleListAndArcList() {
        /*for (let i = 0; i < 2; i++) {
            this.lineList.push(this.lineQueue[i])
        }*/
        for (let i = 0; i < 3; i++) {
            this.circleList.push(this.circleQueue[i])
        }

        this.arcList.push(this.arcQueue[0]);
    }

    collision(ball) {
        super.collision(ball);
        this.arcList[0].hit(ball);
        /*if ((this.lineQueue[0].checkCollision(ball) && this.angle === 0 ) ||
            (this.lineQueue[1].checkCollision(ball) && this.angle === 1)) {
            let sign = ball.vx > 0 ? 1 : -1;
            ball.vy = 0;
            ball.vx = sign * 0.2;
            ball.y = this.y + this.height / 2 - ball.radius;

            if (this.angle < 2) {

            } else {
                let sign = ball.vx > 0 ? 1 : -1;
                ball.vx = 0;
                ball.vx = sign * 0.2;
                ball.y = this.y + this.height / 2 - ball.radius;
            }
            ball.element.style.transform = `translate(${ball.x}px, ${ball.y}px)`;
        }
*/
    }

    bigger() {
        super.bigger();
        this.setListAndQueue();
    }

    smaller() {
        if (this.size === 1) {
            return;
        }
        super.smaller();
        this.setListAndQueue();
    }

    setListAndQueue() {
        /*this.lineList = this.updateLineList(this.lineList, this.size);*/
        this.lineQueue = this.updateLineList(this.lineQueue, this.size);
        this.circleList = this.updateCircleList(this.circleList, this.size);
        this.circleQueue = this.updateCircleList(this.circleQueue, this.size);
        this.arcList = this.updateArcList(this.arcList, this.size);
        this.arcQueue = this.updateArcList(this.arcQueue, this.size);
    }

    rotate() {
        super.rotate();
        //this.lineList = [];
        let temp = this.lineQueue.shift()
        this.lineQueue.push(temp);
        /*for (let i = 0; i < 2; i++) {
            this.lineList.push(this.lineQueue[i]);
        }*/

        this.circleList = [];
        temp = this.circleQueue.shift()
        this.circleQueue.push(temp);
        for (let i = 0; i < 3; i++) {
            this.circleList.push(this.circleQueue[i]);
        }

        this.arcList = [];
        temp = this.arcQueue.shift();
        this.arcQueue.push(temp);
        this.arcList.push(this.arcQueue[0]);
        console.log(this.arcList);;
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

    updateArcList(list, size) {
        let newArcList = [];
        list.forEach(function (arc) {
            newArcList.push(new Arc(arc.x1, arc.y1, size, arc.angle));
        });
        return newArcList;
    }
}