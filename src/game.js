// ゲーム進行
const BLACK_PLAYER = HUMAN;       // 人が操作
const WHITE_PLAYER = AI_LEVEL_0;  // コンピュータが操作(ランダム)
const PLAYER_NUM = 2;             // プレイヤーの人数(黒、白)
const FIRST_PLAYER = B;           // 先手プレイヤー
const GAME_PLAY = 0;
const GAME_STOP = 1;
const GAME_END = 2;
const WAIT_TIME = 800;  // ms
const GAME_TURN_END = 'End';
const DRAW = 'Draw';
const PASS = 'Pass';
const WIN = 'Win!';

let gameBoard = [];
let gameState = GAME_PLAY;
let gameTurn = FIRST_PLAYER;
let passCount = 0;
let blackScore = 0;
let whiteScore = 0;

// ゲーム情報を初期化
function initGame() {
  gameBoard = BOARD.concat();  // 盤面初期設定を取得
  gameState = GAME_PLAY;
  gameTurn = FIRST_PLAYER;
  passCount = 0;
  updateScore();
}

// ゲームループ
function gameLoop() {
  gameState = playGame();
  updateUi();
  switch (gameState) {
    case GAME_PLAY:
      setTimeout(() => gameLoop(), getWaitTime());
      break;
    case GAME_END:
      indicateWinner();
      break;
    default:
      break;
  }
}

// 1手プレイ
function playGame() {
  if (passCount === PLAYER_NUM) return GAME_END;                // ゲーム終了
  if (passCount < PLAYER_NUM && passCount > 0) indicatePass();  // パスの通知
  if (isPassOrEnd()) return GAME_PLAY;                          // ゲーム開始時のパス/終了判定
  passCount = 0;
  let player = gameTurn === B ? BLACK_PLAYER : WHITE_PLAYER;  // プレイヤー取得
  if (!actMove(gameTurn, gameBoard, player)) {
    return GAME_STOP;  // ユーザー入力待ちのため、ゲームループを停止
  }
  updateScore();
  gameTurn = getNextTurn(gameTurn);       // 次のターンを取得
  if (isEnd()) gameTurn = GAME_TURN_END;  // ゲームの終了判定
  return GAME_PLAY;
}

// 待ち時間取得
function getWaitTime() {
  // ユーザー同士、コンピュータ同士の場合はウェイトなし
  return ((BLACK_PLAYER !== WHITE_PLAYER) && (BLACK_PLAYER === HUMAN || WHITE_PLAYER === HUMAN)) ? WAIT_TIME : 0;
}

// 勝利プレイヤーの通知
function indicateWinner() {
  const winner = getWinner(blackScore, whiteScore);
  const message = winner === DRAW ? winner : getGameTurnText(winner) + ' ' + WIN;
  alert(message);
}

// 勝利プレイヤーの石を返す
// (引数)
//  black  : 黒色プレイヤーのスコア
//  white  : 白色プレイヤーのスコア
// (戻り値)
//  winner : B(黒),W(白)またはDRAW(引き分け)
function getWinner(black, white) {
  let winner = DRAW;
  if (black > white) winner = B;
  if (white > black) winner = W;
  return winner;
}

// パスの通知
function indicatePass() {
  if (BLACK_PLAYER === HUMAN || WHITE_PLAYER === HUMAN) {
    const passTurn = getGameTurnText(getNextTurn(gameTurn));
    alert(passTurn + ' ' + PASS);
  }
}

// パスまたは終了の判定
function isPassOrEnd() {
  if (isPass()) {
    isPass();
    return true;
  }
  return false;
}

// パスの判定
function isPass() {
  if (getLegalMoves(gameTurn, gameBoard).length <= 0) {
    gameTurn = getNextTurn(gameTurn);
    passCount++;
    return true;
  }
  return false;
}

// 終了の判定
function isEnd() {
  return isPass() && isPass();
}

// 次の手番を返す
// (引数)
//  turn  : プレイヤーの手番(色)
// (戻り値)
//  return : 次の手番
function getNextTurn(turn) {
  return turn === B ? W : B;
}

// スコアの更新
function updateScore() {
  blackScore = gameBoard.filter(e => e === B).length;
  whiteScore = gameBoard.filter(e => e === W).length;
}
