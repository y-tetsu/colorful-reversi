// ゲーム進行
const GAME_PLAY = 0;
const GAME_STOP = 1;
const GAME_END = 2;
const WAIT_TIME = 800;  // ms
const GAME_TURN_END = 'End';
const DRAW = 'Draw';
const PASS = 'Pass';
const WIN = 'Win!';
const TURN_ORDER = [B, W, A];             // プレイヤーの順番
const PLAYERS = [...new Set(TURN_ORDER)]  // 参加プレイヤー

let playersInfo = {
  [B]: {                      // 黒プレイヤー
    'player'   : HUMAN,       // 人が操作
    'opponents': [W, A],      // 白と灰をひっくり返せる
    'score'    : 0,           // 黒の石の数
  },
  [W]: {                      // 白プレイヤー
    'player'   : AI_LEVEL_1,  // コンピュータが操作(やや強い)
    'opponents': [B, A],      // 黒と灰をひっくり返せる
    'score'    : 0,           // 白の石の数
  },
  [A]: {                      // 灰プレイヤー
    'player'   : AI_LEVEL_0,  // コンピュータが操作(ランダム)
    'opponents': [B, W],      // 黒と白をひっくり返せる
    'score'    : 0,           // 灰の石の数
  },
};
let gameBoard = [];
let gameState = GAME_PLAY;
let turnIndex = 0;
let gameTurn = TURN_ORDER[turnIndex];
let passCount = 0;

// ゲーム情報を初期化
function initGame() {
  gameBoard = BOARD.concat();  // 盤面初期設定を取得
  gameState = GAME_PLAY;
  turnIndex = 0;
  gameTurn = TURN_ORDER[turnIndex];
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
  if (passCount === TURN_ORDER.length) return GAME_END;                // ゲーム終了
  if (passCount < TURN_ORDER.length && passCount > 0) indicatePass();  // パスの通知
  if (isPassOrEnd()) return GAME_PLAY;                                 // ゲーム開始時のパス/終了判定
  passCount = 0;
  if (!actMove(gameTurn, gameBoard, playersInfo[gameTurn].player)) {
    return GAME_STOP;  // ユーザー入力待ちのため、ゲームループを停止
  }
  updateScore();
  [gameTurn, turnIndex] = getNextTurn(turnIndex);  // 次のターンを取得
  if (isEnd()) gameTurn = GAME_TURN_END;           // ゲームの終了判定
  return GAME_PLAY;
}

// 待ち時間取得
function getWaitTime() {
  // ユーザー同士、コンピュータ同士の場合はウェイトなし
  const players = [...new Set(PLAYERS.map(e => playersInfo[e].player))];
  return players.includes(HUMAN) && (players.length > 1) ? WAIT_TIME : 0;
}

// 勝利プレイヤーの通知
function indicateWinner() {
  const winner = getWinner(PLAYERS.map(e => playersInfo[e].score));
  const message = winner === DRAW ? winner : getGameTurnText(winner) + ' ' + WIN;
  alert(message);
}

// 勝利プレイヤーの石を返す
// (引数)
//  scores : 各プレイヤーのスコア配列
// (戻り値)
//  winner : 勝利プレイヤーまたはDRAW(引き分け)
function getWinner(scores) {
  const max = Math.max(...scores);
  return scores.filter(e => e === max).length === 1 ? PLAYERS[scores.indexOf(max)] : DRAW;
}

// パスの通知
function indicatePass() {
  if ([...new Set(PLAYERS.map(e => playersInfo[e].player))].includes(HUMAN)) {
    let passTurns = []
    let index = turnIndex;
    for (let i=0; i<passCount; i++) {
      index--;
      if (index < 0) index = TURN_ORDER.length - 1;
      passTurns.push(getGameTurnText(TURN_ORDER[index]));
    }
    alert(passTurns.reverse().join(' and ') + ' ' + PASS);
  }
}

// パスまたは終了の判定
function isPassOrEnd() {
  if (isPass()) {
    for (let i=0; i<TURN_ORDER.length-1; i++) {
      if (!isPass()) break;
    }
    return true;
  }
  return false;
}

// パスの判定
function isPass() {
  if (getLegalMoves(gameTurn, gameBoard).length <= 0) {
    [gameTurn, turnIndex] = getNextTurn(turnIndex);
    passCount++;
    return true;
  }
  return false;
}

// 終了の判定
function isEnd() {
  for (let i=0; i<TURN_ORDER.length; i++) {
    if (!isPass()) return false;
  }
  return true;
}

// 次の手番と順番を返す
// (引数)
//  index  : プレイヤーの順番
// (戻り値)
//  return : 次の手番と順番
function getNextTurn(index) {
  index++;
  if (index >= TURN_ORDER.length) index = 0;
  return [TURN_ORDER[index], index];
}

// 自身の対戦相手を返す
// (引数)
//  turn  : プレイヤーの手番(色)
// (戻り値)
//  return : 対戦相手を格納した配列
function getOpponentColors(turn) {
  return turn in playersInfo ? playersInfo[turn].opponents : [];
}

// スコアの更新
function updateScore() {
  for (let player of PLAYERS) {
    playersInfo[player].score = gameBoard.filter(e => e === player).length;
  }
}
