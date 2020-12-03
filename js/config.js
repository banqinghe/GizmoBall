const config = {
  GRID_WIDTH: 30,     // 网格宽度
  G: 0.3,             // 重力加速度
  F: 0.01,            // 阻力加速度
  BOARD_WIDTH: 600,   // 容器宽度
  BOARD_HEIGHT: 600,  // 容器高度
  BAFFLE_HEIGHT: 10,

  NUMBER_OFFSET: 0.001,

  // 棋盘 DOM 对象
  GAME_BOARD: document.querySelector('.game-board'),

  // 图形的默认大小
  defaultSize: {
    BALL: .8,
    SQUARE: 2,
    HOLE: 1,
    TRIANGLE: 2,
    CIRCLE: 2,
    PIPE: 1,
    CURVE: 1,
    BAFFLE: 4
  }
};

export default config;
