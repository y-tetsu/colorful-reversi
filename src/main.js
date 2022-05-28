// リバーシ
function start() {
  initGame();  // ゲーム初期化
  initUi();    // UI盤面作成
  gameLoop();  // ゲーム開始
}

start();  // ゲーム開始

window.onresize = resizeUi;
