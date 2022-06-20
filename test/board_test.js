console.log('[board_test.js]');

// - getBitBoard
function testGetBitBoard(boards, expecteds) {
  let i = 0;
  for (let board of boards) {
    const actual = getBitBoard(board);
    const expected = expecteds[i];
    assertEqual(actual, expected, 'getBitBoard ' + (i + 1));
    i++;
  }
}

// - getOpponentsBitBoard
function testGetOpponentsBitBoard(turns, boards, expecteds) {
  let i = 0;
  for (let board of boards) {
    const bitboard = getBitBoard(board);
    const actual = getOpponentsBitBoard(turns[i], bitboard);
    const expected = expecteds[i];
    assertEqual(actual, expected, 'getOpponentsBitBoard ' + (i + 1));
    i++;
  }
}

// - getBitBoardMask
function testGetBitBoardMask(boards, expecteds) {
  let i = 0;
  for (let board of boards) {
    const actual = getBitBoardMask(getBitBoard(board));
    const expected = expecteds[i];
    assertEqual(actual, expected, 'getBitBoardMask ' + (i + 1));
    i++;
  }
}

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
    [{'flippables': [44], 'flippers': [54], 'erasable': false}, {'flippables': [44], 'flippers': [45], 'erasable': false}, {'flippables': [55], 'flippers': [54], 'erasable': false}, {'flippables': [55], 'flippers': [45], 'erasable': false}],
    [{'flippables': [45], 'flippers': [55], 'erasable': false}, {'flippables': [45], 'flippers': [44], 'erasable': false}, {'flippables': [54], 'flippers': [55], 'erasable': false}, {'flippables': [54], 'flippers': [44], 'erasable': false}],
  ],
  'putDisc': [
    [{'put': 34, 'flipped': [44], 'flippers': [54], 'erasable': false}, {'put': 43, 'flipped': [44], 'flippers': [45], 'erasable': false}, {'put': 56, 'flipped': [55], 'flippers': [54], 'erasable': false}, {'put': 65, 'flipped': [55], 'flippers': [45], 'erasable': false}],
    [{'put': 35, 'flipped': [45], 'flippers': [55], 'erasable': false}, {'put': 46, 'flipped': [45], 'flippers': [44], 'erasable': false}, {'put': 53, 'flipped': [54], 'flippers': [55], 'erasable': false}, {'put': 64, 'flipped': [54], 'flippers': [44], 'erasable': false}],
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
    [{'flippables': [34, 24, 35, 26, 45, 46, 47, 55, 66, 77, 54, 64, 74, 53, 62, 43, 42, 33, 22], 'flippers': [14, 17, 48, 88, 84, 71, 41, 11], 'erasable': false}],
  ],
  'putDisc': [
    [{'put': 44, 'flipped': [34, 24, 35, 26, 45, 46, 47, 55, 66, 77, 54, 64, 74, 53, 62, 43, 42, 33, 22], 'flippers': [14, 17, 48, 88, 84, 71, 41, 11], 'erasable': false}],
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
    [{'flippables': [35, 25, 36, 27, 46, 47, 56, 67, 55, 65, 75, 54, 63, 72, 44, 43, 42, 34, 23], 'flippers': [15, 18, 48, 78, 85, 81, 41, 12], 'erasable': false}],
  ],
  'putDisc': [
    [{'put': 45, 'flipped': [35, 25, 36, 27, 46, 47, 56, 67, 55, 65, 75, 54, 63, 72, 44, 43, 42, 34, 23], 'flippers': [15, 18, 48, 78, 85, 81, 41, 12], 'erasable': false}],
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
    [{'flippables': [44, 34, 24, 45, 36, 27, 55, 56, 57, 65, 76, 64, 74, 63, 72, 53, 52, 43, 32], 'flippers': [14, 18, 58, 87, 84, 81, 51, 21], 'erasable': false}],
  ],
  'putDisc': [
    [{'put': 54, 'flipped': [44, 34, 24, 45, 36, 27, 55, 56, 57, 65, 76, 64, 74, 63, 72, 53, 52, 43, 32], 'flippers': [14, 18, 58, 87, 84, 81, 51, 21], 'erasable': false}],
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
    [{'flippables': [45, 35, 25, 46, 37, 56, 57, 66, 77, 65, 75, 64, 73, 54, 53, 52, 44, 33, 22], 'flippers': [15, 28, 58, 88, 85, 82, 51, 11], 'erasable': false}],
  ],
  'putDisc': [
    [{'put': 55, 'flipped': [45, 35, 25, 46, 37, 56, 57, 66, 77, 65, 75, 64, 73, 54, 53, 52, 44, 33, 22], 'flippers': [15, 28, 58, 88, 85, 82, 51, 11], 'erasable': false}],
  ],
}

testBoardMethods([B, W], TEST_BOARD1,   board1Expected,   '1'  );
testBoardMethods([B],    TEST_BOARD2_1, board2_1Expected, '2-1');
testBoardMethods([B],    TEST_BOARD2_2, board2_2Expected, '2-2');
testBoardMethods([W],    TEST_BOARD2_3, board2_3Expected, '2-3');
testBoardMethods([W],    TEST_BOARD2_4, board2_4Expected, '2-4');

turns = [B, W, A, 'no color'];
expecteds = [[W, A, C, Y, G, R], [B, A, C, Y, G, R], [B, W, C, Y, G, R], []];
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
    [
      {'flippables': [34],     'flippers': [45], 'erasable': false},
      {'flippables': [34, 44], 'flippers': [54], 'erasable': false},
      {'flippables': [44],     'flippers': [45], 'erasable': false},
      {'flippables': [46],     'flippers': [45], 'erasable': false},
      {'flippables': [53],     'flippers': [54], 'erasable': false},
      {'flippables': [55],     'flippers': [54], 'erasable': false},
      {'flippables': [65, 55], 'flippers': [45], 'erasable': false},
      {'flippables': [65],     'flippers': [54], 'erasable': false},
    ],
    [
      {'flippables': [34],     'flippers': [44], 'erasable': false},
      {'flippables': [45],     'flippers': [55], 'erasable': false},
      {'flippables': [46],     'flippers': [55], 'erasable': false},
      {'flippables': [46, 45], 'flippers': [44], 'erasable': false},
      {'flippables': [53, 54], 'flippers': [55], 'erasable': false},
      {'flippables': [53],     'flippers': [44], 'erasable': false},
      {'flippables': [54],     'flippers': [44], 'erasable': false},
      {'flippables': [65],     'flippers': [55], 'erasable': false},
    ],
    [
      {'flippables': [45, 55, 44], 'flippers': [65, 53], 'erasable': false},
      {'flippables': [44, 45, 54], 'flippers': [46, 65], 'erasable': false},
      {'flippables': [55, 54, 45], 'flippers': [53, 34], 'erasable': false},
      {'flippables': [54, 44, 55], 'flippers': [34, 46], 'erasable': false},
    ],
  ],
  'putDisc': [
    [
      {'put': 23, 'flipped': [34],     'flippers': [45], 'erasable': false},
      {'put': 24, 'flipped': [34, 44], 'flippers': [54], 'erasable': false},
      {'put': 43, 'flipped': [44],     'flippers': [45], 'erasable': false},
      {'put': 47, 'flipped': [46],     'flippers': [45], 'erasable': false},
      {'put': 52, 'flipped': [53],     'flippers': [54], 'erasable': false},
      {'put': 56, 'flipped': [55],     'flippers': [54], 'erasable': false},
      {'put': 75, 'flipped': [65, 55], 'flippers': [45], 'erasable': false},
      {'put': 76, 'flipped': [65],     'flippers': [54], 'erasable': false},
    ],
    [
      {'put': 24, 'flipped': [34],     'flippers': [44], 'erasable': false},
      {'put': 35, 'flipped': [45],     'flippers': [55], 'erasable': false},
      {'put': 37, 'flipped': [46],     'flippers': [55], 'erasable': false},
      {'put': 47, 'flipped': [46, 45], 'flippers': [44], 'erasable': false},
      {'put': 52, 'flipped': [53, 54], 'flippers': [55], 'erasable': false},
      {'put': 62, 'flipped': [53],     'flippers': [44], 'erasable': false},
      {'put': 64, 'flipped': [54],     'flippers': [44], 'erasable': false},
      {'put': 75, 'flipped': [65],     'flippers': [55], 'erasable': false},
    ],
    [
      {'put': 35, 'flipped': [45, 55, 44], 'flippers': [65, 53], 'erasable': false},
      {'put': 43, 'flipped': [44, 45, 54], 'flippers': [46, 65], 'erasable': false},
      {'put': 56, 'flipped': [55, 54, 45], 'flippers': [53, 34], 'erasable': false},
      {'put': 64, 'flipped': [54, 44, 55], 'flippers': [34, 46], 'erasable': false},
    ],
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
    [
      {'flippables': [44],         'flippers': [54], 'erasable': false},
      {'flippables': [45],         'flippers': [54], 'erasable': false},
      {'flippables': [28],         'flippers': [18], 'erasable': false},
      {'flippables': [45],         'flippers': [44], 'erasable': false},
      {'flippables': [41, 31, 21], 'flippers': [11], 'erasable': false},
      {'flippables': [55],         'flippers': [54], 'erasable': false},
      {'flippables': [55],         'flippers': [44], 'erasable': false},
    ],
    [
      {'flippables': [44],     'flippers': [55], 'erasable': false},
      {'flippables': [45],     'flippers': [55], 'erasable': false},
      {'flippables': [28],     'flippers': [18], 'erasable': false},
      {'flippables': [45],     'flippers': [44], 'erasable': false},
      {'flippables': [41, 31], 'flippers': [21], 'erasable': false},
      {'flippables': [54],     'flippers': [55], 'erasable': false},
      {'flippables': [54],     'flippers': [44], 'erasable': false},
    ],
    [
      {'flippables': [28], 'flippers': [18], 'erasable': false},
      {'flippables': [44], 'flippers': [45], 'erasable': false},
      {'flippables': [54], 'flippers': [45], 'erasable': false},
      {'flippables': [54], 'flippers': [44], 'erasable': false},
      {'flippables': [55], 'flippers': [45], 'erasable': false},
      {'flippables': [55], 'flippers': [44], 'erasable': false},
    ],
  ],
  'putDisc': [
    [
      {'put': 34, 'flipped': [44],         'flippers': [54], 'erasable': false},
      {'put': 36, 'flipped': [45],         'flippers': [54], 'erasable': false},
      {'put': 38, 'flipped': [28],         'flippers': [18], 'erasable': false},
      {'put': 46, 'flipped': [45],         'flippers': [44], 'erasable': false},
      {'put': 51, 'flipped': [41, 31, 21], 'flippers': [11], 'erasable': false},
      {'put': 56, 'flipped': [55],         'flippers': [54], 'erasable': false},
      {'put': 66, 'flipped': [55],         'flippers': [44], 'erasable': false},
    ],
    [
      {'put': 33, 'flipped': [44],     'flippers': [55], 'erasable': false},
      {'put': 35, 'flipped': [45],     'flippers': [55], 'erasable': false},
      {'put': 38, 'flipped': [28],     'flippers': [18], 'erasable': false},
      {'put': 46, 'flipped': [45],     'flippers': [44], 'erasable': false},
      {'put': 51, 'flipped': [41, 31], 'flippers': [21], 'erasable': false},
      {'put': 53, 'flipped': [54],     'flippers': [55], 'erasable': false},
      {'put': 64, 'flipped': [54],     'flippers': [44], 'erasable': false},
    ],
    [
      {'put': 38, 'flipped': [28], 'flippers': [18], 'erasable': false},
      {'put': 43, 'flipped': [44], 'flippers': [45], 'erasable': false},
      {'put': 63, 'flipped': [54], 'flippers': [45], 'erasable': false},
      {'put': 64, 'flipped': [54], 'flippers': [44], 'erasable': false},
      {'put': 65, 'flipped': [55], 'flippers': [45], 'erasable': false},
      {'put': 66, 'flipped': [55], 'flippers': [44], 'erasable': false},
    ],
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
    [{'flippables': [61],                 'flippers': [51], 'erasable': false}, {'flippables': [63],                 'flippers': [53], 'erasable': false}],
    [{'flippables': [61, 51, 41, 31, 21], 'flippers': [11], 'erasable': false}, {'flippables': [63, 53, 43, 33],     'flippers': [23], 'erasable': false}],
    [{'flippables': [61, 51, 41, 31],     'flippers': [21], 'erasable': false}, {'flippables': [63, 53, 43, 33, 23], 'flippers': [13], 'erasable': false}],
  ],
  'putDisc': [
    [{'put': 71, 'flipped': [61],                 'flippers': [51], 'erasable': false}, {'put': 73, 'flipped': [63],                 'flippers': [53], 'erasable': false}],
    [{'put': 71, 'flipped': [61, 51, 41, 31, 21], 'flippers': [11], 'erasable': false}, {'put': 73, 'flipped': [63, 53, 43, 33],     'flippers': [23], 'erasable': false}],
    [{'put': 71, 'flipped': [61, 51, 41, 31],     'flippers': [21], 'erasable': false}, {'put': 73, 'flipped': [63, 53, 43, 33, 23], 'flippers': [13], 'erasable': false}],
  ],
}

testBoardMethods([B, C, Y], TEST_BOARD5, board5Expected, '5');

// (6:赤)
const TEST_BOARD6 = [
  H, H, H, H, H, H, H, H, H, H,
  H, E, B, W, R, E, W, W, B, H,
  H, W, W, E, E, B, E, E, E, H,
  H, R, E, G, E, E, E, E, E, H,
  H, B, E, E, B, E, E, E, E, H,
  H, G, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, H,
  H, H, H, H, H, H, H, H, H, H,
];
let board6Expected = {
  'getLegalMoves': [
    [11, 15, 32, 61],
  ],
  'getFlippablesAtIndex': [
    [
      {'flippables': [22, 33, 21, 31], 'flippers': [44, 41], 'erasable': true},
      {'flippables': [16, 17, 14, 13], 'flippers': [18, 12], 'erasable': true},
      {'flippables': [22], 'flippers': [12], 'erasable': false},
      {'flippables': [51], 'flippers': [41], 'erasable': false},
    ],
  ],
  'putDisc': [
    [
      {'put': 11, 'flipped': [22, 33, 21, 31], 'flippers': [44, 41], 'erasable': true},
      {'put': 15, 'flipped': [16, 17, 14, 13], 'flippers': [18, 12], 'erasable': true},
      {'put': 32, 'flipped': [22], 'flippers': [12], 'erasable': false},
      {'put': 61, 'flipped': [51], 'flippers': [41], 'erasable': false},
    ],
  ],
}

testBoardMethods([B], TEST_BOARD6, board6Expected, '6');

// - getBitBoard
boards = [TEST_BOARD1, BOARD];
expecteds = [
  {  // TEST_BOARD1
    'bits': [
      [0x00000000, 0x00000000],  // 穴
      [0xFFFFFFE7, 0xE7FFFFFF],  // 空き
      [0x00000008, 0x10000000],  // 黒
      [0x00000010, 0x08000000],  // 白
      [0x00000000, 0x00000000],  // 灰
      [0x00000000, 0x00000000],  // シアン
      [0x00000000, 0x00000000],  // 山吹
      [0x00000000, 0x00000000],  // 緑
      [0x00000000, 0x00000000],  // 赤
    ],
    'size': 8,
    'pageSize': 2,
  },
  {  // BOARD
    'bits': [
      [0xF3F87C0E, 0x01000008, 0x0703E1FC, 0xF0000000],  // 穴
      [0x0C0683F1, 0xCEA1F857, 0x38FC1603, 0x00000000],  // 空き
      [0x00000000, 0x00040200, 0x00000000, 0x00000000],  // 黒
      [0x00000000, 0x00080100, 0x00000000, 0x00000000],  // 白
      [0x00000000, 0x00000000, 0x00000000, 0x00000000],  // 灰
      [0x00000000, 0x10000000, 0x80000000, 0x00000000],  // シアン
      [0x00000000, 0x00100080, 0x00000000, 0x00000000],  // 山吹
      [0x00000000, 0x20020400, 0x40000000, 0x00000000],  // 緑
      [0x00010000, 0x00400020, 0x00000800, 0x00000000],  // 赤
    ],
    'size': 10,
    'pageSize': 4,
  },
];
testGetBitBoard(boards, expecteds);

// - getOpponentsBitBoard
turns = [B, W, B];
boards = [TEST_BOARD1, TEST_BOARD1, BOARD];
expecteds = [
  [0x00000010, 0x08000000],  // opponent against B at TEST_BOARD1
  [0x00000008, 0x10000000],  // opponent against W at TEST_BOARD1
  [0x00010000, 0x305A05A0, 0xC0000800, 0x00000000],  // opponent against B at BOARD
];
testGetOpponentsBitBoard(turns, boards, expecteds);

// - getBitBoardMask
const BOARD4 = [
  H, H, H, H, H, H,
  H, E, E, E, E, H,
  H, E, W, B, E, H,
  H, E, B, W, E, H,
  H, E, E, E, E, H,
  H, H, H, H, H, H,
];
const BOARD6 = [
  H, H, H, H, H, H, H, H,
  H, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, H,
  H, E, E, W, B, E, E, H,
  H, E, E, B, W, E, E, H,
  H, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, H,
  H, H, H, H, H, H, H, H,
];
const BOARD8 = [
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
const BOARD10 = [
  H, H, H, H, H, H, H, H, H, H, H, H,
  H, E, E, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, W, B, E, E, E, E, H,
  H, E, E, E, E, B, W, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, E, E, H,
  H, H, H, H, H, H, H, H, H, H, H, H,
];
const BOARD12 = [
  H, H, H, H, H, H, H, H, H, H, H, H, H, H,
  H, E, E, E, E, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, W, B, E, E, E, E, E, H,
  H, E, E, E, E, E, B, W, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, E, E, E, E, H,
  H, H, H, H, H, H, H, H, H, H, H, H, H, H,
];
boards = [BOARD4, BOARD6, BOARD8, BOARD10, BOARD12]
expecteds = [
  {
    'horizontal': [0x66660000],
    'vertical'  : [0x0FF00000],
    'diagonal'  : [0x06600000],
    'r'         : [0x77770000],
    'l'         : [0xEEEE0000],
    't'         : [0xFFF00000],
    'b'         : [0x0FFF0000],
    'rt'        : [0x77700000],
    'rb'        : [0x07770000],
    'lt'        : [0xEEE00000],
    'lb'        : [0x0EEE0000],
  },
  {
    'horizontal': [0x79E79E79, 0xE0000000],
    'vertical'  : [0x03FFFFFC, 0x00000000],
    'diagonal'  : [0x01E79E78, 0x00000000],
    'r'         : [0x7DF7DF7D, 0xF0000000],
    'l'         : [0xFBEFBEFB, 0xE0000000],
    't'         : [0xFFFFFFFC, 0x00000000],
    'b'         : [0x03FFFFFF, 0xF0000000],
    'rt'        : [0x7DF7DF7C, 0x00000000],
    'rb'        : [0x01F7DF7D, 0xF0000000],
    'lt'        : [0xFBEFBEF8, 0x00000000],
    'lb'        : [0x03EFBEFB, 0xE0000000],
  },
  {
    'horizontal': [0x7E7E7E7E, 0x7E7E7E7E],
    'vertical'  : [0x00FFFFFF, 0xFFFFFF00],
    'diagonal'  : [0x007E7E7E, 0x7E7E7E00],
    'r'         : [0x7F7F7F7F, 0x7F7F7F7F],
    'l'         : [0xFEFEFEFE, 0xFEFEFEFE],
    't'         : [0xFFFFFFFF, 0xFFFFFF00],
    'b'         : [0x00FFFFFF, 0xFFFFFFFF],
    'rt'        : [0x7F7F7F7F, 0x7F7F7F00],
    'rb'        : [0x007F7F7F, 0x7F7F7F7F],
    'lt'        : [0xFEFEFEFE, 0xFEFEFE00],
    'lb'        : [0x00FEFEFE, 0xFEFEFEFE],
  },
  {
    'horizontal': [0x7F9FE7F9, 0xFE7F9FE7, 0xF9FE7F9F, 0xE0000000],
    'vertical'  : [0x003FFFFF, 0xFFFFFFFF, 0xFFFFFFC0, 0x00000000],
    'diagonal'  : [0x001FE7F9, 0xFE7F9FE7, 0xF9FE7F80, 0x00000000],
    'r'         : [0x7FDFF7FD, 0xFF7FDFF7, 0xFDFF7FDF, 0xF0000000],
    'l'         : [0xFFBFEFFB, 0xFEFFBFEF, 0xFBFEFFBF, 0xE0000000],
    't'         : [0xFFFFFFFF, 0xFFFFFFFF, 0xFFFFFFC0, 0x00000000],
    'b'         : [0x003FFFFF, 0xFFFFFFFF, 0xFFFFFFFF, 0xF0000000],
    'rt'        : [0x7FDFF7FD, 0xFF7FDFF7, 0xFDFF7FC0, 0x00000000],
    'rb'        : [0x001FF7FD, 0xFF7FDFF7, 0xFDFF7FDF, 0xF0000000],
    'lt'        : [0xFFBFEFFB, 0xFEFFBFEF, 0xFBFEFF80, 0x00000000],
    'lb'        : [0x003FEFFB, 0xFEFFBFEF, 0xFBFEFFBF, 0xE0000000],
  },
  {
    'horizontal': [0x7FE7FE7F, 0xE7FE7FE7, 0xFE7FE7FE, 0x7FE7FE7F, 0xE7FE0000],
    'vertical'  : [0x000FFFFF, 0xFFFFFFFF, 0xFFFFFFFF, 0xFFFFFFFF, 0xF0000000],
    'diagonal'  : [0x0007FE7F, 0xE7FE7FE7, 0xFE7FE7FE, 0x7FE7FE7F, 0xE0000000],
    'r'         : [0x7FF7FF7F, 0xF7FF7FF7, 0xFF7FF7FF, 0x7FF7FF7F, 0xF7FF0000],
    'l'         : [0xFFEFFEFF, 0xEFFEFFEF, 0xFEFFEFFE, 0xFFEFFEFF, 0xEFFE0000],
    't'         : [0xFFFFFFFF, 0xFFFFFFFF, 0xFFFFFFFF, 0xFFFFFFFF, 0xF0000000],
    'b'         : [0x000FFFFF, 0xFFFFFFFF, 0xFFFFFFFF, 0xFFFFFFFF, 0xFFFF0000],
    'rt'        : [0x7FF7FF7F, 0xF7FF7FF7, 0xFF7FF7FF, 0x7FF7FF7F, 0xF0000000],
    'rb'        : [0x0007FF7F, 0xF7FF7FF7, 0xFF7FF7FF, 0x7FF7FF7F, 0xF7FF0000],
    'lt'        : [0xFFEFFEFF, 0xEFFEFFEF, 0xFEFFEFFE, 0xFFEFFEFF, 0xE0000000],
    'lb'        : [0x000FFEFF, 0xEFFEFFEF, 0xFEFFEFFE, 0xFFEFFEFF, 0xEFFE0000],
  },
];
testGetBitBoardMask(boards, expecteds);
