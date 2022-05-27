// プレイヤー
const HUMAN = 'human';
const AI_LEVEL_0 = 'random';
const WAIT_HUMAN = 'wait_human';
const NO_MOVE = -1;

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
