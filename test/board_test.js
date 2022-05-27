console.log('[board_test.js]');

// - getLegalMoves
function testGetLegalMoves(turns, board, expecteds, no) {
  for (let i in turns) {
    const actual = getLegalMoves(turns[i], board);
    const expected = expecteds[i];
    assertEqual(actual, expected, 'getLegalMoves ' + getGameTurnText(turns[i]) + ' ' + no);
  }
}

// - getFlippablesAtIndex
function testGetFlippablesAtIndex(turns, board, expecteds, no) {
  for (let i in turns) {
    let j = 0;
    const turn = turns[i];
    for (let move of getLegalMoves(turn, board)) {
      const actual = getFlippablesAtIndex(turn, board, move);
      const expected = expecteds[i][j];
      j++;
      assertEqual(actual, expected, 'getFlippablesAtIndex ' + getGameTurnText(turn) + ' ' + no + ' ' + move);
    }
  }
}

// - putDisc
function testPutDisc(turns, board, expecteds, no) {
  for (let i in turns) {
    let j = 0;
    const turn = turns[i];
    for (let move of getLegalMoves(turn, board)) {
      let localBoard = board.concat();
      actual   = putDisc(turn, localBoard, move);
      expected = expecteds[i][j];
      j++;
      assertEqual(actual, expected, 'putDisc ' + getGameTurnText(turn) + ' ' + no + ' ' + move);
    }
  }
}

// - boardMethods
function testBoardMethods(turns, board, expected, no) {
  testGetLegalMoves(turns, board, expected['getLegalMoves'], no);
  testGetFlippablesAtIndex(turns, board, expected['getFlippablesAtIndex'], no);
  testPutDisc(turns, board, expected['putDisc'], no);
}

// (1:初期配置)
const TEST_BOARD1 = [
  X, X, X, X, X, X, X, X, X, X,
  X, E, E, E, E, E, E, E, E, X,
  X, E, E, E, E, E, E, E, E, X,
  X, E, E, E, E, E, E, E, E, X,
  X, E, E, E, W, B, E, E, E, X,
  X, E, E, E, B, W, E, E, E, X,
  X, E, E, E, E, E, E, E, E, X,
  X, E, E, E, E, E, E, E, E, X,
  X, E, E, E, E, E, E, E, E, X,
  X, X, X, X, X, X, X, X, X, X,
];
let board1Expected = {
  'getLegalMoves': [
    [34, 43, 56, 65],
    [35, 46, 53, 64],
  ],
  'getFlippablesAtIndex': [
    [[44], [44], [55], [55]],
    [[45], [45], [54], [54]],
  ],
  'putDisc': [
    [[44, 34], [44, 43], [55, 56], [55, 65]],
    [[45, 35], [45, 46], [54, 53], [54, 64]],
  ],
}

// (2:8方向)
const TEST_BOARD2_1 = [
  X, X, X, X, X, X, X, X, X, X,
  X, B, B, B, B, B, B, B, B, X,
  X, B, W, W, W, W, W, W, B, X,
  X, B, W, W, W, W, W, W, B, X,
  X, B, W, W, E, W, W, W, B, X,
  X, B, W, W, W, W, W, W, B, X,
  X, B, W, W, W, W, W, W, B, X,
  X, B, W, W, W, W, W, W, B, X,
  X, B, B, B, B, B, B, B, B, X,
  X, X, X, X, X, X, X, X, X, X,
];
let board2_1Expected = {
  'getLegalMoves': [
    [44],
  ],
  'getFlippablesAtIndex': [
    [[34, 24, 35, 26, 45, 46, 47, 55, 66, 77, 54, 64, 74, 53, 62, 43, 42, 33, 22]],
  ],
  'putDisc': [
    [[34, 24, 35, 26, 45, 46, 47, 55, 66, 77, 54, 64, 74, 53, 62, 43, 42, 33, 22, 44]],
  ],
}

const TEST_BOARD2_2 = [
  X, X, X, X, X, X, X, X, X, X,
  X, B, B, B, B, B, B, B, B, X,
  X, B, W, W, W, W, W, W, B, X,
  X, B, W, W, W, W, W, W, B, X,
  X, B, W, W, W, E, W, W, B, X,
  X, B, W, W, W, W, W, W, B, X,
  X, B, W, W, W, W, W, W, B, X,
  X, B, W, W, W, W, W, W, B, X,
  X, B, B, B, B, B, B, B, B, X,
  X, X, X, X, X, X, X, X, X, X,
];
let board2_2Expected = {
  'getLegalMoves': [
    [45],
  ],
  'getFlippablesAtIndex': [
    [[35, 25, 36, 27, 46, 47, 56, 67, 55, 65, 75, 54, 63, 72, 44, 43, 42, 34, 23]],
  ],
  'putDisc': [
    [[35, 25, 36, 27, 46, 47, 56, 67, 55, 65, 75, 54, 63, 72, 44, 43, 42, 34, 23, 45]],
  ],
}

const TEST_BOARD2_3 = [
  X, X, X, X, X, X, X, X, X, X,
  X, W, W, W, W, W, W, W, W, X,
  X, W, B, B, B, B, B, B, W, X,
  X, W, B, B, B, B, B, B, W, X,
  X, W, B, B, B, B, B, B, W, X,
  X, W, B, B, E, B, B, B, W, X,
  X, W, B, B, B, B, B, B, W, X,
  X, W, B, B, B, B, B, B, W, X,
  X, W, W, W, W, W, W, W, W, X,
  X, X, X, X, X, X, X, X, X, X,
];
let board2_3Expected = {
  'getLegalMoves': [
    [54],
  ],
  'getFlippablesAtIndex': [
    [[44, 34, 24, 45, 36, 27, 55, 56, 57, 65, 76, 64, 74, 63, 72, 53, 52, 43, 32]],
  ],
  'putDisc': [
    [[44, 34, 24, 45, 36, 27, 55, 56, 57, 65, 76, 64, 74, 63, 72, 53, 52, 43, 32, 54]],
  ],
}

const TEST_BOARD2_4 = [
  X, X, X, X, X, X, X, X, X, X,
  X, W, W, W, W, W, W, W, W, X,
  X, W, B, B, B, B, B, B, W, X,
  X, W, B, B, B, B, B, B, W, X,
  X, W, B, B, B, B, B, B, W, X,
  X, W, B, B, B, E, B, B, W, X,
  X, W, B, B, B, B, B, B, W, X,
  X, W, B, B, B, B, B, B, W, X,
  X, W, W, W, W, W, W, W, W, X,
  X, X, X, X, X, X, X, X, X, X,
];
let board2_4Expected = {
  'getLegalMoves': [
    [55],
  ],
  'getFlippablesAtIndex': [
    [[45, 35, 25, 46, 37, 56, 57, 66, 77, 65, 75, 64, 73, 54, 53, 52, 44, 33, 22]],
  ],
  'putDisc': [
    [[45, 35, 25, 46, 37, 56, 57, 66, 77, 65, 75, 64, 73, 54, 53, 52, 44, 33, 22, 55]],
  ],
}

testBoardMethods([B, W], TEST_BOARD1,   board1Expected,   '1'  );
testBoardMethods([B],    TEST_BOARD2_1, board2_1Expected, '2-1');
testBoardMethods([B],    TEST_BOARD2_2, board2_2Expected, '2-2');
testBoardMethods([W],    TEST_BOARD2_3, board2_3Expected, '2-3');
testBoardMethods([W],    TEST_BOARD2_4, board2_4Expected, '2-4');
