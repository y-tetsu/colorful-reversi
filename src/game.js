// ゲーム進行
const BLACK_PLAYER = HUMAN;
const WHITE_PLAYER = AI;
const GAME_PLAY = 0;
const GAME_STOP = 1;
const GAME_END = 2;
const WAIT_TIME = 800; // ms
const GAME_TURN_END = "End";

let gameBoard = [];
let gameState = GAME_PLAY;
let gameTurn = B;
let passCount = 0;
let blackScore = 0;
let whiteScore = 0;

function initGame() {
  gameBoard = BOARD.concat();
  gameState = GAME_PLAY;
  gameTurn = B;
  passCount = 0;
  updateScore();
}

function gameLoop() {
  gameState = playGame();
  updateUi();
  switch (gameState) {
    case GAME_PLAY:
      const waitTime = BLACK_PLAYER !== WHITE_PLAYER ? WAIT_TIME : 0;
      setTimeout(() => gameLoop(), waitTime);
      break;
    case GAME_END:
      let result = "Draw";
      if (blackScore > whiteScore) result = "Black Win!";
      if (blackScore < whiteScore) result = "White Win!";
      alert(result);
      break;
    default:
      break;
  }
}

function playGame() {
  if (passCount === 2) return GAME_END;
  if (passCount === 1) indicatePass();
  if (isPassOrEnd()) return GAME_PLAY;
  passCount = 0;
  let player = gameTurn === B ? BLACK_PLAYER : WHITE_PLAYER;
  const move = getMove(gameTurn, gameBoard, player);
  if (move === WAIT_HUMAN) return GAME_STOP;  // ユーザー入力待ち
  putDisc(gameTurn, gameBoard, move);
  updateScore();
  gameTurn = getOpponentColor(gameTurn);
  if (isEnd()) gameTurn = GAME_TURN_END;
  return GAME_PLAY;
}

function indicatePass() {
  if ((BLACK_PLAYER === HUMAN || WHITE_PLAYER === HUMAN)) {
    gameTurn === B ? alert('White Pass') : alert('Black Pass');
  }
}

function isPassOrEnd() {
  if (isPass()) {
    isPass();
    return true;
  }
  return false;
}

function isPass() {
  if (getLegalMoves(gameTurn, gameBoard).length <= 0) {
    gameTurn = getOpponentColor(gameTurn);
    passCount++;
    return true;
  }
  return false;
}

function isEnd() {
  return isPass() && isPass();
}

function getOpponentColor(turn) {
  return turn === B ? W : B;
}

function updateScore() {
  blackScore = gameBoard.filter(element => element === B).length;
  whiteScore = gameBoard.filter(element => element === W).length;
}
