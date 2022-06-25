const HUMAN = 'human';
const RANDOM = 'random';
const MINIMUM = 'minimum';
const MAXIMUM = 'maximum';
const MCS = 'mcs';
const MCS2 = 'mcs2';
const NO_MOVE = -1;
const MCS_SCHEDULE = [
  [48, 40, 34, 28, 22,  16,  13,  10,   6],  // 空きマス残り
  [10, 20, 40, 60, 80, 120, 200, 400, 800],  // プレイアウト回数
];
const MCS_SCHEDULE2 = [
  [48,  40,  34,   28,   22,   16,   13,   10,   6],     // 空きマス残り
  [500, 750, 1000, 1250, 1500, 1750, 2000, 4000, 8000],  // プレイアウト回数
];

// プレイヤー
class Player {
  constructor(name) {
    this.name = name;
  }

  // 1手打つ
  actMove(game) {
    let move = NO_MOVE;
    switch (this.name) {
      case HUMAN:
        move = getMoveByHuman(game);
        break;
      case RANDOM:
        move = getMoveByRandom(game);
        break;
      case MINIMUM:
        move = getMoveByMinimum(game);
        break;
      case MAXIMUM:
        move = getMoveByMaximum(game);
        break;
      case MCS:
        move = getMoveByMonteCarloSearch(game, MCS_SCHEDULE);
        break;
      case MCS2:
        move = getMoveByMonteCarloSearch(game, MCS_SCHEDULE2);
        break;
      default:
        break;
    }
    const putResult = putDisc(game.turn, game.board, move);

    //--- 時間計測 ---//
    //startMeasure(5);
    //--- 時間計測 ---//
    game.bitboard = getBitBoard(game.board);
    //--- 時間計測 ---//
    //stopMeasure(5);
    //--- 時間計測 ---//

    return putResult;
  }
}

// ユーザーが選んだ手を返す
// (引数)
//  game  : ゲーム情報
// (戻り値)
//  humanMove : ユーザーの手(マスを表す番号)
function getMoveByHuman(game) {
  const move = game.humanMove;
  game.humanMove = NO_MOVE;
  return move;
}

// ランダムに選んだ手を返す
// (引数)
//  game  : ゲーム情報
// (戻り値)
//  return : コンピュータの手(マスを表す番号)
function getMoveByRandom(game) {
  const legalMoves = getLegalMoves(game.turn, game.bitboard, game.mask);
  const randomIndex = Math.floor(Math.random() * legalMoves.length);
  return legalMoves[randomIndex];
}

// なるべく少なく石が取れる手を返す
// (引数)
//  game  : ゲーム情報
// (戻り値)
//  return : コンピュータの手(マスを表す番号)
function getMoveByMinimum(game) {
  const turn = game.turn;
  const board = game.board;
  const legalMoves = getLegalMoves(game.turn, game.bitboard, game.mask);
  return legalMoves.reduce((a, b) => getFlippablesAtIndex(turn, board, a).flippables.length < getFlippablesAtIndex(turn, board, b).flippables.length ? a : b);
}

// なるべく多く石が取れる手を返す
// (引数)
//  game  : ゲーム情報
// (戻り値)
//  return : コンピュータの手(マスを表す番号)
function getMoveByMaximum(game) {
  const turn = game.turn;
  const board = game.board;
  const legalMoves = getLegalMoves(game.turn, game.bitboard, game.mask);
  return legalMoves.reduce((a, b) => getFlippablesAtIndex(turn, board, a).flippables.length > getFlippablesAtIndex(turn, board, b).flippables.length ? a : b);
}

// 原始モンテカルロ探索で選んだ手を返す
// (引数)
//  game     : ゲーム情報
//  schedule : 残り空きマス数に応じたプレイアウト数を格納した配列
// (戻り値)
//  return : コンピュータの手(マスを表す番号)
function getMoveByMonteCarloSearch(game, schedule) {
  const num = getPlayoutNum(game.board, schedule);
  const turn = game.turn;
  const randomFlippers = getRandomFlippers(game.flippers);
  const legalMoves = getLegalMoves(game.turn, game.bitboard, game.mask);
  if (legalMoves.length === 0) return NO_MOVE;
  let results = [];
  for (let move of legalMoves) {
    let localBoard = game.board.concat();
    putDisc(turn, localBoard, move);
    let value = 0;
    for (let i=0; i<num; i++) {
      value += getPlayoutValue(game.turnIndex, localBoard, game.order, randomFlippers, game.cutins);
    }
    results.push(value);
  }
  return legalMoves[results.indexOf(Math.max.apply(null, results))];
}

// プレイアウト回数を返す
// (引数)
//  board    : 盤面情報を格納した配列
//  schedule : 残り空きマス数に応じたプレイアウト数を格納した配列
// (戻り値)
//  return   : プレイアウト回数
function getPlayoutNum(board, schedule) {
  const remain = board.filter(e => e === E).length;
  let index = schedule[0].indexOf(Math.min.apply(null, schedule[0].filter(e => e >= remain)));
  index = index === -1 ? 0 : index;
  return schedule[1][index];
}

// ランダムなプレイヤー情報を取得
// (引数)
//  flippers : プレイヤー情報を格納した連想配列
// (戻り値)
//  return   : flippersのプレイヤーをランダムに変えたもの
function getRandomFlippers(flippers) {
  let randoms = {};
  for (let key in flippers) {
    randoms[key] = Object.assign({}, flippers[key]);
    randoms[key].player = new Player(RANDOM);
  }
  return randoms;
}

// プレイアウト結果を取得
// (引数)
//  index    : プレイヤー手番の番号
//  board    : 盤面情報を格納した配列
//  order    : プレイヤーの順番を格納した配列
//  flippers : プレイヤー情報を格納した連想配列
//  cutins   : 割り込みプレイヤー情報を格納した連想配列
// (戻り値)
//  return   : プレイアウト結果(勝ち=1、それ以外=0)
function getPlayoutValue(index, board, order, flippers, cutins) {
  const playout = new Game(board, order, flippers, cutins);
  playout.turnIndex = index;
  playout.setNextPlayer();
  while (playout.play() === GAME_PLAY);
  playout.updateScore();
  return playout.getWinner() === order[index] ? 1 : 0;
}
