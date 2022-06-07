let reversi = null;

// ゲームの開始
function start() {
  reversi = new Game(BOARD, ORDER, FLIPPERS);
  initUi();
  reversi.loop();
}

start();
