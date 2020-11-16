import Ball from './Ball.js';
import Baffle from './Baffle.js';
import config from './config.js';

export default class Util {
  static hitRect(ball, rect) {
    //小球落到板上
    let ballR = ball.size * config.GRID_WIDTH / 2;
    let ballMiddleX = ball.x + ballR;
    let ballMiddleY = ball.y + ballR;
    let ballRightX = ball.x + ballR * 2;
    let ballBottomY = ball.y + ballR * 2;

    let rectRightX = rect.x + rect.size * config.GRID_WIDTH;
    let rectBottomY = rect.y + rect.height;

    if (ballMiddleX >= rect.x && ballMiddleX <= rectRightX) {
      //从上面撞到 从下面撞到
      if (ballBottomY >= rect.y && ballBottomY < rectBottomY) {
        ball.vy = -Math.abs(ball.vy);
      } else if (ball.y <= rect.y + 10 && ball.y > rect.y) {
        ball.vy = Math.abs(ball.vy);
      }

    } else if (ballMiddleY <= rect.y && ballMiddleY >= rectBottomY) {
      if (ballRightX >= rect.x && ball.x < rect.x) {
        // 撞到左侧
        ball.vx = -Math.abs(ball.vx);
      } else if (ball.x <= rectRightX && ballRightX > rectRightX) {
        // 撞到右侧
        ball.vx = Math.abs(ball.vx);
      }
      //以下判断四个角上发生的碰撞
    }else {
      let dleft = (ballMiddleX - rect.x) ** 2;
      let dright = (ballMiddleX - rectRightX) ** 2;
      let dup = (ballMiddleY - rect.y) ** 2;
      let ddown = (ballMiddleY - rectBottomY) ** 2;
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