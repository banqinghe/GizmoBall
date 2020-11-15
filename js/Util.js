import Ball from './Ball.js';
import Baffle from './Baffle.js';
import config from './config.js';

export default class Util {
  static hitItem(ball, baffle) {
    //小球落到板上
    let ballBottomY = ball.y + ball.size * config.GRID_WIDTH;
    let ballMiddleX = ball.x + ball.size * config.GRID_WIDTH * 0.5;

    let ballMiddleY = ball.y + ball.size * config.GRID_WIDTH / 2;
    let ballRightX = ball.x + ball.size * config.GRID_WIDTH;
    let baffleRightX = baffle.x + baffle.size * config.GRID_WIDTH;

    if (ballMiddleX >= baffle.x && ballMiddleX <= baffle.x + config.GRID_WIDTH * baffle.size) {
      //从上面撞到 从下面撞到
      if (ballBottomY >= baffle.y && ballBottomY < baffle.y + 10) {
        ball.vy = -Math.abs(ball.vy);
      } else if (ball.y <= baffle.y + 10 && ball.y > baffle.y) {
        ball.vy = Math.abs(ball.vy);
      }
      // if ((ballBottomY >= baffle.y && ballBottomY < baffle.y + 10) || (ball.y <= baffle.y + 10 && ball.y > baffle.y))
      //   ball.vy = -ball.vy;
    } else if (ballMiddleY <= baffle.y && ballMiddleY >= baffle.y + 10) {
      if (ballRightX >= baffle.x && ball.x < baffle.x) {
        // 撞到左侧
        ball.vx = -Math.abs(ball.vx);
      } else if (ball.x <= baffleRightX && ballRightX > baffleRightX) {
        // 撞到右侧
        ball.vx = Math.abs(ball.vx);
      }
    }
    
  }
}