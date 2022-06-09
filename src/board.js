const H = 0;  // 穴
const E = 1;  // 空きマス
const B = 2;  // 黒色の石
const W = 3;  // 白色の石
const A = 4;  // 灰色の石
const C = 5;  // シアン色の石
const Y = 6;  // 山吹色の石
const G = 7;  // 緑色の石
const DIRECTION_XY = [
  {'x': 0, 'y':-1},  // 上
  {'x': 1, 'y':-1},  // 右上
  {'x': 1, 'y': 0},  // 右
  {'x': 1, 'y': 1},  // 右下
  {'x': 0, 'y': 1},  // 下
  {'x':-1, 'y': 1},  // 左下
  {'x':-1, 'y': 0},  // 左
  {'x':-1, 'y':-1},  // 左上
];
const WILDCARD = G;            // 変化石
const PERMANENTS = [G, C, Y];  // 不変石
const BOARD = [
  H, H, H, H, H, H, H, H, H, H, H, H,
  H, H, H, H, H, E, E, H, H, H, H, H,
  H, H, H, H, E, E, E, E, H, H, H, H,
  H, H, H, E, E, E, E, E, E, H, H, H,
  H, H, E, E, E, G, C, E, E, E, H, H,
  H, E, E, E, Y, W, B, G, E, E, E, H,
  H, E, E, E, G, B, W, Y, E, E, E, H,
  H, H, E, E, E, C, G, E, E, E, H, H,
  H, H, H, E, E, E, E, E, E, H, H, H,
  H, H, H, H, E, E, E, E, H, H, H, H,
  H, H, H, H, H, E, E, H, H, H, H, H,
  H, H, H, H, H, H, H, H, H, H, H, H,
];
const BOARD_COLOR = [
  '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*',
  '*', '*', '*', '*', '*', '1', '2', '*', '*', '*', '*', '*',
  '*', '*', '*', '*', '1', '1', '2', '2', '*', '*', '*', '*',
  '*', '*', '*', '1', '5', '1', '2', '2', '2', '*', '*', '*',
  '*', '*', '1', '1', '1', '1', '2', '2', '6', '2', '*', '*',
  '*', '1', '1', '1', '1', '1', '2', '2', '2', '2', '2', '*',
  '*', '3', '3', '3', '3', '3', '4', '4', '4', '4', '4', '*',
  '*', '*', '3', '6', '3', '3', '4', '4', '4', '4', '*', '*',
  '*', '*', '*', '3', '3', '3', '4', '5', '4', '*', '*', '*',
  '*', '*', '*', '*', '3', '3', '4', '4', '*', '*', '*', '*',
  '*', '*', '*', '*', '*', '3', '4', '*', '*', '*', '*', '*',
  '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*',
];
const COLOR_CODE = {
  '0': 'green',
  '1': 'lightskyblue',
  '2': 'pink',
  '3': 'mediumaquamarine',
  '4': 'navajowhite',
  '5': 'white',
  '6': 'black',
  '*': '* no color *',
};

// 打てる手を取得する処理
// (引数)
//  turn  : プレイヤーの手番(色)
//  board : 盤面情報を格納した配列
// (戻り値)
//  legalMoves : 打てる手(マスを表す番号)の配列
function getLegalMoves(turn, board) {
  let legalMoves = [];
  for (let i=0; i<board.length; i++) {
    const flippables = getFlippablesAtIndex(turn, board, i);
    if (flippables.length > 0) legalMoves.push(i);
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
  const opponents = getOpponentColors(turn);
  const size = Math.sqrt(board.length);
  for (let {x, y} of DIRECTION_XY) {
    const dir = (size * y) + x;
    let opponentDiscs = [];
    let next = index + dir;
    // 相手ディスクが連続しているものを候補とする
    while (opponents.includes(board[next])) {
      opponentDiscs.push(next);
      next += dir;
    }
    // 連続が途切れた箇所が自ディスクの場合、候補を戻り値に追加
    if (board[next] === turn) {
      flippables = flippables.concat(opponentDiscs);
    }
    else {
      while (opponentDiscs.length) {
        // 候補をpopし、変化石を探す
        if (board[opponentDiscs.pop()] === WILDCARD) {
          // 変化石が見つかったら、残りの候補を戻り値に追加
          flippables = flippables.concat(opponentDiscs);
          break;
        }
      }
    }
  }
  return flippables;
}

// 石を置く処理
// (引数)
//  turn  : プレイヤーの手番(色)
//  board : 盤面情報を格納した配列
//  index : 石を置く位置(マスを示す番号)
// (戻り値)
//  return : 更新された石
function putDisc(turn, board, index) {
  if (index === NO_MOVE) return [];
  const flippables = getFlippablesAtIndex(turn, board, index);
  board[index] = turn;                                                    // 手の位置にディスクを置く
  for (let flippable of flippables) {                                     // 相手のディスクをひっくり返す
    if (!PERMANENTS.includes(board[flippable])) board[flippable] = turn;  // 不変石はひっくり返さない
  }
  return flippables.concat(index);
}

// 自身の対戦相手を返す
// (引数)
//  turn  : プレイヤーの手番(色)
// (戻り値)
//  return : 対戦相手を格納した配列
function getOpponentColors(turn) {
  return turn in FLIPPERS ? FLIPPERS[turn].opponents : [];
}
