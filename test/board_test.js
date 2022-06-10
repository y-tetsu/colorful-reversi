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

// - getOpponentColors
function testGetOpponentColors(turns, expected) {
  let i = 0;
  for (let turn in turns) {
    assertEqual(getOpponentColors(turns[i]), expected[i], 'getOpponentColors ' + (i + 1));
    i++;
  }
}

// (1:初期配置)
const TEST_BOARD1 = [
  H, H, H, H, H, H, H, H, H, H,
  H, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, H,
  H, E, E, E, W, B, E, E, E, H,
  H, E, E, E, B, W, E, E, E, H,
  H, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, H,
  H, H, H, H, H, H, H, H, H, H,
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
    [{'put': 34, 'flipped': [44]}, {'put': 43, 'flipped': [44]}, {'put': 56, 'flipped': [55]}, {'put': 65, 'flipped': [55]}],
    [{'put': 35, 'flipped': [45]}, {'put': 46, 'flipped': [45]}, {'put': 53, 'flipped': [54]}, {'put': 64, 'flipped': [54]}],
  ],
}

// (2:8方向)
const TEST_BOARD2_1 = [
  H, H, H, H, H, H, H, H, H, H,
  H, B, B, B, B, B, B, B, B, H,
  H, B, W, W, W, W, W, W, B, H,
  H, B, W, W, W, W, W, W, B, H,
  H, B, W, W, E, W, W, W, B, H,
  H, B, W, W, W, W, W, W, B, H,
  H, B, W, W, W, W, W, W, B, H,
  H, B, W, W, W, W, W, W, B, H,
  H, B, B, B, B, B, B, B, B, H,
  H, H, H, H, H, H, H, H, H, H,
];
let board2_1Expected = {
  'getLegalMoves': [
    [44],
  ],
  'getFlippablesAtIndex': [
    [[34, 24, 35, 26, 45, 46, 47, 55, 66, 77, 54, 64, 74, 53, 62, 43, 42, 33, 22]],
  ],
  'putDisc': [
    [{'put': 44, 'flipped': [34, 24, 35, 26, 45, 46, 47, 55, 66, 77, 54, 64, 74, 53, 62, 43, 42, 33, 22]}],
  ],
}

const TEST_BOARD2_2 = [
  H, H, H, H, H, H, H, H, H, H,
  H, B, B, B, B, B, B, B, B, H,
  H, B, W, W, W, W, W, W, B, H,
  H, B, W, W, W, W, W, W, B, H,
  H, B, W, W, W, E, W, W, B, H,
  H, B, W, W, W, W, W, W, B, H,
  H, B, W, W, W, W, W, W, B, H,
  H, B, W, W, W, W, W, W, B, H,
  H, B, B, B, B, B, B, B, B, H,
  H, H, H, H, H, H, H, H, H, H,
];
let board2_2Expected = {
  'getLegalMoves': [
    [45],
  ],
  'getFlippablesAtIndex': [
    [[35, 25, 36, 27, 46, 47, 56, 67, 55, 65, 75, 54, 63, 72, 44, 43, 42, 34, 23]],
  ],
  'putDisc': [
    [{'put': 45, 'flipped': [35, 25, 36, 27, 46, 47, 56, 67, 55, 65, 75, 54, 63, 72, 44, 43, 42, 34, 23]}],
  ],
}

const TEST_BOARD2_3 = [
  H, H, H, H, H, H, H, H, H, H,
  H, W, W, W, W, W, W, W, W, H,
  H, W, B, B, B, B, B, B, W, H,
  H, W, B, B, B, B, B, B, W, H,
  H, W, B, B, B, B, B, B, W, H,
  H, W, B, B, E, B, B, B, W, H,
  H, W, B, B, B, B, B, B, W, H,
  H, W, B, B, B, B, B, B, W, H,
  H, W, W, W, W, W, W, W, W, H,
  H, H, H, H, H, H, H, H, H, H,
];
let board2_3Expected = {
  'getLegalMoves': [
    [54],
  ],
  'getFlippablesAtIndex': [
    [[44, 34, 24, 45, 36, 27, 55, 56, 57, 65, 76, 64, 74, 63, 72, 53, 52, 43, 32]],
  ],
  'putDisc': [
    [{'put': 54, 'flipped': [44, 34, 24, 45, 36, 27, 55, 56, 57, 65, 76, 64, 74, 63, 72, 53, 52, 43, 32]}],
  ],
}

const TEST_BOARD2_4 = [
  H, H, H, H, H, H, H, H, H, H,
  H, W, W, W, W, W, W, W, W, H,
  H, W, B, B, B, B, B, B, W, H,
  H, W, B, B, B, B, B, B, W, H,
  H, W, B, B, B, B, B, B, W, H,
  H, W, B, B, B, E, B, B, W, H,
  H, W, B, B, B, B, B, B, W, H,
  H, W, B, B, B, B, B, B, W, H,
  H, W, W, W, W, W, W, W, W, H,
  H, H, H, H, H, H, H, H, H, H,
];
let board2_4Expected = {
  'getLegalMoves': [
    [55],
  ],
  'getFlippablesAtIndex': [
    [[45, 35, 25, 46, 37, 56, 57, 66, 77, 65, 75, 64, 73, 54, 53, 52, 44, 33, 22]],
  ],
  'putDisc': [
    [{'put': 55, 'flipped': [45, 35, 25, 46, 37, 56, 57, 66, 77, 65, 75, 64, 73, 54, 53, 52, 44, 33, 22]}],
  ],
}

testBoardMethods([B, W], TEST_BOARD1,   board1Expected,   '1'  );
testBoardMethods([B],    TEST_BOARD2_1, board2_1Expected, '2-1');
testBoardMethods([B],    TEST_BOARD2_2, board2_2Expected, '2-2');
testBoardMethods([W],    TEST_BOARD2_3, board2_3Expected, '2-3');
testBoardMethods([W],    TEST_BOARD2_4, board2_4Expected, '2-4');

turns = [B, W, A, 'no color'];
expecteds = [[W, A, C, Y, G], [B, A, C, Y, G], [B, W, C, Y, G], []];
testGetOpponentColors(turns, expecteds);

// (3:初期配置+灰)
const TEST_BOARD3 = [
  H, H, H, H, H, H, H, H, H, H,
  H, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, H,
  H, E, E, E, A, E, E, E, E, H,
  H, E, E, E, W, B, A, E, E, H,
  H, E, E, A, B, W, E, E, E, H,
  H, E, E, E, E, A, E, E, E, H,
  H, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, H,
  H, H, H, H, H, H, H, H, H, H,
];
let board3Expected = {
  'getLegalMoves': [
    [23, 24, 43, 47, 52, 56, 75, 76],
    [24, 35, 37, 47, 52, 62, 64, 75],
    [35, 43, 56, 64],
  ],
  'getFlippablesAtIndex': [
    [[34], [34, 44], [44], [46], [53], [55], [65, 55], [65]],
    [[34], [45], [46], [46, 45], [53, 54], [53], [54], [65]],
    [[45, 55, 44], [44, 45, 54], [55, 54, 45], [54, 44, 55]],
  ],
  'putDisc': [
    [{'put': 23, 'flipped': [34]}, {'put': 24, 'flipped': [34, 44]}, {'put': 43, 'flipped': [44]}, {'put': 47, 'flipped': [46]}, {'put': 52, 'flipped': [53]}, {'put': 56, 'flipped': [55]}, {'put': 75, 'flipped': [65, 55]}, {'put': 76, 'flipped': [65]}],
    [{'put': 24, 'flipped': [34]}, {'put': 35, 'flipped': [45]}, {'put': 37, 'flipped': [46]}, {'put': 47, 'flipped': [46, 45]}, {'put': 52, 'flipped': [53, 54]}, {'put': 62, 'flipped': [53]}, {'put': 64, 'flipped': [54]}, {'put': 75, 'flipped': [65]}],
    [{'put': 35, 'flipped': [45, 55, 44]}, {'put': 43, 'flipped': [44, 45, 54]}, {'put': 56, 'flipped': [55, 54, 45]}, {'put': 64, 'flipped': [54, 44, 55]}],
  ],
}

testBoardMethods([B, W, A], TEST_BOARD3, board3Expected, '3');

// (4:緑)
const TEST_BOARD4 = [
  H, H, H, H, H, H, H, H, H, H,
  H, G, E, E, E, E, E, E, G, H,
  H, W, E, E, E, E, E, E, G, H,
  H, G, E, E, E, E, E, E, E, H,
  H, A, E, E, G, A, E, E, E, H,
  H, E, E, E, B, W, E, E, E, H,
  H, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, H,
  H, H, H, H, H, H, H, H, H, H,
];
let board4Expected = {
  'getLegalMoves': [
    [34, 36, 38, 46, 51, 56, 66],
    [33, 35, 38, 46, 51, 53, 64],
    [38, 43, 63, 64, 65, 66],
  ],
  'getFlippablesAtIndex': [
    [[44], [45], [28], [45], [41, 31, 21], [55], [55]],
    [[44], [45], [28], [45], [41, 31], [54], [54]],
    [[28], [44], [54], [54], [55], [55]],
  ],
  'putDisc': [
    [{'put': 34, 'flipped': [44]}, {'put': 36, 'flipped': [45]}, {'put': 38, 'flipped': [28]}, {'put': 46, 'flipped': [45]}, {'put': 51, 'flipped': [41, 31, 21]}, {'put': 56, 'flipped': [55]}, {'put': 66, 'flipped': [55]}],
    [{'put': 33, 'flipped': [44]}, {'put': 35, 'flipped': [45]}, {'put': 38, 'flipped': [28]}, {'put': 46, 'flipped': [45]}, {'put': 51, 'flipped': [41, 31]}, {'put': 53, 'flipped': [54]}, {'put': 64, 'flipped': [54]}],
    [{'put': 38, 'flipped': [28]}, {'put': 43, 'flipped': [44]}, {'put': 63, 'flipped': [54]}, {'put': 64, 'flipped': [54]}, {'put': 65, 'flipped': [55]}, {'put': 66, 'flipped': [55]}],
  ],
}

testBoardMethods([B, W, A], TEST_BOARD4, board4Expected, '4');

// (5:シアン、山吹)
const TEST_BOARD5 = [
  H, H, H, H, H, H, H, H, H, H,
  H, C, E, Y, E, E, E, E, E, H,
  H, Y, E, C, E, E, E, E, E, H,
  H, A, E, A, E, E, E, E, E, H,
  H, W, E, W, E, E, E, E, E, H,
  H, B, E, B, E, E, E, E, E, H,
  H, G, E, G, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, H,
  H, H, H, H, H, H, H, H, H, H,
];
let board5Expected = {
  'getLegalMoves': [
    [71, 73],
    [71, 73],
    [71, 73],
  ],
  'getFlippablesAtIndex': [
    [[61], [63]],
    [[61, 51, 41, 31, 21], [63, 53, 43, 33]],
    [[61, 51, 41, 31], [63, 53, 43, 33, 23]],
  ],
  'putDisc': [
    [{'put': 71, 'flipped': [61]}, {'put': 73, 'flipped': [63]}],
    [{'put': 71, 'flipped': [61, 51, 41, 31, 21]}, {'put': 73, 'flipped': [63, 53, 43, 33]}],
    [{'put': 71, 'flipped': [61, 51, 41, 31]}, {'put': 73, 'flipped': [63, 53, 43, 33, 23]}],
  ],
}

testBoardMethods([B, C, Y], TEST_BOARD5, board5Expected, '5');
