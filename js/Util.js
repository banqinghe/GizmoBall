import Ball from './Ball.js';
import Baffle from './Baffle.js';
import config from './config.js';

export default class Util {
  static hitRect(ball, rectangle) {
    //小球落到板上
    let ballR = ball.size * config.GRID_WIDTH / 2;
    let ballMiddleX = ball.x + ballR;
    let ballMiddleY = ball.y + ballR;
    let ballRightX = ball.x + ballR * 2;
    let ballBottomY = ball.y + ballR * 2;

    let baffleRightX = rectangle.x + rectangle.size * config.GRID_WIDTH;
    let baffleBottomY = rectangle.y + rectangle.height;
    // let baffleMiddleX = rectangle.x + rectangle.size * config.GRID_WIDTH / 2;
    // let baffleMiddleY = rectangle.y + rectangle.height / 2;
    // let baffleR = Math.sqrt(rectangle.height ** 2 + (rectangle.size * config.GRID_WIDTH / 2) ** 2);


    if (ballMiddleX >= rectangle.x && ballMiddleX <= baffleRightX) {
      //从上面撞到 从下面撞到
      if (ballBottomY >= rectangle.y && ballBottomY < baffleBottomY) {
        ball.vy = -Math.abs(ball.vy);
      } else if (ball.y <= rectangle.y + 10 && ball.y > rectangle.y) {
        ball.vy = Math.abs(ball.vy);
      }
      // if ((ballBottomY >= rectangle.y && ballBottomY < rectangle.y + 10) || (ball.y <= rectangle.y + 10 && ball.y > rectangle.y))
      //   ball.vy = -ball.vy;
    } else if (ballMiddleY <= rectangle.y && ballMiddleY >= baffleBottomY) {
      if (ballRightX >= rectangle.x && ball.x < rectangle.x) {
        // 撞到左侧
        ball.vx = -Math.abs(ball.vx);
      } else if (ball.x <= baffleRightX && ballRightX > baffleRightX) {
        // 撞到右侧
        ball.vx = Math.abs(ball.vx);
      }
      // } else if ((ballMiddleX - baffleMiddleX) ** 2 + (ballMiddleY - baffleMiddleY) ** 2 <= (baffleR + ballR) ** 2){
      //     if (ball.x > baffleRightX) {
      //       ball.vx = Math.abs(ball.vx);
      //     } else {
      //       ball.vx = -Math.abs(ball.vx);
      //     }
      //
      //     if(ball.y > baffleBottomY){
      //       ball.vy = Math.abs(ball.vy);
      //     } else{
      //       ball.vy = -Math.abs(ball.vy);
      //     }
      // }
      //以下判断四个角上发生的碰撞
    }else {
      let dleft = (ballMiddleX - rectangle.x) ** 2;
      let dright = (ballMiddleX - baffleRightX) ** 2;
      let dup = (ballMiddleY - rectangle.y) ** 2;
      let ddown = (ballMiddleY - baffleBottomY) ** 2;
      let squareR = ballR ** 2;

      if(dleft + dup < squareR){
        ball.vx = -Math.abs(ball.vx);
        ball.vy = - Math.abs(ball.vy);
      } else if(dleft + ddown < squareR){
        ball.vx = -Math.abs(ball.vx);
        ball.vy = Math.abs(ball.vy);
      } else if(dright + dup < squareR){
        ball.vx = Math.abs(ball.vx);
        ball.vy = -Math.abs(ball.vy);
      } else if(dright + ddown < squareR){
        ball.vx = Math.abs(ball.vx);
        ball.vy = Math.abs(ball.vy);
      }

    }
  }
}