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

// constructor
function testConstructor(orders, cutins, expecteds) {
  let i = 0;
  for (let order of orders) {
    const game = new Game(TEST_BOARD1, order, FLIPPERS, cutins[i][0]);
    assertEqual(game.order,      expecteds[i].order,      'constructor ' + (i + 1) + '-1');
    assertEqual(game.cutInIndex, expecteds[i].cutInIndex, 'constructor ' + (i + 1) + '-2');
    assertEqual(game.cutins,     expecteds[i].cutins,     'constructor ' + (i + 1) + '-3');
    game.cutins = cutins[i][1]
    assertNotEqual(game.cutins,  cutins[i][0],            'constructor ' + (i + 1) + '-4');
    i++;
  }
}

// play
function testPlay(coutns, boards, orders, moves, cutins, expecteds) {
  let i = 0;
  for (let order of orders) {
    const game = new Game(boards[i], order, FLIPPERS, cutins[i]);
    game.moveCount = counts[i];
    game.humanMove = moves[i];
    assertEqual(game.play(),       expecteds[i].result,       'play ' + (i + 1) + '-1');
    game.updateScore();
    const scores = game.participants.map(e => game.flippers[e].score);
    assertEqual(scores,            expecteds[i].scores,       'play ' + (i + 1) + '-2');
    assertEqual(game.pass,         expecteds[i].pass,         'play ' + (i + 1) + '-3');
    assertEqual(game.updatedDiscs, expecteds[i].updatedDiscs, 'play ' + (i + 1) + '-4');
    assertEqual(game.turn,         expecteds[i].turn,         'play ' + (i + 1) + '-5');
    assertEqual(game.moveCount,    expecteds[i].moveCount,    'play ' + (i + 1) + '-6');
    i++;
  }
}

// setNextPlayer
function testSetNextPlayer(counts, orders, indexs, cindexs, cutins, expecteds) {
  let i = 0;
  for (let order of orders) {
    const game = new Game(TEST_BOARD1, order, FLIPPERS, cutins[i]);
    game.moveCount = counts[i];
    game.turnIndex = indexs[i];
    game.cutInIndex = cindexs[i];
    game.setNextPlayer();
    assertEqual(game.turn,        expecteds[i].next,      'setNextPlayer ' + (i + 1) + '-1');
    assertEqual(game.player.name, expecteds[i].player,    'setNextPlayer ' + (i + 1) + '-2');
    assertEqual(game.turnIndex,   expecteds[i].turnIndex, 'setNextPlayer ' + (i + 1) + '-3');
    i++;
  }
}

// deleteCutInPlayer
function testDeleteCutInPlayer(orders, indexs, cindexs, cutins, expecteds) {
  let i = 0;
  for (let order of orders) {
    const game = new Game(TEST_BOARD1, order, FLIPPERS, cutins[i]);
    game.turnIndex = indexs[i];
    game.cutInIndex = cindexs[i];
    game.deleteCutInPlayer();
    assertEqual(game.order,      expecteds[i].order,      'deleteCutInPlayer ' + (i + 1) + '-1');
    assertEqual(game.turnIndex,  expecteds[i].turnIndex,  'deleteCutInPlayer ' + (i + 1) + '-2');
    assertEqual(game.cutInIndex, expecteds[i].cutInIndex, 'deleteCutInPlayer ' + (i + 1) + '-3');
    i++;
  }
}

// addCutInPlayer
function testAddCutInPlayer(counts, orders, indexs, cutins, expecteds) {
  let i = 0;
  for (let order of orders) {
    const game = new Game(TEST_BOARD1, order, FLIPPERS, cutins[i]);
    game.moveCount = counts[i];
    game.turnIndex = indexs[i];
    game.addCutInPlayer();
    assertEqual(game.order,      expecteds[i].order,      'addCutInPlayer ' + (i + 1) + '-1');
    assertEqual(game.cutInIndex, expecteds[i].cutInIndex, 'addCutInPlayer ' + (i + 1) + '-2');
    i++;
  }
}

// updateScore
function testUpdateScore(boards, orders, moves, scores) {
  let i = 0;
  for (let order of orders) {
    const game = new Game(boards[i], order, FLIPPERS, CUTINS);
    if (move) {
      putDisc(game.turn, game.board, moves[i]);
      game.bitboard = getBitBoard(game.board);
    }
    game.updateScore();
    let j = 0;
    for (let participant of game.participants) {
      assertEqual(game.flippers[participant].score, scores[i][j], 'updateScores ' + (i + 1) + '-' + (j + 1));
      j++;
    }
    i++;
  }
}

// isEnd
function testIsEnd(boards, orders, expecteds) {
  let i = 0;
  for (let order of orders) {
    const game = new Game(boards[i], order, FLIPPERS, CUTINS);
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
    const game = new Game(PASS_BOARD1, order, FLIPPERS, CUTINS);
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
    const game = new Game(TEST_BOARD1, orders[i], FLIPPERS, CUTINS);
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
    const game = new Game(TEST_BOARD1, order, FLIPPERS, CUTINS);
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
    const game = new Game(boards[i], order, FLIPPERS, CUTINS);
    if (move) {
      putDisc(game.turn, game.board, moves[i]);
      game.bitboard = getBitBoard(game.board);
    }
    game.updateScore();
    assertEqual(game.getWinnerMessage(), winners[i], 'getWinnerMessage ' + (i + 1));
    i++;
  }
}

// getWinner
function testGetWinner(boards, orders, moves, winners) {
  let i = 0;
  for (let order of orders) {
    const game = new Game(boards[i], order, FLIPPERS, CUTINS);
    if (move) {
      putDisc(game.turn, game.board, moves[i]);
      game.bitboard = getBitBoard(game.board);
    }
    game.updateScore();
    assertEqual(game.getWinner(), winners[i], 'getWinner ' + (i + 1));
    i++;
  }
}

// copyFlippers
function testCopyFlippers(orders, flipperss, expecteds) {
  let i = 0;
  for (let order of orders) {
    game = new Game(TEST_BOARD1, order, flipperss[i], CUTINS);
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

orders  = [[B, W], [B, W]];
cutins  = [
  [{10: C}, {10: Y}],
  [{1: C}, {1: Y}]
];
expecteds = [
  {
    'order'     : [B, W],
    'cutInIndex': NO_CUTIN,
    'cutins'    : {10: C},
  },
  {
    'order'     : [C, B, W],
    'cutInIndex': 0,
    'cutins'    : {1: C},
  },
];
testConstructor(orders, cutins, expecteds);

counts    = [1, 1, 1, 1, 1];
boards    = [END_BOARD1, TEST_BOARD1, TEST_BOARD1, END_BOARD1, END_BOARD1];
orders    = [[B, W], [B, W], [B, W], [W, A, B], [W, A, B]];
moves     = [NO_MOVE, NO_MOVE, 34, NO_MOVE, NO_MOVE]
cutins    = [{10: C}, {10: C}, {10: C}, {10: C}, {1: C}];
expecteds = [
  {
    'result'      : GAME_END,
    'scores'      : [32, 32],
    'pass'        : 2,
    'updatedDiscs': {'put': NO_MOVE, 'flipped': [], 'flippers': [], 'erasable': false},
    'turn'        : GAME_TURN_END,
    'moveCount'   : 1,
  },
  {
    'result'      : GAME_STOP,
    'scores'      : [2, 2],
    'pass'        : 0,
    'updatedDiscs': {'put': NO_MOVE, 'flipped': [], 'flippers': [], 'erasable': false},
    'turn'        : B,
    'moveCount'   : 1,
  },
  {
    'result'      : GAME_PLAY,
    'scores'      : [4, 1],
    'pass'        : 0,
    'updatedDiscs': {'put': 34, 'flipped': [44], 'flippers': [54], 'erasable': false},
    'turn'        : W,
    'moveCount'   : 2,
  },
  {
    'result'      : GAME_END,
    'scores'      : [32, 0, 32],
    'pass'        : 3,
    'updatedDiscs': {'put': NO_MOVE, 'flipped': [], 'flippers': [], 'erasable': false},
    'turn'        : GAME_TURN_END,
    'moveCount'   : 1,
  },
  {
    'result'      : GAME_END,
    'scores'      : [32, 0, 32],
    'pass'        : 4,
    'updatedDiscs': {'put': NO_MOVE, 'flipped': [], 'flippers': [], 'erasable': false},
    'turn'        : GAME_TURN_END,
    'moveCount'   : 1,
  },
];
testPlay(counts, boards, orders, moves, cutins, expecteds);

counts    = [1, 1, 1, 1, 1, 11, 11];
orders    = [[B, W], [W, B], [B, W, A], [B, W, A], [B, W, A], [C, B, W, A], [B, C, W, A]];
indexs    = [0, 0, 0, 1, 2, 0, 1];
cindexs   = [NO_CUTIN, NO_CUTIN, NO_CUTIN, NO_CUTIN, NO_CUTIN, 0, 1];
cutins    = [{10: C}, {10: C}, {10: C}, {10: C}, {10: C}, {10: C, 11: Y}, {10: C, 11: Y}];
expecteds = [
  {
    'next'     : W,
    'player'   : MCS2,
    'turnIndex': 1,
  },
  {
    'next'     : B,
    'player'   : HUMAN,
    'turnIndex': 1,
  },
  {
    'next'     : W,
    'player'   : MCS2,
    'turnIndex': 1,
  },
  {
    'next'     : A,
    'player'   : MCS,
    'turnIndex': 2,
  },
  {
    'next'     : B,
    'player'   : HUMAN,
    'turnIndex': 0,
  },
  {
    'next'     : Y,
    'player'   : MAXIMUM,
    'turnIndex': 0,
  },
  {
    'next'     : Y,
    'player'   : MAXIMUM,
    'turnIndex': 1,
  },
];
testSetNextPlayer(counts, orders, indexs, cindexs, cutins, expecteds);

orders  = [[B, W], [B, C, W], [C, B, W], [C, B, W]];
indexs  = [1, 0, 2, 0];
cindexs = [NO_CUTIN, 1, 0, 0];
cutins  = [{10: C}, {10: C}, {10: C}, {10: C}];
expecteds = [
  {
    'order'     : [B, W],
    'turnIndex' : 1,
    'cutInIndex': NO_CUTIN,
  },
  {
    'order'     : [B, W],
    'turnIndex' : 0,
    'cutInIndex': NO_CUTIN,
  },
  {
    'order'     : [B, W],
    'turnIndex' : 1,
    'cutInIndex': NO_CUTIN,
  },
  {
    'order'     : [B, W],
    'turnIndex' : -1,
    'cutInIndex': NO_CUTIN,
  },
];
testDeleteCutInPlayer(orders, indexs, cindexs, cutins, expecteds);

counts  = [1, 10, 10];
orders  = [[B, W], [B, W], [B, W]];
indexs  = [0, 0, 1];
cutins  = [{10: C}, {10: C}, {10: C}];
expecteds = [
  {
    'order'     : [B, W],
    'cutInIndex': NO_CUTIN,
  },
  {
    'order'     : [C, B, W],
    'cutInIndex': 0,
  },
  {
    'order'     : [B, C, W],
    'cutInIndex': 1,
  },
];
testAddCutInPlayer(counts, orders, indexs, cutins, expecteds);

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
        'opponents': [W, A, C, Y, G, R],
        'score'    : 0,
      },
      [W]: {
        'player'   : new Player(MCS2),
        'opponents': [B, A, C, Y, G, R],
        'score'    : 0,
      },
      [A]: {
        'player'   : new Player(MCS),
        'opponents': [B, W, C, Y, G, R],
        'score'    : 0,
      },
      [C]: {
        'player'   : new Player(MINIMUM),
        'opponents': [B, W, A, Y, G, R],
        'score'    : 0,
      },
      [Y]: {
        'player'   : new Player(MAXIMUM),
        'opponents': [B, W, A, C, G, R],
        'score'    : 0,
      },
    },
  },
];
testCopyFlippers(orders, flipperss, expecteds);
