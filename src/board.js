// 盤面
const E = 0;  // EMPYT
const B = 1;  // BLACK
const W = -1; // WHITE
const H = 2;  // HOLE
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
  H, H, H, H, H, H, H, H, H, H,
  H, H, H, E, E, E, E, H, H, H,
  H, H, E, E, E, E, E, E, H, H,
  H, E, E, E, B, W, E, E, E, H,
  H, E, E, B, W, B, W, E, E, H,
  H, E, E, W, B, W, B, E, E, H,
  H, E, E, E, W, B, E, E, E, H,
  H, H, E, E, E, E, E, E, H, H,
  H, H, H, E, E, E, E, H, H, H,
  H, H, H, H, H, H, H, H, H, H,
];
const BOARD_COLOR = [
  "*", "*", "*", "*", "*", "*", "*", "*", "*", "*",
  "*", "*", "*", "1", "1", "9", "9", "*", "*", "*",
  "*", "*", "1", "1", "1", "9", "9", "9", "*", "*",
  "*", "1", "1", "1", "1", "9", "9", "9", "9", "*",
  "*", "1", "1", "1", "1", "9", "9", "9", "9", "*",
  "*", "3", "3", "3", "3", "8", "8", "8", "8", "*",
  "*", "3", "3", "3", "3", "8", "8", "8", "8", "*",
  "*", "*", "3", "3", "3", "8", "8", "8", "*", "*",
  "*", "*", "*", "3", "3", "8", "8", "*", "*", "*",
  "*", "*", "*", "*", "*", "*", "*", "*", "*", "*",
];
const COLOR_CODE_CONFIG = {
  '0': 'lightsteelblue',
  '1': 'lightskyblue',
  '2': 'paleturquoise',
  '3': 'mediumaquamarine',
  '4': 'aquamarine',
  '5': 'palegreen',
  '6': 'lightgreen',
  '7': 'khaki',
  '8': 'navajowhite',
  '9': 'pink',
  'a': 'thistle',
  'b': 'plum',
  'c': 'silver',
  'd': 'gray',
  'e': 'black',
  'f': 'white',
  '*': '* no color *',
};
const GAME_BOARD_SIZE = Math.sqrt(BOARD.length);
const BOARD_SIZE = GAME_BOARD_SIZE - 2;
const GAME_BOARD_ELEMENT_NUM = GAME_BOARD_SIZE * GAME_BOARD_SIZE;
const BOARD_INDEX_START = GAME_BOARD_SIZE + 1;
const BOARD_INDEX_END = (GAME_BOARD_SIZE + 1) * BOARD_SIZE;
const BOARD_INDEXS = getBoardIndexs();

function getBoardIndexs() {
  const allElements = Array(GAME_BOARD_ELEMENT_NUM).fill().map((_, i) => i)
  const removeTopBottom = allElements.filter(element => (element >= BOARD_INDEX_START && element <= BOARD_INDEX_END));
  return removeTopBottom.filter(element => (element % GAME_BOARD_SIZE !== 0 && (element + 1) % GAME_BOARD_SIZE !== 0));
}

function getLegalMoves(turn, board) {
  let legalMoves = [];
  for (let index of BOARD_INDEXS) {
    if (getFlippablesAtIndex(turn, board, index).length > 0) legalMoves.push(index);
  }
  return legalMoves;
}

function getFlippablesAtIndex(turn, board, index) {
  let flippables = [];
  if (board[index] !== E) return flippables;  // 空きマス以外はスキップ
  const opponent = getOpponentColor(turn);
  for (let xy of DIRECTION_XY) {
    const dir = (GAME_BOARD_SIZE * xy['y']) + xy['x'];
    let opponentDiscs = [];
    let next = index + dir;
    // 相手ディスクが連続しているものを候補とする
    while (board[next] === opponent) {
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

function putDisc(turn, board, index) {
  let flippables = getFlippablesAtIndex(turn, board, index);
  board[index] = turn;            // 手の位置にディスクを置く
  for (let move of flippables) {  // 相手のディスクをひっくり返す
    board[move] = turn;
  }
}
