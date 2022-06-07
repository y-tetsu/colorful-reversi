console.log('[game_test.js]');

const END_BOARD1 = [
  H, H, H, H, H, H, H, H, H, H,
  H, B, B, B, B, B, B, B, B, H,
  H, B, W, W, W, W, W, W, B, H,
  H, B, W, W, W, W, W, W, B, H,
  H, B, W, W, B, B, W, W, B, H,
  H, B, W, W, B, B, W, W, B, H,
  H, B, W, W, W, W, W, W, B, H,
  H, B, W, W, W, W, W, W, B, H,
  H, B, B, B, B, B, B, B, B, H,
  H, H, H, H, H, H, H, H, H, H,
];

const PASS_BOARD1 = [
  H, H, H, H, H, H, H, H, H, H,
  H, B, E, E, E, E, E, W, B, H,
  H, W, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, W, H,
  H, B, W, E, E, E, E, E, B, H,
  H, H, H, H, H, H, H, H, H, H,
];

// play
function testPlay(boards, turns, moves, expecteds) {
  let i = 0;
  for (let turn of turns) {
    const game = new Game(boards[i], turn, new Player(HUMAN), new Player(HUMAN));
    game.humanMove = moves[i];
    assertEqual(game.play(),       expecteds[i].result,       'play ' + (i + 1) + '-1');
    game.updateScore();
    assertEqual(game.blackScore,   expecteds[i].blackScore,   'play ' + (i + 1) + '-2');
    assertEqual(game.whiteScore,   expecteds[i].whiteScore,   'play ' + (i + 1) + '-3');
    assertEqual(game.pass,         expecteds[i].pass,         'play ' + (i + 1) + '-4');
    assertEqual(game.updatedDiscs, expecteds[i].updatedDiscs, 'play ' + (i + 1) + '-5');
    assertEqual(game.turn,         expecteds[i].turn,         'play ' + (i + 1) + '-6');
    i++;
  }
}

// setNextPlayer
function testSetNextPlayer(board, turns, nexts, players) {
  let i = 0;
  for (let turn of turns) {
    const game = new Game(board, turn, new Player(HUMAN), new Player(RANDOM));
    game.setNextPlayer();
    assertEqual(game.turn,        nexts[i],   'setNextPlayer ' + (i + 1) + '-1');
    assertEqual(game.player.name, players[i], 'setNextPlayer ' + (i + 1) + '-2');
    i++;
  }
}

// updateScore
function testUpdateScore(board, turns, moves, scores) {
  let i = 0;
  for (let turn of turns) {
    const game = new Game(board, turn, new Player(HUMAN), new Player(HUMAN));
    if (move) putDisc(turn, game.board, moves[i]);
    game.updateScore();
    assertEqual(game.blackScore, scores[i][0], 'getScores ' + (i + 1) + '-1');
    assertEqual(game.whiteScore, scores[i][1], 'getScores ' + (i + 1) + '-2');
    i++;
  }
}

// isEnd
function testIsEnd(boards, turns, expecteds) {
  let i = 0;
  for (let turn of turns) {
    const game = new Game(boards[i], turn, new Player(HUMAN), new Player(HUMAN));
    assertEqual(game.isEnd(), expecteds[i].result, 'isEnd ' + (i + 1) + '-1');
    assertEqual(game.turn,    expecteds[i].next,   'isEnd ' + (i + 1) + '-2');
    assertEqual(game.pass,    expecteds[i].pass,   'isEnd ' + (i + 1) + '-3');
    i++;
  }
}

// isPass
function testIsPass(turns, expecteds) {
  let i = 0;
  for (let turn of turns) {
    const game = new Game(PASS_BOARD1, turn, new Player(HUMAN), new Player(HUMAN));
    assertEqual(game.isPass(), expecteds[i].result, 'isPass ' + (i + 1) + '-1');
    assertEqual(game.turn,     expecteds[i].next,   'isPass ' + (i + 1) + '-2');
    assertEqual(game.pass,     expecteds[i].pass,   'isPass ' + (i + 1) + '-3');
    i++;
  }
}

// indicatePass
function testIndicatePass(passs, players, expecteds) {
  let i = 0;
  for (let expected of expecteds) {
    const game = new Game(TEST_BOARD1, B, new Player(players[i][0]), new Player(players[i][1]));
    game.pass = passs[i];
    assertEqual(game.indicatePass(), expected, 'indicatePass ' + (i + 1));
    i++;
  }
}

// getPassMessage
function testGetPassMessage(turns, messages) {
  let i = 0;
  for (let turn of turns) {
    const game = new Game(TEST_BOARD1, turn, new Player(HUMAN), new Player(HUMAN));
    assertEqual(game.getPassMessage(), messages[i], 'getPassMessage ' + (i + 1));
    i++;
  }
}

// getWinnerMessage
function testGetWinnerMessage(board, turns, moves, winners) {
  let i = 0;
  for (let turn of turns) {
    const game = new Game(board, turn, new Player(HUMAN), new Player(HUMAN));
    if (move) putDisc(turn, game.board, moves[i]);
    game.updateScore();
    assertEqual(game.getWinnerMessage(), winners[i], 'getWinnerMessage ' + (i + 1));
    i++;
  }
}

// getWinner
function testGetWinner(board, turns, moves, winners) {
  let i = 0;
  for (let turn of turns) {
    const game = new Game(board, turn, new Player(HUMAN), new Player(HUMAN));
    if (move) putDisc(turn, game.board, moves[i]);
    game.updateScore();
    assertEqual(game.getWinner(), winners[i], 'getWinner ' + (i + 1));
    i++;
  }
}

boards    = [END_BOARD1, TEST_BOARD1, TEST_BOARD1];
turns     = [B, B, B];
moves     = [NO_MOVE, NO_MOVE, 34]
expecteds = [
  {
    'result'      : GAME_END,
    'blackScore'  : 32,
    'whiteScore'  : 32,
    'pass'        : 2,
    'updatedDiscs': [],
    'turn'        : GAME_TURN_END,
  },
  {
    'result'      : GAME_STOP,
    'blackScore'  : 2,
    'whiteScore'  : 2,
    'pass'        : 0,
    'updatedDiscs': [],
    'turn'        : B,
  },
  {
    'result'      : GAME_PLAY,
    'blackScore'  : 4,
    'whiteScore'  : 1,
    'pass'        : 0,
    'updatedDiscs': [44, 34],
    'turn'        : W,
  },
];
testPlay(boards, turns, moves, expecteds);

turns     = [B, W];
nexts     = [W, B];
players   = [RANDOM, HUMAN];
testSetNextPlayer(TEST_BOARD1, turns, nexts, players);

turns   = [B, B, W];
moves   = ['', 34, 35];
scores = [[2, 2], [4, 1], [1, 4]];
testUpdateScore(TEST_BOARD1, turns, moves, scores);

boards    = [PASS_BOARD1, END_BOARD1];
turns     = [W, B];
expecteds = [
  {
    'result': false,
    'next'  : B,
    'pass'  : 1,
  },
  {
    'result': true,
    'next'  : GAME_TURN_END,
    'pass'  : 2,
  },
];
testIsEnd(boards, turns, expecteds);

turns     = [B, W];
expecteds = [
  {
    'result': false,
    'next'  : B,
    'pass'  : 0,
  },
  {
    'result': true,
    'next'  : B,
    'pass'  : 1,
  },
];
testIsPass(turns, expecteds);

passs     = [0, 1, 1, 1];
players   = [[HUMAN, HUMAN], [HUMAN, HUMAN], [RANDOM, RANDOM], [HUMAN, RANDOM]];
expecteds = [false, true, false, true];
testIndicatePass(passs, players, expecteds);

turns    = [B, W];
messages = ['White Pass', 'Black Pass'];
testGetPassMessage(turns, messages);

turns   = [B, B, W];
moves   = ['', 34, 35];
winners = [DRAW, 'Black Win!', 'White Win!'];
testGetWinnerMessage(TEST_BOARD1, turns, moves, winners);

turns   = [B, B, W];
moves   = ['', 34, 35];
winners = [DRAW, B, W];
testGetWinner(TEST_BOARD1, turns, moves, winners);
