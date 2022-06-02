// ゲーム進行
const BLACK_PLAYER = HUMAN;       // 人が操作
const WHITE_PLAYER = AI_LEVEL_1;  // コンピュータが操作(やや強い)
const ASH_PLAYER = AI_LEVEL_0;    // コンピュータが操作(ランダム)
const PLAYER_NUM = 3;             // プレイヤーの人数(黒、白、灰)
const FIRST_PLAYER = B;           // 先手プレイヤー
const GAME_PLAY = 0;
const GAME_STOP = 1;
const GAME_END = 2;
const WAIT_TIME = 800; // ms
const GAME_TURN_END = "End";
const DRAW = "Draw";

let gameBoard = [];
let gameState = GAME_PLAY;
let gameTurn = FIRST_PLAYER;
let passCount = 0;
let blackScore = 0;
let whiteScore = 0;
let ashScore = 0;

function initGame() {
  gameBoard = BOARD.concat();
  gameState = GAME_PLAY;
  gameTurn = FIRST_PLAYER;
  passCount = 0;
  updateScore();
}

function gameLoop() {
  gameState = playGame();
  updateUi();
  switch (gameState) {
    case GAME_PLAY:
      const waitTime = ((BLACK_PLAYER !== WHITE_PLAYER || BLACK_PLAYER !== ASH_PLAYER) && (BLACK_PLAYER === HUMAN || WHITE_PLAYER === HUMAN || ASH_PLAYER === HUMAN)) ? WAIT_TIME : 0;
      setTimeout(() => gameLoop(), waitTime);
      break;
    case GAME_END:
      const winner = getWinner(blackScore, whiteScore, ashScore);
      const message = winner === B ? "Black Win!" : winner === W ? "White Win!" : winner === A ? "Ash Win!" : winner;
      alert(message);
      break;
    default:
      break;
  }
}

function playGame() {
  if (passCount === PLAYER_NUM) return GAME_END;                // ゲーム終了
  if (passCount < PLAYER_NUM && passCount > 0) indicatePass();  // パスの通知
  if (isPassOrEnd()) return GAME_PLAY;                          // ゲーム開始時の終了判定
  passCount = 0;
  let player = gameTurn === B ? BLACK_PLAYER : gameTurn === W ? WHITE_PLAYER : ASH_PLAYER;  // プレイヤー取得
  const move = getMove(gameTurn, gameBoard, player);  // プレイヤーの手を取得
  if (move === WAIT_HUMAN) return GAME_STOP;  // ユーザー入力待ち
  putDisc(gameTurn, gameBoard, move);  // ディスクを置く
  updateScore();
  gameTurn = getNextTurn(gameTurn);  // 次のターンを取得
  if (isEnd()) gameTurn = GAME_TURN_END;  // ゲームの終了判定
  return GAME_PLAY;
}

function getWinner(black, white, ash) {
  let winner = DRAW;
  if (black > white && black > ash) winner = B;
  if (white > black && white > ash) winner = W;
  if (ash > black && ash > white) winner = A;
  return winner;
}

function indicatePass() {
  if (BLACK_PLAYER === HUMAN || WHITE_PLAYER === HUMAN || ASH_PLAYER === HUMAN) {
    if (passCount === 1) {
      gameTurn === B ? alert('Ash Pass') : gameTurn === W ? alert('Black Pass') : alert('White Pass');
    }
    else if (passCount === 2) {
      gameTurn === B ? alert('White and Ash Pass') : gameTurn === W ? alert('Ash and Black Pass') : alert('Black and White Pass');
    }
  }
}

function isPassOrEnd() {
  if (isPass()) {
    if (isPass()) {
      isPass();
    }
    return true;
  }
  return false;
}

function isPass() {
  if (getLegalMoves(gameTurn, gameBoard).length <= 0) {
    gameTurn = getNextTurn(gameTurn);
    passCount++;
    return true;
  }
  return false;
}

function isEnd() {
  return isPass() && isPass() && isPass();
}

// 自身の手番を返す
// (引数)
//  turn  : プレイヤーの手番(色)
// (戻り値)
//  return : 次の手番
function getNextTurn(turn) {
  return turn === B ? W : turn === W ? A : B;
}

// 自身の対戦相手を返す
// (引数)
//  turn  : プレイヤーの手番(色)
// (戻り値)
//  return : 対戦相手を格納した配列
function getOpponentColors(turn) {
  return turn === B ? [W, A] : turn === W ? [A, B] : [B, W];
}

function updateScore() {
  blackScore = gameBoard.filter(element => element === B).length;
  whiteScore = gameBoard.filter(element => element === W).length;
  ashScore = gameBoard.filter(element => element === A).length;
}
