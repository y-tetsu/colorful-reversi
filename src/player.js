// プレイヤー
const HUMAN = 'human';
const AI_LEVEL_0 = 'random';
const AI_LEVEL_1 = 'montecarlo1';
const WAIT_HUMAN = 'wait_human';
const NO_MOVE = -1;
const MONTECARLO_SCHEDULE1 = [
  [40, 34, 28, 22,  16,  13,  10,   6],  // 空きマス残り
  [ 2, 10, 50, 80, 100, 150, 300, 500],  // プレイアウト回数
];

let humanClicked = false;
let humanMove = -1;

// 1手打つ
// (引数)
//  turn   : プレイヤーの手番(色)
//  board  : 盤面情報を格納した配列
//  player : プレイヤー情報(ユーザ/AI)
// (戻り値)
//  return : true(完了)、false(ユーザー入力待ち)
function actMove(turn, board, player) {
  const move = getMove(turn, board, player);  // プレイヤーの手を取得
  if (move === WAIT_HUMAN) return false;
  putDisc(turn, board, move);  // ディスクを置く
  return true;
}

// 打つ手の取得
// (引数)
//  turn   : プレイヤーの手番(色)
//  board  : 盤面情報を格納した配列
//  player : プレイヤー情報(ユーザ/AI)
// (戻り値)
//  return : true(完了)、false(ユーザー入力待ち)
function getMove(turn, board, player) {
  if (player === HUMAN) return getMoveByHuman();
  return getMoveByAi(turn, board, player);
}

// ユーザーが選んだ手を返す
// (戻り値)
//  humanMove : ユーザーの手(マスを表す番号)
function getMoveByHuman() {
  if (humanClicked !== true) return WAIT_HUMAN;
  humanClicked = false;
  return humanMove;
}

// コンピュータが選んだ手を返す
// (引数)
//  turn   : プレイヤーの手番(色)
//  board  : 盤面情報を格納した配列
//  aiType : AIの種類
// (戻り値)
//  move   : コンピュータの手(マスを表す番号)
function getMoveByAi(turn, board, aiType) {
  let move = NO_MOVE;
  switch (aiType) {
    case 'random':  // ランダムに手を選ぶ
      move = getMoveByRandom(turn, board);
      break;
    case "montecarlo1":  // 原始モンテカルロ探索で手を選ぶ
      move = getMoveByMonteCarlo(turn, board, MONTECARLO_SCHEDULE1);
      break;
    default:
      break;
  }
  return move;
}

// ランダムに選んだ手を返す
// (引数)
//  turn   : プレイヤーの手番(色)
//  board  : 盤面情報を格納した配列
// (戻り値)
//  return : コンピュータの手(マスを表す番号)
function getMoveByRandom(turn, board) {
  const legalMoves = getLegalMoves(turn, board);
  const randomIndex = Math.floor(Math.random() * legalMoves.length);
  return legalMoves[randomIndex];
}

// 原始モンテカルロ探索で選んだ手を返す
// (引数)
//  turn     : プレイヤーの手番(色)
//  board    : 盤面情報を格納した配列
//  schedule : 残り空きマス数に応じたプレイアウト数を格納した配列
// (戻り値)
//  return   : コンピュータの手(マスを表す番号)
function getMoveByMonteCarlo(turn, board, schedule) {
  const remain = board.filter(e => e === E).length;
  let index = schedule[0].indexOf(Math.min.apply(null, schedule[0].filter(e => e >= remain)));
  index = index === -1 ? 0 : index;
  const playout = schedule[1][index];
  const legalMoves = getLegalMoves(turn, board);
  let results = [];
  for (let i=0; i<legalMoves.length; i++) {
    let boardByMove = board.concat();
    let total = 0;
    putDisc(turn, boardByMove, legalMoves[i]);
    let localTurn = turn;
    let localTurnIndex = turnIndex;
    for (let i=0; i<playout; i++) {
      let gameEnd = false;
      let pass = 0;
      let localBoard = boardByMove.concat();
      while(!gameEnd) {
        [localTurn, localTurnIndex] = getNextTurn(localTurnIndex);
        const legalMoves = getLegalMoves(localTurn, localBoard);
        if (legalMoves.length > 0) {
          pass = 0;
          const localMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
          putDisc(localTurn, localBoard, localMove);
        }
        else {
          pass++;
          if (pass === TURN_ORDER.length) {
            gameEnd = true;
            const black = localBoard.filter(e => e === B).length;
            const white = localBoard.filter(e => e === W).length;
            const ash = localBoard.filter(e => e === A).length;
            const winner = getWinner([black, white, ash]);
            if (winner === turn) {
              total += 1;
            }
          }
        }
      }
    }
    results.push(total);
  }
  return legalMoves[results.indexOf(Math.max.apply(null, results))];
}
