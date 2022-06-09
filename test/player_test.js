console.log('[player_test.js]');

// Player
let game = new Game(TEST_BOARD1, ORDER, FLIPPERS, CUTINS);
let player = new Player('unknown');
assertEqual(player.actMove(game), [], 'Player 1');

game = new Game(TEST_BOARD1, ORDER, FLIPPERS, CUTINS);
player = new Player(HUMAN);
game.humanMove = 34;
assertEqual(player.actMove(game), [44, 34], 'Player 2');

game = new Game(TEST_BOARD1, ORDER, FLIPPERS, CUTINS);
player = new Player(RANDOM);
assertIncludes(player.actMove(game), [[44, 34], [44, 43], [55, 56], [55, 65]], 'Player 3');

game = new Game(TEST_BOARD1, ORDER, FLIPPERS, CUTINS);
player = new Player(MCS);
assertIncludes(player.actMove(game), [[44, 34], [44, 43], [55, 56], [55, 65]], 'Player 4');

game = new Game(TEST_BOARD1, ORDER, FLIPPERS, CUTINS);
player = new Player(MINIMUM);
assertIncludes(player.actMove(game), [[44, 34], [44, 43], [55, 56], [55, 65]], 'Player 5');

game = new Game(TEST_BOARD1, ORDER, FLIPPERS, CUTINS);
player = new Player(MAXIMUM);
assertIncludes(player.actMove(game), [[44, 34], [44, 43], [55, 56], [55, 65]], 'Player 6');

// getMoveByHuman
game = new Game(TEST_BOARD1, ORDER, FLIPPERS, CUTINS);
let move = getMoveByHuman(game);
assertEqual(move, NO_MOVE, 'getMoveByHuman 1');

game.humanMove = 1;
move = getMoveByHuman(game);
assertEqual(move, 1, 'getMoveByHuman 2');
assertEqual(game.humanMove, NO_MOVE, 'getMoveByHuman 3');

// getMoveByRandom
for (let i=0; i<10; i++) {
  let move = getMoveByRandom(new Game(TEST_BOARD1, ORDER, FLIPPERS, CUTINS));
  assertEqual(getLegalMoves(B, TEST_BOARD1).includes(move), true, 'getMoveByRandom ' + (i + 1));
}

// getMoveByMonteCarloSearch
function testGetMoveByMonteCarloSearch(boards, orders, flipperss, cutins, schedules, expecteds) {
  let i = 0;
  for (board of boards) {
    const game = new Game(board, orders[i], flipperss[i], cutins[i]);
    assertEqual(getMoveByMonteCarloSearch(game, schedules[i]), expecteds[i], 'getMoveByMonteCarloSearch ' + (i + 1));
    i++;
  }
}

const PLAYOUT_BOARD1 = [
  H, H, H, H, H, H, H, H, H, H,
  H, W, W, W, W, W, W, W, W, H,
  H, W, A, A, A, A, A, A, W, H,
  H, W, A, A, A, A, A, A, W, H,
  H, W, A, A, E, A, A, A, W, H,
  H, W, A, A, A, E, A, A, W, H,
  H, W, A, A, A, A, A, A, W, H,
  H, W, A, A, A, A, A, A, W, H,
  H, W, W, W, W, W, W, W, W, H,
  H, H, H, H, H, H, H, H, H, H,
];
const PLAYOUT_BOARD2 = [
  H, H, H, H, H, H, H, H, H, H,
  H, B, E, E, E, E, E, W, B, H,
  H, W, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, B, H,
  H, W, A, E, E, E, E, E, A, H,
  H, H, H, H, H, H, H, H, H, H,
];
const PLAYOUT_BOARD3 = [
  H, H, H, H, H, H, H, H, H, H,
  H, B, E, E, E, E, W, B, A, H,
  H, W, E, E, E, E, E, E, E, H,
  H, W, E, E, E, E, E, E, E, H,
  H, A, E, E, E, E, E, E, E, H,
  H, A, E, E, E, E, E, E, E, H,
  H, A, E, E, E, E, E, E, E, H,
  H, A, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, H,
  H, H, H, H, H, H, H, H, H, H,
];
const PLAYOUT_BOARD4 = [
  H, H, H, H, H, H, H, H, H, H,
  H, B, E, B, E, A, E, A, E, H,
  H, A, E, A, E, B, E, B, E, H,
  H, A, E, A, E, B, E, B, E, H,
  H, A, E, A, E, B, E, B, E, H,
  H, A, E, A, E, B, E, B, E, H,
  H, E, E, E, E, E, E, E, E, H,
  H, B, E, B, E, A, E, A, E, H,
  H, A, E, A, E, B, E, B, E, H,
  H, H, H, H, H, H, H, H, H, H,
];
const TEST_SCHEDULE1 = [
  [60],
  [10],
];
boards = [PLAYOUT_BOARD1, PLAYOUT_BOARD2, PLAYOUT_BOARD3];
orders = [[A, W], [B, W, A], [B, W, A]];
flipperss = [FLIPPERS, FLIPPERS, FLIPPERS];
cutins = [CUTINS, CUTINS, CUTINS];
schedules = [TEST_SCHEDULE1, TEST_SCHEDULE1, TEST_SCHEDULE1];
expecteds = [NO_MOVE, 16, 81];
testGetMoveByMonteCarloSearch(boards, orders, flipperss, cutins, schedules, expecteds);

// getPlayoutNum
function testGetPalyoutNum(boards, schedule, expecteds) {
  let i = 0;
  for (board of boards) {
    assertEqual(getPlayoutNum(board, schedule), expecteds[i], 'getPalyoutNum ' + (i + 1));
    i++;
  }
}

const BOARD_REMAIN_60 = [
  H, H, H, H, H, H, H, H, H, H,
  H, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, H,
  H, E, E, E, B, B, E, E, E, H,
  H, E, E, E, B, B, E, E, E, H,
  H, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, H,
  H, H, H, H, H, H, H, H, H, H,
];
const BOARD_REMAIN_30 = [
  H, H, H, H, H, H, H, H, H, H,
  H, W, W, W, W, W, W, W, W, H,
  H, W, E, E, E, E, E, W, W, H,
  H, W, E, E, E, E, E, W, W, H,
  H, W, E, E, E, E, E, W, W, H,
  H, W, E, E, E, E, E, W, W, H,
  H, W, E, E, E, E, E, W, W, H,
  H, W, E, E, E, E, E, W, W, H,
  H, W, W, W, W, W, W, W, W, H,
  H, H, H, H, H, H, H, H, H, H,
];
const BOARD_REMAIN_0 = [
  H, H, H, H, H, H, H, H, H, H,
  H, W, W, W, W, W, W, W, W, H,
  H, W, A, A, A, A, A, W, W, H,
  H, W, A, A, A, A, A, W, W, H,
  H, W, A, A, A, A, A, W, W, H,
  H, W, A, A, A, A, A, W, W, H,
  H, W, A, A, A, A, A, W, W, H,
  H, W, A, A, A, A, A, W, W, H,
  H, W, W, W, W, W, W, W, W, H,
  H, H, H, H, H, H, H, H, H, H,
];
boards = [BOARD_REMAIN_60, BOARD_REMAIN_30, BOARD_REMAIN_0];
expecteds = [10, 40, 800];
testGetPalyoutNum(boards, MCS_SCHEDULE, expecteds);

// getRandomFlippers
const TEST_FLIPPERS = {
  [B]: {
    'player'   : new Player(HUMAN),
    'opponents': [W, A],
    'score'    : 0,
  },
  [W]: {
    'player'   : new Player(HUMAN),
    'opponents': [B, A],
    'score'    : 0,
  },
  [A]: {
    'player'   : new Player(HUMAN),
    'opponents': [B, W],
    'score'    : 0,
  },
}
const RANDOM_FLIPPERS = {
  [B]: {
    'player'   : new Player(RANDOM),
    'opponents': [W, A],
    'score'    : 0,
  },
  [W]: {
    'player'   : new Player(RANDOM),
    'opponents': [B, A],
    'score'    : 0,
  },
  [A]: {
    'player'   : new Player(RANDOM),
    'opponents': [B, W],
    'score'    : 0,
  },
}
assertEqual(getRandomFlippers(TEST_FLIPPERS), RANDOM_FLIPPERS, 'getRnadomFlippers');

// getPlayoutValue
function testPlayoutValue(indexs, boards, orders, expecteds) {
  let i = 0;
  for (board of boards) {
    assertEqual(getPlayoutValue(indexs[i], board, orders[i], RANDOM_FLIPPERS, CUTINS), expecteds[i], 'getPlayoutValue ' + (i + 1));
    i++;
  }
}

indexs = [0, 1, 0, 1, 2, 1];
boards = [PLAYOUT_BOARD1, PLAYOUT_BOARD1, PLAYOUT_BOARD2, PLAYOUT_BOARD2, PLAYOUT_BOARD2, PLAYOUT_BOARD4];
orders = [[A, W], [A, W], [B, W, A], [B, W, A], [B, W, A], [B, W, A]];
expecteds = [0, 1, 1, 0, 0, 0];
testPlayoutValue(indexs, boards, orders, expecteds);

// getMoveByMinimum
const PLAYER_BOARD1 = [
  H, H, H, H, H, H, H, H, H, H,
  H, B, E, E, W, W, W, W, B, H,
  H, W, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, W, H,
  H, E, E, E, E, E, E, E, W, H,
  H, E, E, E, E, E, E, E, W, H,
  H, B, W, W, E, E, E, E, B, H,
  H, H, H, H, H, H, H, H, H, H,
];
move = getMoveByMinimum(new Game(PLAYER_BOARD1, ORDER, FLIPPERS, CUTINS));
assertEqual(move, 31, 'getMoveByMinimum 1');

// getMoveByMaximum
move = getMoveByMaximum(new Game(PLAYER_BOARD1, ORDER, FLIPPERS, CUTINS));
assertEqual(move, 13, 'getMoveByMaximum 1');
