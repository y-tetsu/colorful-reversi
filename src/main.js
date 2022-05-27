let reversi = null;

// ゲームの開始
function start() {
  reversi = new Game(BOARD, B, BLACK, WHITE);
  initUi();
  reversi.loop();
}

start();
