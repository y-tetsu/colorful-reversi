// 盤面
const X = 0;  // 壁
const E = 1;  // 空きマス
const B = 2;  // 黒色の石
const W = 3;  // 白色の石
const DIRECTION_XY = [
  {'x': 0, 'y': 1},  // 上
  {'x': 1, 'y': 1},  // 右上
  {'x': 1, 'y': 0},  // 右
  {'x': 1, 'y':-1},  // 右下
  {'x': 0, 'y':-1},  // 下
  {'x':-1, 'y':-1},  // 左下
  {'x':-1, 'y': 0},  // 左
  {'x':-1, 'y': 1},  // 左上
];
const BOARD = [
  X, X, X, X, X, X, X, X, X, X,
  X, E, E, E, E, E, E, E, E, X,
  X, E, E, E, E, E, E, E, E, X,
  X, E, E, E, E, E, E, E, E, X,
  X, E, E, E, W, B, E, E, E, X,
  X, E, E, E, B, W, E, E, E, X,
  X, E, E, E, E, E, E, E, E, X,
  X, E, E, E, E, E, E, E, E, X,
  X, E, E, E, E, E, E, E, E, X,
  X, X, X, X, X, X, X, X, X, X,
];
const GAME_BOARD_SIZE = Math.sqrt(BOARD.length);
const BOARD_SIZE = GAME_BOARD_SIZE - 2;
const GAME_BOARD_ELEMENT_NUM = GAME_BOARD_SIZE * GAME_BOARD_SIZE;
const BOARD_INDEX_START = GAME_BOARD_SIZE + 1;
const BOARD_INDEX_END = (GAME_BOARD_SIZE + 1) * BOARD_SIZE;
const BOARD_INDEXS = getBoardIndexs();

// ゲームで遊べる範囲の全ての盤面位置を取得
function getBoardIndexs() {
  const allElements = Array(GAME_BOARD_ELEMENT_NUM).fill().map((_, i) => i)
  const removeTopBottom = allElements.filter(e => (e >= BOARD_INDEX_START && e <= BOARD_INDEX_END));
  return removeTopBottom.filter(e => (e % GAME_BOARD_SIZE !== 0 && (e + 1) % GAME_BOARD_SIZE !== 0));
}

// 打てる手を取得する処理
// (引数)
//  turn  : プレイヤーの手番(色)
//  board : 盤面情報を格納した配列
// (戻り値)
//  legalMoves : 打てる手(マスを表す番号)の配列
function getLegalMoves(turn, board) {
  let legalMoves = [];
  for (let index of BOARD_INDEXS) {
    if (getFlippablesAtIndex(turn, board, index).length > 0) legalMoves.push(index);
  }
  return legalMoves;
}

// ひっくり返せる石を取得する処理
// (引数)
//  turn  : プレイヤーの手番(色)
//  board : 盤面情報を格納した配列
//  index : 石を置く位置(マスを示す番号)
// (戻り値)
//  flippables : ひっくり返せる石の位置(マスを示す番号)の配列
function getFlippablesAtIndex(turn, board, index) {
  let flippables = [];
  if (board[index] !== E) return flippables;  // 空きマス以外はスキップ
  const opponent = turn === B ? W : B;
  for (let {x, y} of DIRECTION_XY) {
    const dir = (GAME_BOARD_SIZE * y) + x;
    let opponentDiscs = [];
    let next = index + dir;
    // 相手ディスクが連続しているものを候補とする
    while (opponent === board[next]) {
      opponentDiscs.push(next);
      next += dir;
    }
    // 連続が途切れた箇所が自ディスクの場合、候補を戻り値に追加
    if (board[next] === turn) {
      flippables = flippables.concat(opponentDiscs);
    }
  }
  return flippables;
}

// 石を置く処理
// (引数)
//  turn  : プレイヤーの手番(色)
//  board : 盤面情報を格納した配列
//  index : 石を置く位置(マスを示す番号)
function putDisc(turn, board, index) {
  let flippables = getFlippablesAtIndex(turn, board, index);
  board[index] = turn;                 // 手の位置にディスクを置く
  for (let flippable of flippables) {  // 相手のディスクをひっくり返す
    board[flippable] = turn;
  }
}
