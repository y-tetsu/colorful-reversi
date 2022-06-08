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
function testPlay(boards, orders, moves, expecteds) {
  let i = 0;
  for (let order of orders) {
    const game = new Game(boards[i], order, FLIPPERS);
    game.humanMove = moves[i];
    assertEqual(game.play(),       expecteds[i].result,       'play ' + (i + 1) + '-1');
    game.updateScore();
    const scores = game.participants.map(e => game.flippers[e].score);
    assertEqual(scores,            expecteds[i].scores,       'play ' + (i + 1) + '-2');
    assertEqual(game.pass,         expecteds[i].pass,         'play ' + (i + 1) + '-3');
    assertEqual(game.updatedDiscs, expecteds[i].updatedDiscs, 'play ' + (i + 1) + '-4');
    assertEqual(game.turn,         expecteds[i].turn,         'play ' + (i + 1) + '-5');
    i++;
  }
}

// setNextPlayer
function testSetNextPlayer(orders, indexs, expecteds) {
  let i = 0;
  for (let order of orders) {
    const game = new Game(TEST_BOARD1, order, FLIPPERS);
    game.turnIndex = indexs[i];
    game.setNextPlayer();
    assertEqual(game.turn,        expecteds[i].next,   'setNextPlayer ' + (i + 1) + '-1');
    assertEqual(game.player.name, expecteds[i].player, 'setNextPlayer ' + (i + 1) + '-2');
    i++;
  }
}

// updateScore
function testUpdateScore(boards, orders, moves, scores) {
  let i = 0;
  for (let order of orders) {
    const game = new Game(boards[i], order, FLIPPERS);
    if (move) putDisc(game.turn, game.board, moves[i]);
    game.updateScore();
    let j = 0;
    for (let participant of game.participants) {
      assertEqual(game.flippers[participant].score, scores[i][j], 'getScores ' + (i + 1) + '-' + (j + 1));
      j++;
    }
    i++;
  }
}

// isEnd
function testIsEnd(boards, orders, expecteds) {
  let i = 0;
  for (let order of orders) {
    const game = new Game(boards[i], order, FLIPPERS);
    assertEqual(game.isEnd(), expecteds[i].result, 'isEnd ' + (i + 1) + '-1');
    assertEqual(game.turn,    expecteds[i].next,   'isEnd ' + (i + 1) + '-2');
    assertEqual(game.pass,    expecteds[i].pass,   'isEnd ' + (i + 1) + '-3');
    i++;
  }
}

// isPass
function testIsPass(orders, expecteds) {
  let i = 0;
  for (let order of orders) {
    const game = new Game(PASS_BOARD1, order, FLIPPERS);
    assertEqual(game.isPass(), expecteds[i].result, 'isPass ' + (i + 1) + '-1');
    assertEqual(game.turn,     expecteds[i].next,   'isPass ' + (i + 1) + '-2');
    assertEqual(game.pass,     expecteds[i].pass,   'isPass ' + (i + 1) + '-3');
    i++;
  }
}

// indicatePass
function testIndicatePass(orders, passs, players, expecteds) {
  let i = 0;
  for (let expected of expecteds) {
    const game = new Game(TEST_BOARD1, orders[i], FLIPPERS);
    let j = 0;
    for (let participant of game.participants) {
      game.flippers[participant].player = new Player(players[i][j]);
      j++;
    }
    game.pass = passs[i];
    assertEqual(game.indicatePass(), expected, 'indicatePass ' + (i + 1));
    i++;
  }
}

// getPassMessage
function testGetPassMessage(orders, indexs, passs, messages) {
  let i = 0;
  for (let order of orders) {
    const game = new Game(TEST_BOARD1, order, FLIPPERS);
    game.turnIndex = indexs[i];
    game.pass = passs[i];
    assertEqual(game.getPassMessage(), messages[i], 'getPassMessage ' + (i + 1));
    i++;
  }
}

// getWinnerMessage
function testGetWinnerMessage(boards, orders, moves, winners) {
  let i = 0;
  for (let order of orders) {
    const game = new Game(boards[i], order, FLIPPERS);
    if (move) putDisc(game.turn, game.board, moves[i]);
    game.updateScore();
    assertEqual(game.getWinnerMessage(), winners[i], 'getWinnerMessage ' + (i + 1));
    i++;
  }
}

// getWinner
function testGetWinner(boards, orders, moves, winners) {
  let i = 0;
  for (let order of orders) {
    const game = new Game(boards[i], order, FLIPPERS);
    if (move) putDisc(game.turn, game.board, moves[i]);
    game.updateScore();
    assertEqual(game.getWinner(), winners[i], 'getWinner ' + (i + 1));
    i++;
  }
}

// copyFlippers
function testCopyFlippers(orders, flipperss, expecteds) {
  let i = 0;
  for (let order of orders) {
    game = new Game(TEST_BOARD1, order, flipperss[i]);
    let copy = game.copyFlippers(flipperss[i]);
    for (let color of order) {
      copy[color].player.name = 'unknown';
      while (copy[color].opponents.length) copy[color].opponents.pop();
      copy[color].score = 60;
    }
    assertEqual(copy,         expecteds[i].copy, 'copyFlippers ' + (i + 1) + '-1');
    assertEqual(flipperss[i], expecteds[i].org,  'copyFlippers ' + (i + 1) + '-2');
    i++;
  }
}

boards    = [END_BOARD1, TEST_BOARD1, TEST_BOARD1, END_BOARD1];
orders    = [[B, W], [B, W], [B, W], [W, A, B]];
moves     = [NO_MOVE, NO_MOVE, 34, NO_MOVE]
expecteds = [
  {
    'result'      : GAME_END,
    'scores'      : [32, 32],
    'pass'        : 2,
    'updatedDiscs': [],
    'turn'        : GAME_TURN_END,
  },
  {
    'result'      : GAME_STOP,
    'scores'      : [2, 2],
    'pass'        : 0,
    'updatedDiscs': [],
    'turn'        : B,
  },
  {
    'result'      : GAME_PLAY,
    'scores'      : [4, 1],
    'pass'        : 0,
    'updatedDiscs': [44, 34],
    'turn'        : W,
  },
  {
    'result'      : GAME_END,
    'scores'      : [32, 0, 32],
    'pass'        : 3,
    'updatedDiscs': [],
    'turn'        : GAME_TURN_END,
  },
];
testPlay(boards, orders, moves, expecteds);

orders    = [[B, W], [W, B], [B, W, A], [B, W, A], [B, W, A]];
indexs    = [0, 0, 0, 1, 2];
expecteds = [
  {
    'next'  : W,
    'player': MCS,
  },
  {
    'next'  : B,
    'player': HUMAN,
  },
  {
    'next'  : W,
    'player': MCS,
  },
  {
    'next'  : A,
    'player': RANDOM,
  },
  {
    'next'  : B,
    'player': HUMAN,
  },
];
testSetNextPlayer(orders, indexs, expecteds);

boards = [TEST_BOARD1, TEST_BOARD1, TEST_BOARD1, TEST_BOARD3];
orders = [[B, W], [B, W], [W, B], [B, W, A]];
moves  = ['', 34, 35, ''];
scores = [[2, 2], [4, 1], [4, 1], [2, 2, 4]];
testUpdateScore(boards, orders, moves, scores);

boards    = [PASS_BOARD1, END_BOARD1, PASS_BOARD1, END_BOARD1];
orders    = [[W, B], [B, W], [A, W, B], [A, B, W]];
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
  {
    'result': false,
    'next'  : B,
    'pass'  : 2,
  },
  {
    'result': true,
    'next'  : GAME_TURN_END,
    'pass'  : 3,
  },
];
testIsEnd(boards, orders, expecteds);

turns     = [[B, W], [W, B], [A, W, B]];
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
  {
    'result': true,
    'next'  : W,
    'pass'  : 1,
  },
];
testIsPass(turns, expecteds);

orders    = [[B, W], [B, W], [B, W], [B, W], [B, W, A], [B, W, A]];
passs     = [0, 1, 1, 1, 1, 1];
players   = [[HUMAN, HUMAN], [HUMAN, HUMAN], [RANDOM, RANDOM], [HUMAN, RANDOM], [RANDOM, RANDOM, RANDOM], [RANDOM, RANDOM, HUMAN]];
expecteds = [false, true, false, true, false, true];
testIndicatePass(orders, passs, players, expecteds);

orders    = [[B, W], [W, B], [B, W], [B, W, A], [B, W, A], [B, W, A], [B, W, A], [B, W, A], [B, W, A]];
indexs    = [0, 0, 1, 0, 1, 2, 0, 1, 2];
passs     = [1, 1, 1, 1, 1, 1, 2, 2, 2];
expecteds = ['White Pass', 'Black Pass', 'Black Pass', 'Ash Pass', 'Black Pass', 'White Pass', 'White and Ash Pass', 'Ash and Black Pass', 'Black and White Pass'];
testGetPassMessage(orders, indexs, passs, expecteds);

boards  = [TEST_BOARD1, TEST_BOARD1, TEST_BOARD1, TEST_BOARD3];
orders  = [[B, W], [B, W], [W, B], [B, W, A]];
moves   = ['', 34, 35, ''];

expecteds = [DRAW, 'Black Win!', 'White Win!', 'Ash Win!'];
testGetWinnerMessage(boards, orders, moves, expecteds);

expecteds = [DRAW, B, W, A];
testGetWinner(boards, orders, moves, expecteds);

orders    = [[B, W, A, C, Y]];
flipperss = [FLIPPERS];
expecteds = [
  {
    'copy': {
      [B]: {
        'player'   : new Player('unknown'),
        'opponents': [],
        'score'    : 60,
      },
      [W]: {
        'player'   : new Player('unknown'),
        'opponents': [],
        'score'    : 60,
      },
      [A]: {
        'player'   : new Player('unknown'),
        'opponents': [],
        'score'    : 60,
      },
      [C]: {
        'player'   : new Player('unknown'),
        'opponents': [],
        'score'    : 60,
      },
      [Y]: {
        'player'   : new Player('unknown'),
        'opponents': [],
        'score'    : 60,
      },
    },
    'org': {
      [B]: {
        'player'   : new Player(HUMAN),
        'opponents': [W, A, C, Y],
        'score'    : 0,
      },
      [W]: {
        'player'   : new Player(MCS),
        'opponents': [B, A, C, Y],
        'score'    : 0,
      },
      [A]: {
        'player'   : new Player(RANDOM),
        'opponents': [B, W, C, Y],
        'score'    : 0,
      },
      [C]: {
        'player'   : new Player(RANDOM),
        'opponents': [B, W, A, Y],
        'score'    : 0,
      },
      [Y]: {
        'player'   : new Player(RANDOM),
        'opponents': [B, W, A, C],
        'score'    : 0,
      },
    },
  },
];
testCopyFlippers(orders, flipperss, expecteds);
