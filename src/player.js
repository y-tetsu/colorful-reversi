// プレイヤー
const HUMAN = 0;
const AI = 1;
const AI_TYPE = "random";
const WAIT_HUMAN = "wait_human";
const NO_MOVE = -1;

let humanClicked = false;
let humanMove = -1;

function getMove(turn, board, player) {
  if (player === HUMAN) return getMoveByHuman();
  return getMoveByAi(turn, board, AI_TYPE);
}

function getMoveByHuman() {
  if (humanClicked !== true) return WAIT_HUMAN;
  humanClicked = false;
  return humanMove;
}

function getMoveByAi(turn, board, aiType) {
  let move = NO_MOVE;
  switch (aiType) {
    case "random":  // ランダムに手を選ぶ
      move = getMoveByRandom(turn, board);
      break;
    default:
      break;
  }
  return move;
}

function getMoveByRandom(turn, board) {
  const legalMoves = getLegalMoves(turn, board);
  const randomIndex = Math.floor(Math.random() * (legalMoves.length));
  return legalMoves[randomIndex];
}
