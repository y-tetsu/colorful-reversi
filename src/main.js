let reversi = null;

// ゲームの開始
function start() {
  reversi = new Game(BOARD, ORDER, FLIPPERS, CUTINS);
  initUi();
  reversi.loop();
}

window.onresize = resizeUi;
start();
