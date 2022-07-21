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

// - getArrayBoard
function testGetArrayBoard(boards, expecteds) {
  let i = 0;
  for (let board of boards) {
    const actual = getArrayBoard(getBitBoard(board));
    const expected = expecteds[i];
    assertEqual(actual, expected, 'getArrayBoard ' + (i + 1));
    i++;
  }
}

// - bitsToIndexs
function testBitsToIndexs(bitss, sizes, expecteds) {
  let i = 0;
  for (let bits of bitss) {
    const actual = bitsToIndexs(bits, sizes[i]);
    const expected = expecteds[i];
    assertEqual(actual, expected, 'bitsToIndexs ' + (i + 1));
    i++;
  }
}

// - moveToBits
function testMoveToBits(moves, sizes, expecteds) {
  let i = 0;
  for (let move of moves) {
    const actual = moveToBits(move, sizes[i]);
    const expected = expecteds[i];
    assertEqual(actual, expected, 'moveToBits ' + (i + 1));
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
    const bitboard = getBitBoard(board);
    const actual = getBitBoardMask(bitboard['size'], bitboard['pageSize']);
    const expected = expecteds[i];
    assertEqual(actual, expected, 'getBitBoardMask ' + (i + 1));
    i++;
  }
}

// - getLegalMovesArray
function testGetLegalMovesArray(boards, orders, cutins, num) {
  for (let i in boards) {
    for (let loop=0; loop<num; loop++) {
      const game = new Game(boards[i], orders[i], getRandomFlippers(FLIPPERS), cutins[i]);
      while(game.play() === GAME_PLAY) {
        legal1 = getLegalMoves(game.turn, game.bitboard, game.mask);
        legal2 = getLegalMovesArray(game.turn, game.board);
        actual = {'legal': legal1, 'turn': game.turn, 'board': game.board};
        expected = {'legal': legal2, 'turn': game.turn, 'board': game.board};
        assertEqual(actual, expected, 'getLegalMovesArray ' + (Number(i) + 1) + '-' + (loop + 1));
      }
    }
  }
}

// - getLegalMovesBits
function testGetLegalMovesBits(turns, boards, expecteds) {
  for (let i in turns) {
    const bitboard = getBitBoard(boards[i]);
    const mask = getBitBoardMask(bitboard['size'], bitboard['pageSize']);
    const actual = getLegalMovesBits(turns[i], bitboard, mask);
    const expected = expecteds[i];
    assertEqual(actual, expected, 'getLegalMovesBits ' + (Number(i) + 1));
  }
}

// - getLegalMoves
function testGetLegalMoves(turns, board, expecteds, no) {
  for (let i in turns) {
    const bitboard = getBitBoard(board);
    const mask = getBitBoardMask(bitboard['size'], bitboard['pageSize']);
    const actual = getLegalMoves(turns[i], bitboard, mask);
    const expected = expecteds[i];
    assertEqual(actual, expected, 'getLegalMoves ' + getGameTurnText(turns[i]) + ' ' + no);
  }
}

// - getFlippablesAtIndexArray
function testGetFlippablesAtIndexArray(boards, orders, cutins, num) {
  for (let i in boards) {
    for (let loop=0; loop<num; loop++) {
      const game = new Game(boards[i], orders[i], getRandomFlippers(FLIPPERS), cutins[i]);
      const size = game.bitboard['size'];
      const boardSize = size + 2;
      while(game.play() === GAME_PLAY) {
        const bits = getLegalMovesBits(game.turn, game.bitboard, game.mask);
        let count = 0;
        for (let p=0; p<bits.length; p++) {
          let bit = 1 << (MAX_BITSIZE - 1);
          for (let q=0; q<MAX_BITSIZE; q++) {
            let index = Array(bits.length).fill(0);
            if ((bits[p] & bit) !== 0) {
              index[p] |= bit;
              const x = (count % size) + 1;
              const y = (Math.floor(count / size) + 1);
              //const move = ((Math.floor(count / size) + 1) * boardSize + (count % size) + 1);
              const move = y * boardSize + x;
              const actual = getFlippablesAtIndex(game.turn, game.bitboard, game.mask, index);
              const expected = getFlippablesAtIndexArray(game.turn, game.board, move);
              expected['flippables'] = expected['flippables'].concat().sort(function(a, b){ return a - b; });
              expected['flippers'] = expected['flippers'].concat().sort(function(a, b){ return a - b; });
              assertEqual(actual, expected, 'getFlippablesAtIndexArray ' + (Number(i) + 1) + '-' + (loop + 1));
              // --- for debug ---
              if (total !== '  OK   (total)') {
                console.log('turn  : ' + game.turn);
                let tmp = "\n";
                let count = 0;
                for (let y=0; y<boardSize; y++) {
                  for (let x=0; x<boardSize; x++) {
                    tmp += ' ' + game.board[count];
                    count++;
                  }
                  tmp += '\n';
                }
                console.log('board       : ' + tmp);
                console.log('move        : ' + move + ' (' + x + ', ' + y + ')');
                console.log('index       : ' + index);
                console.log('bitboard[0] : ' + game.bitboard['bits'][0]);
                console.log('bitboard[1] : ' + game.bitboard['bits'][1]);
                console.log('bitboard[2] : ' + game.bitboard['bits'][2]);
                console.log('bitboard[3] : ' + game.bitboard['bits'][3]);
                console.log('bitboard[4] : ' + game.bitboard['bits'][4]);
                console.log('bitboard[5] : ' + game.bitboard['bits'][5]);
                console.log('bitboard[6] : ' + game.bitboard['bits'][6]);
                console.log('bitboard[7] : ' + game.bitboard['bits'][7]);
                console.log('bitboard[8] : ' + game.bitboard['bits'][8]);
                return;
              }
              // --- for debug ---
            }
            bit >>>= 1;
            count++;
          }
        }
      }
    }
  }
}

// - getFlippablesAtIndexBits
function testGetFlippablesAtIndexBits(turns, boards, indexs, expecteds) {
  let i = 0;
  for (let board of boards) {
    const turn = turns[i];
    const bitboard = getBitBoard(board);
    const mask = getBitBoardMask(bitboard['size'], bitboard['pageSize']);
    const actual = getFlippablesAtIndexBits(turn, bitboard, mask, indexs[i]);
    const expected = expecteds[i];
    assertEqual(actual, expected, 'getFlippablesAtIndexBits ' + (i + 1));
    i++;
  }
}

// - getFlippablesAtIndex
function testGetFlippablesAtIndex(turns, board, expecteds, no) {
  for (let i in turns) {
    const turn = turns[i];
    const bitboard = getBitBoard(board);
    const mask = getBitBoardMask(bitboard['size'], bitboard['pageSize']);
    const bits = getLegalMovesBits(turn, bitboard, mask);
    const legals = getLegalMovesArray(turn, board);
    const size = bitboard['size'];
    const boardSize = size + 2;
    //console.log('legals : ' + legals);
    //console.log('bits   : ' + bits);
    let j = 0;
    let count = 0;
    for (let p=0; p<bits.length; p++) {
      let bit = 1 << (MAX_BITSIZE - 1);
      for (let q=0; q<MAX_BITSIZE; q++) {
        let index = Array(bits.length).fill(0);
        if ((bits[p] & bit) !== 0) {
          index[p] |= bit;
          //console.log('index : ' + index);
          const move = ((Math.floor(count / size) + 1) * boardSize + (count % size) + 1);
          const actual = getFlippablesAtIndex(turn, bitboard, mask, index);
          let expected = expecteds[i][j];
          expected['flippables'] = expected['flippables'].concat().sort(function(a, b){ return a - b; });
          expected['flippers'] = expected['flippers'].concat().sort(function(a, b){ return a - b; });
          assertEqual(actual, expected, 'getFlippablesAtIndex ' + getGameTurnText(turn) + ' ' + no + ' ' + p + '-' + move);
          j++;
        }
        bit >>>= 1;
        count++;
      }
    }
  }
}

// - putDisc
function testPutDisc(turns, board, expecteds, no) {
  for (let i in turns) {
    let j = 0;
    const turn = turns[i];
    const bitboard = getBitBoard(board);
    const mask = getBitBoardMask(bitboard['size'], bitboard['pageSize']);
    for (let move of getLegalMoves(turn, bitboard, mask)) {
      let localBoard = board.concat();
      actual = putDisc(turn, localBoard, move);
      actual['board'] = localBoard;
      expected = expecteds[i][j];
      j++;
      assertEqual(actual, expected, 'putDisc ' + getGameTurnText(turn) + ' ' + no + ' ' + move);
    }
  }
}

// - putDiscBits
function testPutDiscBits(turns, board, expecteds, no) {
  for (let i in turns) {
    let j = 0;
    const turn = turns[i];
    const bitboard = getBitBoard(board);
    const size = bitboard['size'];
    const mask = getBitBoardMask(size, bitboard['pageSize']);
    for (let move of getLegalMoves(turn, bitboard, mask)) {
      let localBitBoard = getBitBoard(board);
      actual = putDiscBits(turn, localBitBoard, mask, moveToBits(move, size));
      actual['put'] = bitsToIndexs(actual['put'], size)[0];
      actual['flipped'] = bitsToIndexs(actual['flipped'], size).sort(function(a, b){ return a - b; });
      actual['flippers'] = bitsToIndexs(actual['flippers'], size).sort(function(a, b){ return a - b; });
      actual['board'] = getArrayBoard(localBitBoard);
      expected = expecteds[i][j];
      expected['flipped'] = expected['flipped'].concat().sort(function(a, b){ return a - b; });
      expected['flippers'] = expected['flippers'].concat().sort(function(a, b){ return a - b; });
      j++;
      assertEqual(actual, expected, 'putDiscBits ' + getGameTurnText(turn) + ' ' + no + ' ' + move);
    }
  }
}


// - popcount
function testPopcount(bits, expecteds) {
  for (let i in bits) {
    const actual = popcount(bits[i]);
    const expected = expecteds[i];
    assertEqual(actual, expected, 'popcount ' + (Number(i) + 1));
  }
}

// - boardMethods
function testBoardMethods(turns, board, expected, no) {
  testGetLegalMoves(turns, board, expected['getLegalMoves'], no);
  testGetFlippablesAtIndex(turns, board, expected['getFlippablesAtIndex'], no);
  testPutDisc(turns, board, expected['putDisc'], no);
  testPutDiscBits(turns, board, expected['putDisc'], no);
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
    [
      {'flippables': [44], 'flippers': [54], 'erasable': false},
      {'flippables': [44], 'flippers': [45], 'erasable': false},
      {'flippables': [55], 'flippers': [54], 'erasable': false},
      {'flippables': [55], 'flippers': [45], 'erasable': false}
    ],
    [
      {'flippables': [45], 'flippers': [55], 'erasable': false},
      {'flippables': [45], 'flippers': [44], 'erasable': false},
      {'flippables': [54], 'flippers': [55], 'erasable': false},
      {'flippables': [54], 'flippers': [44], 'erasable': false}
    ],
  ],
  'putDisc': [
    [
      {'put': 34, 'flipped': [44], 'flippers': [54], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, B, E, E, E, E, H,
         H, E, E, E, B, B, E, E, E, H,
         H, E, E, E, B, W, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ]
      },
      {'put': 43, 'flipped': [44], 'flippers': [45], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, B, B, B, E, E, E, H,
         H, E, E, E, B, W, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ]
      },
      {'put': 56, 'flipped': [55], 'flippers': [54], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, W, B, E, E, E, H,
         H, E, E, E, B, B, B, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ]
      },
      {'put': 65, 'flipped': [55], 'flippers': [45], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, W, B, E, E, E, H,
         H, E, E, E, B, B, E, E, E, H,
         H, E, E, E, E, B, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ]
      }
    ],
    [
      {'put': 35, 'flipped': [45], 'flippers': [55], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, W, E, E, E, H,
         H, E, E, E, W, W, E, E, E, H,
         H, E, E, E, B, W, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ]
      },
      {'put': 46, 'flipped': [45], 'flippers': [44], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, W, W, W, E, E, H,
         H, E, E, E, B, W, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ]
      },
      {'put': 53, 'flipped': [54], 'flippers': [55], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, W, B, E, E, E, H,
         H, E, E, W, W, W, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ]
      },
      {'put': 64, 'flipped': [54], 'flippers': [44], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, W, B, E, E, E, H,
         H, E, E, E, W, W, E, E, E, H,
         H, E, E, E, W, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ]
      }
    ],
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
    [{'put': 44, 'flipped': [34, 24, 35, 26, 45, 46, 47, 55, 66, 77, 54, 64, 74, 53, 62, 43, 42, 33, 22], 'flippers': [14, 17, 48, 88, 84, 71, 41, 11], 'erasable': false,
     'board': [
       H, H, H, H, H, H, H, H, H, H,
       H, B, B, B, B, B, B, B, B, H,
       H, B, B, W, B, W, B, W, B, H,
       H, B, W, B, B, B, W, W, B, H,
       H, B, B, B, B, B, B, B, B, H,
       H, B, W, B, B, B, W, W, B, H,
       H, B, B, W, B, W, B, W, B, H,
       H, B, W, W, B, W, W, B, B, H,
       H, B, B, B, B, B, B, B, B, H,
       H, H, H, H, H, H, H, H, H, H,
     ],
    }],
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
    [{'put': 45, 'flipped': [35, 25, 36, 27, 46, 47, 56, 67, 55, 65, 75, 54, 63, 72, 44, 43, 42, 34, 23], 'flippers': [15, 18, 48, 78, 85, 81, 41, 12], 'erasable': false,
     'board': [
       H, H, H, H, H, H, H, H, H, H,
       H, B, B, B, B, B, B, B, B, H,
       H, B, W, B, W, B, W, B, B, H,
       H, B, W, W, B, B, B, W, B, H,
       H, B, B, B, B, B, B, B, B, H,
       H, B, W, W, B, B, B, W, B, H,
       H, B, W, B, W, B, W, B, B, H,
       H, B, B, W, W, B, W, W, B, H,
       H, B, B, B, B, B, B, B, B, H,
       H, H, H, H, H, H, H, H, H, H,
     ],
    }],
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
    [{'put': 54, 'flipped': [44, 34, 24, 45, 36, 27, 55, 56, 57, 65, 76, 64, 74, 63, 72, 53, 52, 43, 32], 'flippers': [14, 18, 58, 87, 84, 81, 51, 21], 'erasable': false,
     'board': [
       H, H, H, H, H, H, H, H, H, H,
       H, W, W, W, W, W, W, W, W, H,
       H, W, B, B, W, B, B, W, W, H,
       H, W, W, B, W, B, W, B, W, H,
       H, W, B, W, W, W, B, B, W, H,
       H, W, W, W, W, W, W, W, W, H,
       H, W, B, W, W, W, B, B, W, H,
       H, W, W, B, W, B, W, B, W, H,
       H, W, W, W, W, W, W, W, W, H,
       H, H, H, H, H, H, H, H, H, H,
     ],
    }],
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
    [{'put': 55, 'flipped': [45, 35, 25, 46, 37, 56, 57, 66, 77, 65, 75, 64, 73, 54, 53, 52, 44, 33, 22], 'flippers': [15, 28, 58, 88, 85, 82, 51, 11], 'erasable': false,
      'board': [
        H, H, H, H, H, H, H, H, H, H,
        H, W, W, W, W, W, W, W, W, H,
        H, W, W, B, B, W, B, B, W, H,
        H, W, B, W, B, W, B, W, W, H,
        H, W, B, B, W, W, W, B, W, H,
        H, W, W, W, W, W, W, W, W, H,
        H, W, B, B, W, W, W, B, W, H,
        H, W, B, W, B, W, B, W, W, H,
        H, W, W, W, W, W, W, W, W, H,
        H, H, H, H, H, H, H, H, H, H,
      ],
    }],
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
      {'put': 23, 'flipped': [34],     'flippers': [45], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, B, E, E, E, E, E, H,
         H, E, E, E, B, E, E, E, E, H,
         H, E, E, E, W, B, A, E, E, H,
         H, E, E, A, B, W, E, E, E, H,
         H, E, E, E, E, A, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ],},
      {'put': 24, 'flipped': [34, 44], 'flippers': [54], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, B, E, E, E, E, H,
         H, E, E, E, B, E, E, E, E, H,
         H, E, E, E, B, B, A, E, E, H,
         H, E, E, A, B, W, E, E, E, H,
         H, E, E, E, E, A, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ],},
      {'put': 43, 'flipped': [44],     'flippers': [45], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, A, E, E, E, E, H,
         H, E, E, B, B, B, A, E, E, H,
         H, E, E, A, B, W, E, E, E, H,
         H, E, E, E, E, A, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ],},
      {'put': 47, 'flipped': [46],     'flippers': [45], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, A, E, E, E, E, H,
         H, E, E, E, W, B, B, B, E, H,
         H, E, E, A, B, W, E, E, E, H,
         H, E, E, E, E, A, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ],},
      {'put': 52, 'flipped': [53],     'flippers': [54], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, A, E, E, E, E, H,
         H, E, E, E, W, B, A, E, E, H,
         H, E, B, B, B, W, E, E, E, H,
         H, E, E, E, E, A, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ],},
      {'put': 56, 'flipped': [55],     'flippers': [54], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, A, E, E, E, E, H,
         H, E, E, E, W, B, A, E, E, H,
         H, E, E, A, B, B, B, E, E, H,
         H, E, E, E, E, A, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ],},
      {'put': 75, 'flipped': [65, 55], 'flippers': [45], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, A, E, E, E, E, H,
         H, E, E, E, W, B, A, E, E, H,
         H, E, E, A, B, B, E, E, E, H,
         H, E, E, E, E, B, E, E, E, H,
         H, E, E, E, E, B, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ],},
      {'put': 76, 'flipped': [65],     'flippers': [54], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, A, E, E, E, E, H,
         H, E, E, E, W, B, A, E, E, H,
         H, E, E, A, B, W, E, E, E, H,
         H, E, E, E, E, B, E, E, E, H,
         H, E, E, E, E, E, B, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ],},
    ],
    [
      {'put': 24, 'flipped': [34],     'flippers': [44], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, W, E, E, E, E, H,
         H, E, E, E, W, E, E, E, E, H,
         H, E, E, E, W, B, A, E, E, H,
         H, E, E, A, B, W, E, E, E, H,
         H, E, E, E, E, A, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ],},
      {'put': 35, 'flipped': [45],     'flippers': [55], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, A, W, E, E, E, H,
         H, E, E, E, W, W, A, E, E, H,
         H, E, E, A, B, W, E, E, E, H,
         H, E, E, E, E, A, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ],},
      {'put': 37, 'flipped': [46],     'flippers': [55], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, A, E, E, W, E, H,
         H, E, E, E, W, B, W, E, E, H,
         H, E, E, A, B, W, E, E, E, H,
         H, E, E, E, E, A, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ],},
      {'put': 47, 'flipped': [46, 45], 'flippers': [44], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, A, E, E, E, E, H,
         H, E, E, E, W, W, W, W, E, H,
         H, E, E, A, B, W, E, E, E, H,
         H, E, E, E, E, A, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ],},
      {'put': 52, 'flipped': [53, 54], 'flippers': [55], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, A, E, E, E, E, H,
         H, E, E, E, W, B, A, E, E, H,
         H, E, W, W, W, W, E, E, E, H,
         H, E, E, E, E, A, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ],},
      {'put': 62, 'flipped': [53],     'flippers': [44], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, A, E, E, E, E, H,
         H, E, E, E, W, B, A, E, E, H,
         H, E, E, W, B, W, E, E, E, H,
         H, E, W, E, E, A, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ],},
      {'put': 64, 'flipped': [54],     'flippers': [44], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, A, E, E, E, E, H,
         H, E, E, E, W, B, A, E, E, H,
         H, E, E, A, W, W, E, E, E, H,
         H, E, E, E, W, A, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ],},
      {'put': 75, 'flipped': [65],     'flippers': [55], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, A, E, E, E, E, H,
         H, E, E, E, W, B, A, E, E, H,
         H, E, E, A, B, W, E, E, E, H,
         H, E, E, E, E, W, E, E, E, H,
         H, E, E, E, E, W, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ],},
    ],
    [
      {'put': 35, 'flipped': [45, 55, 44], 'flippers': [65, 53], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, A, A, E, E, E, H,
         H, E, E, E, A, A, A, E, E, H,
         H, E, E, A, B, A, E, E, E, H,
         H, E, E, E, E, A, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ],},
      {'put': 43, 'flipped': [44, 45, 54], 'flippers': [46, 65], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, A, E, E, E, E, H,
         H, E, E, A, A, A, A, E, E, H,
         H, E, E, A, A, W, E, E, E, H,
         H, E, E, E, E, A, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ],},
      {'put': 56, 'flipped': [55, 54, 45], 'flippers': [53, 34], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, A, E, E, E, E, H,
         H, E, E, E, W, A, A, E, E, H,
         H, E, E, A, A, A, A, E, E, H,
         H, E, E, E, E, A, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ],},
      {'put': 64, 'flipped': [54, 44, 55], 'flippers': [34, 46], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, A, E, E, E, E, H,
         H, E, E, E, A, B, A, E, E, H,
         H, E, E, A, A, A, E, E, E, H,
         H, E, E, E, A, A, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ],},
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
      {'put': 34, 'flipped': [44], 'flippers': [54], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, G, E, E, E, E, E, E, G, H,
         H, W, E, E, E, E, E, E, G, H,
         H, G, E, E, B, E, E, E, E, H,
         H, A, E, E, G, A, E, E, E, H,
         H, E, E, E, B, W, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ],},
      {'put': 36, 'flipped': [45], 'flippers': [54], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, G, E, E, E, E, E, E, G, H,
         H, W, E, E, E, E, E, E, G, H,
         H, G, E, E, E, E, B, E, E, H,
         H, A, E, E, G, B, E, E, E, H,
         H, E, E, E, B, W, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ],},
      {'put': 38, 'flipped': [28],         'flippers': [18], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, G, E, E, E, E, E, E, G, H,
         H, W, E, E, E, E, E, E, G, H,
         H, G, E, E, E, E, E, E, B, H,
         H, A, E, E, G, A, E, E, E, H,
         H, E, E, E, B, W, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ],},
      {'put': 46, 'flipped': [45],         'flippers': [44], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, G, E, E, E, E, E, E, G, H,
         H, W, E, E, E, E, E, E, G, H,
         H, G, E, E, E, E, E, E, E, H,
         H, A, E, E, G, B, B, E, E, H,
         H, E, E, E, B, W, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ],},
      {'put': 51, 'flipped': [41, 31, 21], 'flippers': [11], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, G, E, E, E, E, E, E, G, H,
         H, B, E, E, E, E, E, E, G, H,
         H, G, E, E, E, E, E, E, E, H,
         H, B, E, E, G, A, E, E, E, H,
         H, B, E, E, B, W, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ],},
      {'put': 56, 'flipped': [55],         'flippers': [54], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, G, E, E, E, E, E, E, G, H,
         H, W, E, E, E, E, E, E, G, H,
         H, G, E, E, E, E, E, E, E, H,
         H, A, E, E, G, A, E, E, E, H,
         H, E, E, E, B, B, B, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ],},
      {'put': 66, 'flipped': [55],         'flippers': [44], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, G, E, E, E, E, E, E, G, H,
         H, W, E, E, E, E, E, E, G, H,
         H, G, E, E, E, E, E, E, E, H,
         H, A, E, E, G, A, E, E, E, H,
         H, E, E, E, B, B, E, E, E, H,
         H, E, E, E, E, E, B, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ],},
    ],
    [
      {'put': 33, 'flipped': [44],     'flippers': [55], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, G, E, E, E, E, E, E, G, H,
         H, W, E, E, E, E, E, E, G, H,
         H, G, E, W, E, E, E, E, E, H,
         H, A, E, E, G, A, E, E, E, H,
         H, E, E, E, B, W, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ],},
      {'put': 35, 'flipped': [45],     'flippers': [55], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, G, E, E, E, E, E, E, G, H,
         H, W, E, E, E, E, E, E, G, H,
         H, G, E, E, E, W, E, E, E, H,
         H, A, E, E, G, W, E, E, E, H,
         H, E, E, E, B, W, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ],},
      {'put': 38, 'flipped': [28],     'flippers': [18], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, G, E, E, E, E, E, E, G, H,
         H, W, E, E, E, E, E, E, G, H,
         H, G, E, E, E, E, E, E, W, H,
         H, A, E, E, G, A, E, E, E, H,
         H, E, E, E, B, W, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ],},
      {'put': 46, 'flipped': [45],     'flippers': [44], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, G, E, E, E, E, E, E, G, H,
         H, W, E, E, E, E, E, E, G, H,
         H, G, E, E, E, E, E, E, E, H,
         H, A, E, E, G, W, W, E, E, H,
         H, E, E, E, B, W, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ],},
      {'put': 51, 'flipped': [41, 31], 'flippers': [21], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, G, E, E, E, E, E, E, G, H,
         H, W, E, E, E, E, E, E, G, H,
         H, G, E, E, E, E, E, E, E, H,
         H, W, E, E, G, A, E, E, E, H,
         H, W, E, E, B, W, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ],},
      {'put': 53, 'flipped': [54],     'flippers': [55], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, G, E, E, E, E, E, E, G, H,
         H, W, E, E, E, E, E, E, G, H,
         H, G, E, E, E, E, E, E, E, H,
         H, A, E, E, G, A, E, E, E, H,
         H, E, E, W, W, W, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ],},
      {'put': 64, 'flipped': [54],     'flippers': [44], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, G, E, E, E, E, E, E, G, H,
         H, W, E, E, E, E, E, E, G, H,
         H, G, E, E, E, E, E, E, E, H,
         H, A, E, E, G, A, E, E, E, H,
         H, E, E, E, W, W, E, E, E, H,
         H, E, E, E, W, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ],},
    ],
    [
      {'put': 38, 'flipped': [28], 'flippers': [18], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, G, E, E, E, E, E, E, G, H,
         H, W, E, E, E, E, E, E, G, H,
         H, G, E, E, E, E, E, E, A, H,
         H, A, E, E, G, A, E, E, E, H,
         H, E, E, E, B, W, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ],},
      {'put': 43, 'flipped': [44], 'flippers': [45], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, G, E, E, E, E, E, E, G, H,
         H, W, E, E, E, E, E, E, G, H,
         H, G, E, E, E, E, E, E, E, H,
         H, A, E, A, G, A, E, E, E, H,
         H, E, E, E, B, W, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ],},
      {'put': 63, 'flipped': [54], 'flippers': [45], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, G, E, E, E, E, E, E, G, H,
         H, W, E, E, E, E, E, E, G, H,
         H, G, E, E, E, E, E, E, E, H,
         H, A, E, E, G, A, E, E, E, H,
         H, E, E, E, A, W, E, E, E, H,
         H, E, E, A, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ],},
      {'put': 64, 'flipped': [54], 'flippers': [44], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, G, E, E, E, E, E, E, G, H,
         H, W, E, E, E, E, E, E, G, H,
         H, G, E, E, E, E, E, E, E, H,
         H, A, E, E, G, A, E, E, E, H,
         H, E, E, E, A, W, E, E, E, H,
         H, E, E, E, A, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ],},
      {'put': 65, 'flipped': [55], 'flippers': [45], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, G, E, E, E, E, E, E, G, H,
         H, W, E, E, E, E, E, E, G, H,
         H, G, E, E, E, E, E, E, E, H,
         H, A, E, E, G, A, E, E, E, H,
         H, E, E, E, B, A, E, E, E, H,
         H, E, E, E, E, A, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ],},
      {'put': 66, 'flipped': [55], 'flippers': [44], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, G, E, E, E, E, E, E, G, H,
         H, W, E, E, E, E, E, E, G, H,
         H, G, E, E, E, E, E, E, E, H,
         H, A, E, E, G, A, E, E, E, H,
         H, E, E, E, B, A, E, E, E, H,
         H, E, E, E, E, E, A, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ],},
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
    [
      {'put': 71, 'flipped': [61], 'flippers': [51], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, C, E, Y, E, E, E, E, E, H,
         H, Y, E, C, E, E, E, E, E, H,
         H, A, E, A, E, E, E, E, E, H,
         H, W, E, W, E, E, E, E, E, H,
         H, B, E, B, E, E, E, E, E, H,
         H, G, E, G, E, E, E, E, E, H,
         H, B, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ]
      },
      {'put': 73, 'flipped': [63], 'flippers': [53], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, C, E, Y, E, E, E, E, E, H,
         H, Y, E, C, E, E, E, E, E, H,
         H, A, E, A, E, E, E, E, E, H,
         H, W, E, W, E, E, E, E, E, H,
         H, B, E, B, E, E, E, E, E, H,
         H, G, E, G, E, E, E, E, E, H,
         H, E, E, B, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ]
      }
    ],
    [
      {'put': 71, 'flipped': [61, 51, 41, 31, 21], 'flippers': [11], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, C, E, Y, E, E, E, E, E, H,
         H, Y, E, C, E, E, E, E, E, H,
         H, C, E, A, E, E, E, E, E, H,
         H, C, E, W, E, E, E, E, E, H,
         H, C, E, B, E, E, E, E, E, H,
         H, G, E, G, E, E, E, E, E, H,
         H, C, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ]
      },
      {'put': 73, 'flipped': [63, 53, 43, 33],     'flippers': [23], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, C, E, Y, E, E, E, E, E, H,
         H, Y, E, C, E, E, E, E, E, H,
         H, A, E, C, E, E, E, E, E, H,
         H, W, E, C, E, E, E, E, E, H,
         H, B, E, C, E, E, E, E, E, H,
         H, G, E, G, E, E, E, E, E, H,
         H, E, E, C, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ]
      }
    ],
    [
      {'put': 71, 'flipped': [61, 51, 41, 31],     'flippers': [21], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, C, E, Y, E, E, E, E, E, H,
         H, Y, E, C, E, E, E, E, E, H,
         H, Y, E, A, E, E, E, E, E, H,
         H, Y, E, W, E, E, E, E, E, H,
         H, Y, E, B, E, E, E, E, E, H,
         H, G, E, G, E, E, E, E, E, H,
         H, Y, E, E, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ]
      },
      {'put': 73, 'flipped': [63, 53, 43, 33, 23], 'flippers': [13], 'erasable': false,
       'board': [
         H, H, H, H, H, H, H, H, H, H,
         H, C, E, Y, E, E, E, E, E, H,
         H, Y, E, C, E, E, E, E, E, H,
         H, A, E, Y, E, E, E, E, E, H,
         H, W, E, Y, E, E, E, E, E, H,
         H, B, E, Y, E, E, E, E, E, H,
         H, G, E, G, E, E, E, E, E, H,
         H, E, E, Y, E, E, E, E, E, H,
         H, E, E, E, E, E, E, E, E, H,
         H, H, H, H, H, H, H, H, H, H,
       ]
      }
    ],
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
      {'put': 11, 'flipped': [22, 33, 21, 31], 'flippers': [44, 41], 'erasable': true,
       'board':
         [
           H, H, H, H, H, H, H, H, H, H,
           H, E, B, W, R, E, W, W, B, H,
           H, E, E, E, E, B, E, E, E, H,
           H, E, E, E, E, E, E, E, E, H,
           H, E, E, E, E, E, E, E, E, H,
           H, G, E, E, E, E, E, E, E, H,
           H, E, E, E, E, E, E, E, E, H,
           H, E, E, E, E, E, E, E, E, H,
           H, E, E, E, E, E, E, E, E, H,
           H, H, H, H, H, H, H, H, H, H,
         ],
      },
      {'put': 15, 'flipped': [16, 17, 14, 13], 'flippers': [18, 12], 'erasable': true,
       'board':
         [
           H, H, H, H, H, H, H, H, H, H,
           H, E, E, E, E, E, E, E, E, H,
           H, W, W, E, E, B, E, E, E, H,
           H, R, E, G, E, E, E, E, E, H,
           H, B, E, E, B, E, E, E, E, H,
           H, G, E, E, E, E, E, E, E, H,
           H, E, E, E, E, E, E, E, E, H,
           H, E, E, E, E, E, E, E, E, H,
           H, E, E, E, E, E, E, E, E, H,
           H, H, H, H, H, H, H, H, H, H,
         ],
      },
      {'put': 32, 'flipped': [22], 'flippers': [12], 'erasable': false,
       'board':
         [
           H, H, H, H, H, H, H, H, H, H,
           H, E, B, W, R, E, W, W, B, H,
           H, W, B, E, E, B, E, E, E, H,
           H, R, B, G, E, E, E, E, E, H,
           H, B, E, E, B, E, E, E, E, H,
           H, G, E, E, E, E, E, E, E, H,
           H, E, E, E, E, E, E, E, E, H,
           H, E, E, E, E, E, E, E, E, H,
           H, E, E, E, E, E, E, E, E, H,
           H, H, H, H, H, H, H, H, H, H,
         ],
      },
      {'put': 61, 'flipped': [51], 'flippers': [41], 'erasable': false,
       'board':
         [
           H, H, H, H, H, H, H, H, H, H,
           H, E, B, W, R, E, W, W, B, H,
           H, W, W, E, E, B, E, E, E, H,
           H, R, E, G, E, E, E, E, E, H,
           H, B, E, E, B, E, E, E, E, H,
           H, G, E, E, E, E, E, E, E, H,
           H, B, E, E, E, E, E, E, E, H,
           H, E, E, E, E, E, E, E, E, H,
           H, E, E, E, E, E, E, E, E, H,
           H, H, H, H, H, H, H, H, H, H,
         ],
      },
    ],
  ],
}

testBoardMethods([B], TEST_BOARD6, board6Expected, '6');

// - getBitBoard
boards = [TEST_BOARD1, BOARD, TEST_BOARD6];
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
  {  // TEST_BOARD6
    'bits': [
      [0x00000000, 0x00000000],  // 穴
      [0x88375F6F, 0x7FFFFFFF],  // 空き
      [0x41080090, 0x00000000],  // 黒
      [0x26C00000, 0x00000000],  // 白
      [0x00000000, 0x00000000],  // 灰
      [0x00000000, 0x00000000],  // シアン
      [0x00000000, 0x00000000],  // 山吹
      [0x00002000, 0x80000000],  // 緑
      [0x10008000, 0x00000000],  // 赤
    ],
    'size': 8,
    'pageSize': 2,
  },
];
testGetBitBoard(boards, expecteds);

// - getArrayBoard
boards = [TEST_BOARD1, BOARD, TEST_BOARD6];
testGetArrayBoard(boards, boards);

// - bitsToIndexs
bitss = [
  [0x81000000, 0x00000081],
  [0x80400000, 0x00000000, 0x00000020, 0x10000000],
];
sizes = [
  8,
  10,
]
expecteds = [
  [11, 18, 81, 88],
  [13, 22, 121, 130],
];
testBitsToIndexs(bitss, sizes, expecteds);

// - moveToBits
moves = [
  56,
  18,
  91,
];
sizes = [
  8,
  10,
  10,
]
expecteds = [
  [0x00000000, 0x04000000],
  [0x04000000, 0x00000000, 0x00000000, 0x00000000],
  [0x00000000, 0x00000000, 0x20000000, 0x00000000],
];
testMoveToBits(moves, sizes, expecteds);

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

// - getLegalMovesBits
const BOARD4_TOP = [
  H, H, H, H, H, H,
  H, E, E, E, E, H,
  H, W, E, E, W, H,
  H, B, W, E, W, H,
  H, E, B, E, B, H,
  H, H, H, H, H, H,
];
const BOARD4_BOTTOM = [
  H, H, H, H, H, H,
  H, W, E, W, E, H,
  H, B, E, B, W, H,
  H, B, E, E, B, H,
  H, E, B, E, E, H,
  H, H, H, H, H, H,
];
const BOARD6_TOP = [
  H, H, H, H, H, H, H, H,
  H, E, E, E, E, E, E, H,
  H, E, W, E, E, E, W, H,
  H, E, B, E, W, E, W, H,
  H, W, E, E, W, E, W, H,
  H, B, W, E, W, E, W, H,
  H, E, B, E, B, E, B, H,
  H, H, H, H, H, H, H, H,
];
const BOARD6_BOTTOM = [
  H, H, H, H, H, H, H, H,
  H, W, W, W, W, W, W, H,
  H, B, B, B, B, E, E, H,
  H, B, B, B, E, W, W, H,
  H, B, B, E, W, B, B, H,
  H, B, E, W, W, E, B, H,
  H, E, W, W, W, E, E, H,
  H, H, H, H, H, H, H, H,
];
const BOARD6_LEFT = [
  H, H, H, H, H, H, H, H,
  H, E, E, E, E, E, E, H,
  H, E, W, W, W, W, B, H,
  H, E, E, E, E, E, E, H,
  H, E, W, W, W, W, B, H,
  H, E, E, E, E, E, E, H,
  H, E, W, W, W, W, B, H,
  H, H, H, H, H, H, H, H,
];
const BOARD6_RIGHT = [
  H, H, H, H, H, H, H, H,
  H, E, E, E, E, E, E, H,
  H, B, W, W, W, W, E, H,
  H, E, E, E, E, E, E, H,
  H, B, W, W, W, W, E, H,
  H, E, E, E, E, E, E, H,
  H, B, W, W, W, W, E, H,
  H, H, H, H, H, H, H, H,
];
const BOARD10_TEST1 = [
  H, H, H, H, H, H, H, H, H, H, H, H,
  H, H, H, H, H, E, E, H, H, H, H, H,
  H, H, H, H, E, E, E, E, H, H, H, H,
  H, H, H, E, E, E, E, E, E, H, H, H,
  H, H, E, E, E, E, C, E, E, E, H, H,
  H, E, E, E, E, E, B, E, E, E, E, H,
  H, E, E, E, E, E, W, E, E, E, E, H,
  H, H, E, E, E, E, G, E, E, E, H, H,
  H, H, H, E, E, E, E, E, E, H, H, H,
  H, H, H, H, E, E, E, E, H, H, H, H,
  H, H, H, H, H, E, E, H, H, H, H, H,
  H, H, H, H, H, H, H, H, H, H, H, H,
];
const BOARD10_TEST2 = [
  H, H, H, H, H, H, H, H, H, H, H, H,
  H, E, E, E, E, E, E, E, E, E, E, H,
  H, E, B, E, E, E, B, E, E, C, E, H,
  H, A, E, E, E, B, E, E, C, E, E, H,
  H, E, E, E, B, E, E, C, E, E, E, H,
  H, E, E, B, E, E, C, E, E, W, E, H,
  H, E, B, E, E, C, E, E, W, E, E, H,
  H, A, E, E, C, E, E, W, E, E, E, H,
  H, E, E, C, E, E, W, E, E, E, E, H,
  H, E, C, E, E, W, E, E, E, W, E, H,
  H, A, E, E, A, E, E, E, A, E, E, H,
  H, H, H, H, H, H, H, H, H, H, H, H,
];
turns = [B, W, B, W, B, W, B, W, B, W, B, W, B, B, A, A];
boards = [
  BOARD4,
  BOARD4,
  BOARD6,
  BOARD6,
  BOARD8,
  BOARD8,
  BOARD10,
  BOARD10,
  BOARD4_TOP,
  BOARD4_BOTTOM,
  BOARD6_TOP,
  BOARD6_BOTTOM,
  BOARD6_LEFT,
  BOARD6_RIGHT,
  BOARD10_TEST1,
  BOARD10_TEST2,
];
expecteds = [
  [0x48120000],
  [0x21840000],
  [0x00840210, 0x00000000],
  [0x00409020, 0x00000000],
  [0x00001020, 0x04080000],
  [0x00000804, 0x20100000],
  [0x00000000, 0x20100080, 0x40000000, 0x00000000],
  [0x00000000, 0x10020400, 0x80000000, 0x00000000],
  [0x94200000],
  [0x04290000],
  [0x44481020, 0x00000000],
  [0x0001084A, 0x10000000],
  [0x02002002, 0x00000000],
  [0x00100100, 0x10000000],
  [0x00000040, 0x00000000, 0x00000000, 0x00000000],
  [0x22400000, 0x01000000, 0x00010000, 0x00000000],
];
testGetLegalMovesBits(turns, boards, expecteds);

// - getFlippablesAtIndexBits
const BOARD4_F1 = [
  H, H, H, H, H, H,
  H, E, W, W, B, H,
  H, W, W, E, E, H,
  H, W, E, W, E, H,
  H, B, B, E, B, H,
  H, H, H, H, H, H,
];
const BOARD4_F2 = [
  H, H, H, H, H, H,
  H, W, E, W, W, H,
  H, E, B, E, B, H,
  H, E, E, B, B, H,
  H, W, B, B, E, H,
  H, H, H, H, H, H,
];
const BOARD6_F1 = [
  H, H, H, H, H, H, H, H,
  H, E, W, W, W, W, B, H,
  H, W, W, B, E, E, W, H,
  H, W, E, W, W, B, W, H,
  H, W, E, W, W, W, W, H,
  H, W, B, W, W, W, E, H,
  H, B, E, E, E, E, B, H,
  H, H, H, H, H, H, H, H,
];
const BOARD6_F2 = [
  H, H, H, H, H, H, H, H,
  H, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, H,
  H, E, E, W, E, E, E, H,
  H, E, E, B, E, E, E, H,
  H, E, E, B, E, B, B, H,
  H, W, B, E, W, E, W, H,
  H, H, H, H, H, H, H, H,
];
const BOARD8_F1 = [
  H, H, H, H, H, H, H, H, H, H,
  H, B, E, E, B, E, E, E, E, H,
  H, W, W, E, W, E, E, E, B, H,
  H, W, B, W, W, E, B, W, E, H,
  H, W, E, W, W, W, W, B, B, H,
  H, W, E, E, E, W, E, W, E, H,
  H, W, E, E, W, E, W, W, E, H,
  H, W, E, W, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, H,
  H, H, H, H, H, H, H, H, H, H,
];
const BOARD8_F2 = [
  H, H, H, H, H, H, H, H, H, H,
  H, E, E, E, E, E, E, E, E, H,
  H, B, B, E, E, E, E, B, B, H,
  H, B, E, B, E, E, B, E, B, H,
  H, B, E, E, B, B, B, E, B, H,
  H, B, B, W, B, B, B, W, W, H,
  H, B, B, B, E, B, B, E, E, H,
  H, B, B, E, W, E, W, B, E, H,
  H, W, W, E, E, E, E, E, W, H,
  H, H, H, H, H, H, H, H, H, H,
];
const BOARD10_F1 = [
  H, H, H, H, H, H, H, H, H, H, H, H,
  H, E, E, E, E, E, E, E, E, B, B, H,
  H, W, B, W, E, E, E, E, W, W, W, H,
  H, W, E, W, E, E, E, W, W, E, W, H,
  H, W, E, B, W, E, E, W, E, E, W, H,
  H, W, E, E, E, W, W, E, E, E, W, H,
  H, W, E, E, E, W, W, E, E, E, W, H,
  H, W, E, W, W, W, W, W, W, B, W, H,
  H, W, E, W, E, E, E, E, W, E, W, H,
  H, W, E, E, E, E, E, E, E, W, W, H,
  H, B, W, W, W, W, W, W, W, W, E, H,
  H, H, H, H, H, H, H, H, H, H, H, H,
];
const BOARD10_F2 = [
  H, H, H, H, H, H, H, H, H, H, H, H,
  H, E, B, B, B, B, B, B, B, B, W, H,
  H, E, B, E, E, E, E, E, E, E, E, H,
  H, E, E, B, E, E, B, B, W, B, E, H,
  H, E, W, E, B, B, E, B, B, E, E, H,
  H, E, E, B, B, B, E, B, B, E, E, H,
  H, E, E, B, B, E, B, B, B, E, E, H,
  H, E, B, E, E, B, E, B, B, E, E, H,
  H, W, E, E, B, E, B, B, B, E, E, H,
  H, E, E, B, E, E, E, B, B, B, E, H,
  H, E, W, E, E, E, E, W, E, E, W, H,
  H, H, H, H, H, H, H, H, H, H, H, H,
];
const BOARD12_F1 = [
  H, H, H, H, H, H, H, H, H, H, H, H, H, H,
  H, E, W, W, W, W, W, W, W, W, W, W, B, H,
  H, W, W, E, E, E, E, E, E, E, E, W, W, H,
  H, W, B, W, E, E, E, E, E, E, W, E, W, H,
  H, W, E, W, W, E, E, E, E, W, W, E, W, H,
  H, W, E, E, W, W, E, E, W, W, E, E, W, H,
  H, W, E, E, E, W, W, W, W, E, E, E, W, H,
  H, W, E, E, E, E, W, W, E, E, E, E, W, H,
  H, W, E, E, E, W, W, W, W, E, E, E, W, H,
  H, W, E, E, W, W, E, E, W, W, E, E, W, H,
  H, W, E, W, W, E, E, E, E, W, W, E, W, H,
  H, W, E, B, E, E, E, E, E, E, E, B, W, H,
  H, B, W, W, W, W, W, W, W, W, W, W, E, H,
  H, H, H, H, H, H, H, H, H, H, H, H, H, H,
];
const TEST_WILDCARD1 = [
  H, H, H, H, H, H, H, H, H, H, H, H,
  H, E, W, A, C, Y, G, G, B, G, G, H,
  H, G, G, E, E, E, E, E, E, E, G, H,
  H, W, E, G, E, E, E, E, E, E, G, H,
  H, G, E, E, G, E, E, E, E, E, G, H,
  H, W, E, E, E, G, E, E, E, E, G, H,
  H, G, E, E, E, E, E, E, E, E, W, H,
  H, W, E, E, E, E, E, G, E, E, W, H,
  H, G, E, E, E, E, E, E, G, E, W, H,
  H, W, E, E, E, E, E, E, E, G, W, H,
  H, G, G, G, G, B, B, G, G, G, E, H,
  H, H, H, H, H, H, H, H, H, H, H, H,
];
const TEST_WILDCARD2 = [
  H, H, H, H, H, H, H, H,
  H, E, E, E, E, E, E, H,
  H, E, G, G, G, E, E, H,
  H, E, G, E, G, E, E, H,
  H, E, G, G, G, E, E, H,
  H, E, B, E, E, E, E, H,
  H, E, E, E, E, E, E, H,
  H, H, H, H, H, H, H, H,
];
const TEST_BOMB1 = [
  H, H, H, H, H, H, H, H, H, H, H, H,
  H, E, W, W, R, B, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, E, E, H,
  H, E, E, E, E, E, E, E, E, E, E, H,
  H, H, H, H, H, H, H, H, H, H, H, H,
];
const DEBUG1 = [
  H, H, H, H, H, H, H, H, H, H, H, H,
  H, H, H, H, H, E, E, H, H, H, H, H,
  H, H, H, H, E, E, R, E, H, H, H, H,
  H, H, H, E, E, E, E, W, E, H, H, H,
  H, H, E, E, E, G, C, E, E, E, H, H,
  H, E, R, B, Y, B, B, G, E, E, E, H,
  H, E, E, E, G, B, W, Y, E, R, E, H,
  H, H, E, E, E, C, G, E, B, E, H, H,
  H, H, H, E, E, E, E, E, E, H, H, H,
  H, H, H, H, E, R, E, E, H, H, H, H,
  H, H, H, H, H, E, E, H, H, H, H, H,
  H, H, H, H, H, H, H, H, H, H, H, H,
];
const DEBUG2 = [
  H, H, H, H, H, H, H, H, H, H, H, H,
  H, H, H, H, H, E, E, H, H, H, H, H,
  H, H, H, H, E, E, R, E, H, H, H, H,
  H, H, H, E, B, E, E, E, E, H, H, H,
  H, H, E, E, E, G, C, E, E, E, H, H,
  H, E, R, E, Y, W, B, G, E, E, E, H,
  H, E, E, E, G, W, W, Y, E, R, E, H,
  H, H, E, E, E, C, G, E, E, E, H, H,
  H, H, H, E, E, W, E, E, E, H, H, H,
  H, H, H, H, E, R, E, E, H, H, H, H,
  H, H, H, H, H, E, E, H, H, H, H, H,
  H, H, H, H, H, H, H, H, H, H, H, H,
];
const DEBUG3 = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 1, 1, 8, 1, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0,
  0, 0, 1, 1, 3, 7, 5, 1, 1, 1, 0, 0,
  0, 1, 8, 1, 6, 3, 2, 7, 1, 1, 1, 0,
  0, 1, 1, 1, 7, 2, 2, 6, 1, 8, 1, 0,
  0, 0, 1, 1, 1, 5, 7, 1, 1, 1, 0, 0,
  0, 0, 0, 1, 2, 1, 1, 1, 1, 0, 0, 0,
  0, 0, 0, 0, 1, 8, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];
const DEBUG4 = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 1, 1, 8, 1, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0,
  0, 0, 1, 1, 1, 7, 5, 1, 1, 1, 0, 0,
  0, 1, 8, 1, 6, 3, 3, 7, 3, 3, 1, 0,
  0, 1, 1, 1, 7, 2, 3, 6, 1, 8, 1, 0,
  0, 0, 1, 1, 1, 5, 7, 1, 1, 1, 0, 0,
  0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0,
  0, 0, 0, 0, 1, 8, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];
const DEBUG5 = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 1, 1, 8, 1, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 2, 1, 1, 1, 0, 0, 0,
  0, 0, 1, 2, 2, 7, 5, 1, 1, 1, 0, 0,
  0, 1, 8, 1, 6, 3, 2, 7, 1, 1, 1, 0,
  0, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 0,
  0, 0, 1, 3, 3, 5, 7, 3, 1, 1, 0, 0,
  0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0,
  0, 0, 0, 0, 1, 8, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];
const DEBUG6 = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 2, 3, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 3, 3, 3, 1, 0, 0, 0, 0,
  0, 0, 0, 3, 3, 3, 3, 1, 3, 0, 0, 0,
  0, 0, 1, 3, 3, 7, 3, 3, 1, 1, 0, 0,
  0, 1, 1, 3, 6, 3, 3, 7, 2, 2, 2, 0,
  0, 3, 3, 3, 7, 3, 1, 6, 1, 1, 1, 0,
  0, 0, 3, 3, 3, 5, 2, 2, 2, 2, 0, 0,
  0, 0, 0, 3, 3, 3, 3, 3, 3, 0, 0, 0,
  0, 0, 0, 0, 3, 3, 1, 3, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];
const DEBUG7 = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 3, 1, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 3, 3, 3, 1, 0, 0, 0, 0,
  0, 0, 0, 3, 2, 3, 3, 3, 2, 0, 0, 0,
  0, 0, 3, 2, 3, 2, 5, 2, 2, 2, 0, 0,
  0, 3, 2, 3, 6, 3, 3, 7, 2, 3, 2, 0,
  0, 2, 3, 2, 7, 2, 3, 6, 2, 3, 3, 0,
  0, 0, 2, 3, 3, 5, 7, 3, 2, 3, 0, 0,
  0, 0, 0, 3, 3, 3, 3, 3, 3, 0, 0, 0,
  0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];
turns = [
  B, B, W, W,
  B, B, B, B, W, W,
  B, B, B, B, B, W, W, W, W, W, W,
  B, B, B, B, B, B, W, W, W, W,
  B,
  B, B, B, B, B,
  B, W, B, B,
  B,  // TEST_BOMB1
  W,  // DEBUG1
  B,  // DEBUG2
  B,  // DEBUG3
  B,  // DEBUG4
  W,  // DEBUG5
  B,  // DEBUG6
  B,  // DEBUG7
];
boards = [
  BOARD4_F1,       // 1
  BOARD4_F1,       // 2
  BOARD4_F2,       // 3
  BOARD4_F2,       // 4
  BOARD6_F1,       // 5
  BOARD6_F1,       // 6
  BOARD6_F1,       // 7
  BOARD6_F1,       // 8
  BOARD6_F2,       // 9
  BOARD6_F2,       // 10
  BOARD8_F1,       // 11
  BOARD8_F1,       // 12
  BOARD8_F1,       // 13
  BOARD8_F1,       // 14
  BOARD8_F1,       // 15
  BOARD8_F2,       // 16
  BOARD8_F2,       // 17
  BOARD8_F2,       // 18
  BOARD8_F2,       // 19
  BOARD8_F2,       // 20
  BOARD8_F2,       // 21
  BOARD10_F1,      // 22
  BOARD10_F1,      // 23
  BOARD10_F1,      // 24
  BOARD10_F1,      // 25
  BOARD10_F1,      // 26
  BOARD10_F1,      // 27
  BOARD10_F2,      // 28
  BOARD10_F2,      // 29
  BOARD10_F2,      // 30
  BOARD10_F2,      // 31
  TEST_BOARD1,     // 32
  BOARD12_F1,      // 33
  BOARD12_F1,      // 34
  BOARD12_F1,      // 35
  BOARD12_F1,      // 36
  BOARD12_F1,      // 37
  TEST_WILDCARD1,  // 38
  TEST_WILDCARD1,  // 39
  TEST_WILDCARD1,  // 40
  TEST_WILDCARD2,  // 41
  TEST_BOMB1,      // 42
  DEBUG1,          // 43
  DEBUG2,          // 44
  DEBUG3,          // 45
  DEBUG4,          // 46
  DEBUG5,          // 47
  DEBUG6,          // 48
  DEBUG7,          // 49
];
indexs = [
  [0x80000000],                                                  // 1
  [0x01000000],                                                  // 2
  [0x00800000],                                                  // 3
  [0x00010000],                                                  // 4
  [0x80000000, 0x00000000],                                      // 5
  [0x00200000, 0x00000000],                                      // 6
  [0x00000004, 0x00000000],                                      // 7
  [0x00000001, 0x00000000],                                      // 8
  [0x00000100, 0x00000000],                                      // 9
  [0x00000000, 0x80000000],                                      // 10
  [0x00000000, 0x10000000],                                      // 11
  [0x00000000, 0x00000800],                                      // 12
  [0x00000000, 0x00000200],                                      // 13
  [0x00000000, 0x00000080],                                      // 14
  [0x00000000, 0x00000040],                                      // 15
  [0x80000000, 0x00000000],                                      // 16
  [0x01000000, 0x00000000],                                      // 17
  [0x00000800, 0x00000000],                                      // 18
  [0x00000040, 0x00000000],                                      // 19
  [0x00000020, 0x00000000],                                      // 20
  [0x00000002, 0x00000000],                                      // 21
  [0x80000000, 0x00000000, 0x00000000, 0x00000000],              // 22
  [0x20000000, 0x00000000, 0x00000000, 0x00000000],              // 23
  [0x00000000, 0x10000000, 0x00000000, 0x00000000],              // 24
  [0x00000000, 0x00000004, 0x00000000, 0x00000000],              // 25
  [0x00000000, 0x00000000, 0x00004000, 0x00000000],              // 26
  [0x00000000, 0x00000000, 0x00000000, 0x10000000],              // 27
  [0x80000000, 0x00000000, 0x00000000, 0x00000000],              // 28
  [0x00001000, 0x00000000, 0x00000000, 0x00000000],              // 29
  [0x00008000, 0x00000000, 0x00000000, 0x00000000],              // 30
  [0x00000000, 0x00000000, 0x00000000, 0x40000000],              // 31
  [0x00001000, 0x00000000],                                      // 32
  [0x80000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000],  // 33
  [0x00000000, 0x20000000, 0x00000000, 0x00000000, 0x00000000],  // 34
  [0x00000000, 0x00000000, 0x00000000, 0x00000040, 0x00000000],  // 35
  [0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x40000000],  // 36
  [0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00010000],  // 37
  [0x80000000, 0x00000000, 0x00000000, 0x00000000],              // 38
  [0x00000000, 0x00000100, 0x00000000, 0x00000000],              // 39
  [0x00000000, 0x00000000, 0x00000000, 0x10000000],              // 40
  [0x00020000, 0x00000000],                                      // 41
  [0x80000000, 0x00000000, 0x00000000, 0x00000000],              // 42
  [0x00000001, 0x00000000, 0x00000000, 0x00000000],              // 43
  [0x00000000, 0x00000000, 0x00100000, 0x00000000],              // 44
  [0x00000000, 0x80000000, 0x00000000, 0x00000000],              // 45
  [0x00000000, 0x00004000, 0x00000000, 0x00000000],              // 46
  [0x00020000, 0x00000000, 0x00000000, 0x00000000],              // 47
  [0x00000000, 0x00000100, 0x00000000, 0x00000000],              // 48
  [0x04000000, 0x00000000, 0x00000000, 0x00000000],              // 49
];
expecteds = [
  {'flippables': [0x6CA00000], 'flippers': [0x10090000], 'erasable': false},                                                                                                  // 1
  {'flippables': [0x00200000], 'flippers': [0x00040000], 'erasable': false},                                                                                                  // 2
  {'flippables': [0x04000000], 'flippers': [0x20000000], 'erasable': false},                                                                                                  // 3
  {'flippables': [0x05360000], 'flippers': [0x90080000], 'erasable': false},                                                                                                  // 4
  {'flippables': [0x7B0A2488, 0x00000000], 'flippers': [0x04000002, 0x10000000], 'erasable': false},                                                                          // 5
  {'flippables': [0x00010800, 0x00000000], 'flippers': [0x00000040, 0x00000000], 'erasable': false},                                                                          // 6
  {'flippables': [0x00114338, 0x00000000], 'flippers': [0x04800040, 0x00000000], 'erasable': false},                                                                          // 7
  {'flippables': [0x00000420, 0x00000000], 'flippers': [0x00008000, 0x00000000], 'erasable': false},                                                                          // 8
  {'flippables': [0x0000000C, 0x00000000], 'flippers': [0x00000000, 0x50000000], 'erasable': false},                                                                          // 9
  {'flippables': [0x00000821, 0x00000000], 'flippers': [0x00020002, 0x00000000], 'erasable': false},                                                                          // 10
  {'flippables': [0x00101038, 0x00000000], 'flippers': [0x10004400, 0x00000000], 'erasable': false},                                                                          // 11
  {'flippables': [0x00000000, 0x02040000], 'flippers': [0x00000001, 0x00000000], 'erasable': false},                                                                          // 12
  {'flippables': [0x00402010, 0x0A060000], 'flippers': [0x80000002, 0x00000000], 'erasable': false},                                                                          // 13
  {'flippables': [0x00808080, 0x80808000], 'flippers': [0x80000000, 0x00000000], 'erasable': false},                                                                          // 14
  {'flippables': [0x00000204, 0x08102000], 'flippers': [0x00010000, 0x00000000], 'erasable': false},                                                                          // 15
  {'flippables': [0x00C0A090, 0x88848200], 'flippers': [0x00000000, 0x00000081], 'erasable': false},                                                                          // 16
  {'flippables': [0x00030509, 0x10204000], 'flippers': [0x00000000, 0x01000080], 'erasable': false},                                                                          // 17
  {'flippables': [0x00000014, 0x00000000], 'flippers': [0x00000000, 0x22000000], 'erasable': false},                                                                          // 18
  {'flippables': [0x00000000, 0x40404000], 'flippers': [0x00000000, 0x00000040], 'erasable': false},                                                                          // 19
  {'flippables': [0x00000000, 0x10080000], 'flippers': [0x00000000, 0x00000400], 'erasable': false},                                                                          // 20
  {'flippables': [0x00000000, 0x04080000], 'flippers': [0x00000000, 0x00001000], 'erasable': false},                                                                          // 21
  {'flippables': [0x00200802, 0x00802008, 0x02008000, 0x00000000], 'flippers': [0x00000000, 0x00000000, 0x00000020, 0x00000000], 'erasable': false},                          // 22
  {'flippables': [0x00080200, 0x00000000, 0x00000000, 0x00000000], 'flippers': [0x00000000, 0x80000000, 0x00000000, 0x00000000], 'erasable': false},                          // 23
  {'flippables': [0x00004020, 0x00000000, 0x00000000, 0x00000000], 'flippers': [0x00800000, 0x00000000, 0x00000000, 0x00000000], 'erasable': false},                          // 24
  {'flippables': [0x00000000, 0x00000003, 0xF0000000, 0x00000000], 'flippers': [0x00000000, 0x00000000, 0x08000000, 0x00000000], 'erasable': false},                          // 25
  {'flippables': [0x00002010, 0x08040201, 0x00800000, 0x00000000], 'flippers': [0x00400000, 0x00000000, 0x00000000, 0x00000000], 'erasable': false},                          // 26
  {'flippables': [0x00001204, 0x41084110, 0x240500DF, 0xE0000000], 'flippers': [0x00500000, 0x00000000, 0x00000020, 0x00000000], 'erasable': false},                          // 27
  {'flippables': [0x7F900200, 0x40080100, 0x20040080, 0x00000000], 'flippers': [0x00400000, 0x00000000, 0x00000000, 0x10000000], 'erasable': false},                          // 28
  {'flippables': [0x00000008, 0x04020100, 0x80402000, 0x00000000], 'flippers': [0x00000000, 0x00000000, 0x00000010, 0x00000000], 'erasable': false},                          // 29
  {'flippables': [0x00000060, 0x28120884, 0x20080200, 0x00000000], 'flippers': [0x00000000, 0x00000000, 0x02000000, 0x80000000], 'erasable': false},                          // 30
  {'flippables': [0x00000000, 0x04210440, 0x90140300, 0x00000000], 'flippers': [0x00000011, 0x00000000, 0x00000000, 0x00000000], 'erasable': false},                          // 31
  {'flippables': [0x00000010, 0x00000000], 'flippers': [0x00000000, 0x10000000], 'erasable': false},                                                                          // 32
  {'flippables': [0x7FEC00A0, 0x09008808, 0x40820810, 0x80880480, 0x00000000], 'flippers': [0x00100000, 0x00000000, 0x00000000, 0x00000000, 0x28000000], 'erasable': false},  // 33
  {'flippables': [0x00000000, 0x00040080, 0x10020040, 0x08010000, 0x00000000], 'flippers': [0x00000000, 0x00000000, 0x00000000, 0x00000020, 0x00000000], 'erasable': false},  // 34
  {'flippables': [0x00000200, 0x40080100, 0x20040080, 0x10020000, 0x00000000], 'flippers': [0x00100000, 0x00000000, 0x00000000, 0x00000000, 0x00000000], 'erasable': false},  // 35
  {'flippables': [0x00000000, 0x02001000, 0x80040020, 0x01000800, 0x00000000], 'flippers': [0x00000040, 0x00000000, 0x00000000, 0x00000000, 0x00000000], 'erasable': false},  // 36
  {'flippables': [0x00000100, 0x10010010, 0x01001001, 0x00100100, 0x17FE0000], 'flippers': [0x00100000, 0x00000000, 0x00000000, 0x00000000, 0x08000000], 'erasable': false},  // 37
  {'flippables': [0x7E300A02, 0x40802008, 0x02008000, 0x00000000], 'flippers': [0x01000000, 0x00080000, 0x00000020, 0x00000000], 'erasable': false},                          // 38
  {'flippables': [0x00000200, 0x40080000, 0x20040000, 0x00000000], 'flippers': [0x00100000, 0x00000000, 0x00000080, 0x00000000], 'erasable': false},                          // 39
  {'flippables': [0x00001004, 0x01004010, 0x040500C0, 0xE0000000], 'flippers': [0x00400000, 0x00000000, 0x20000001, 0x00000000], 'erasable': false},                          // 40
  {'flippables': [0x00000000, 0x00000000], 'flippers': [0x00000000, 0x00000000], 'erasable': false},                                                                          // 41
  {'flippables': [0x70000000, 0x00000000, 0x00000000, 0x00000000], 'flippers': [0x08000000, 0x00000000, 0x00000000, 0x00000000], 'erasable': true},                           // 42
  {'flippables': [0x00000000, 0x00200000, 0x00000000, 0x00000000], 'flippers': [0x00000000, 0x00000400, 0x00000000, 0x00000000], 'erasable': false},                          // 43
  {'flippables': [0x00000000, 0x00000100, 0xC0000000, 0x00000000], 'flippers': [0x00000000, 0x00040400, 0x00000000, 0x00000000], 'erasable': false},                          // 44
  {'flippables': [0x00000000, 0x40100000, 0x00000000, 0x00000000], 'flippers': [0x00000000, 0x20000200, 0x00000000, 0x00000000], 'erasable': false},                          // 45
  {'flippables': [0x00000000, 0x00018000, 0x00000000, 0x00000000], 'flippers': [0x00000000, 0x00020000, 0x00000000, 0x00000000], 'erasable': false},                          // 46
  {'flippables': [0x00000080, 0x20000000, 0x00000000, 0x00000000], 'flippers': [0x00000000, 0x00080000, 0x00000000, 0x00000000], 'erasable': false},                          // 47
  {'flippables': [0x00000000, 0x00000200, 0x00000000, 0x00000000], 'flippers': [0x00000000, 0x00000400, 0x00000000, 0x00000000], 'erasable': false},                          // 48
  {'flippables': [0x00030040, 0x10040100, 0x00000000, 0x00000000], 'flippers': [0x00000100, 0x00000000, 0x40000000, 0x00000000], 'erasable': false},                          // 49
];
testGetFlippablesAtIndexBits(turns, boards, indexs, expecteds);

boards = [
//  BOARD4,
//  BOARD6,
//  BOARD8,
  BOARD,
//  BOARD12,
];
orders = [
  [B, W],
  [B, W],
  [B, W],
  ORDER,
  [B, W],
];
cutins  = [
  {},
  {},
  {},
  CUTINS,
  {},
];
//testGetLegalMovesArray(boards, orders, cutins, 1);
//testGetFlippablesAtIndexArray(boards, orders, cutins, 1);

// - popcount
bits = [
  [0x00000001],
  [0x00010001],
  [0xFFFFFFFF],
  [0xFFFFFFFF, 0x11111111],
  [0xFFFFFFFF, 0x11111111, 0x88888888, 0x22222222],
];
expecteds = [
  1,
  2,
  32,
  40,
  56,
];
testPopcount(bits, expecteds);

// testPutDiscBits
testPutDiscBits([B], TEST_BOARD6, board6Expected['putDisc'], 'putDiscBits');
