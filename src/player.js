// プレイヤー
const HUMAN = 'human';
const AI_LEVEL_0 = 'random';
const AI_LEVEL_1 = 'montecarlo1';
const WAIT_HUMAN = "wait_human";
const NO_MOVE = -1;
const MONTECARLO_SCHEDULE1 = [
  [40, 34, 28, 22,  16,  13,  10,   6],  // 空きマス残り
  [ 2, 10, 50, 80, 100, 150, 300, 500],  // プレイアウト回数
];

let humanClicked = false;
let humanMove = -1;

function getMove(turn, board, player) {
  if (player === HUMAN) return getMoveByHuman();
  return getMoveByAi(turn, board, player);
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
    case "montecarlo1":  // モンテカルロ法で手を選ぶ
      move = getMoveByMonteCarlo(turn, board, MONTECARLO_SCHEDULE1);
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

function getMoveByMonteCarlo(turn, board, schedule) {
  const remain = board.filter(element => element === E).length;
  const index = schedule[0].indexOf(Math.min.apply(null, schedule[0].filter(element => element >= remain)));
  const playout = schedule[1][index];
  const legalMoves = getLegalMoves(turn, board);
  let results = [];
  for (let i=0; i<legalMoves.length; i++) {
    let boardByMove = board.concat();
    let total = 0;
    putDisc(turn, boardByMove, legalMoves[i]);
    let localTurn = turn;
    for (let i=0; i<playout; i++) {
      let gameEnd = false;
      let pass = 0;
      let localBoard = boardByMove.concat();
      while(!gameEnd) {
        localTurn = getNextTurn(localTurn);
        const legalMoves = getLegalMoves(localTurn, localBoard);
        if (legalMoves.length > 0) {
          pass = 0;
          let localMove = getMoveByRandom(localTurn, localBoard);
          putDisc(localTurn, localBoard, localMove);
        }
        else {
          pass++;
          if (pass === PLAYER_NUM) {
            gameEnd = true;
            const black = localBoard.filter(element => element === B).length;
            const white = localBoard.filter(element => element === W).length;
            const ash = localBoard.filter(element => element === A).length;
            const winner = getWinner(black, white, ash);
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
