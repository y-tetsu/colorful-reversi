console.log('[player_test.js]');

// Player
let game = new Game(TEST_BOARD1, B, 'no use', 'no use');
let player = new Player('unknown');
assertEqual(player.actMove(game), [], 'Player 1');

game = new Game(TEST_BOARD1, B, 'no use', 'no use');
player = new Player(HUMAN);
game.humanMove = 34;
assertEqual(player.actMove(game), [44, 34], 'Player 2');

game = new Game(TEST_BOARD1, B, 'no use', 'no use');
player = new Player(RANDOM);
assertIncludes(player.actMove(game), [[44, 34], [44, 43], [55, 56], [55, 65]], 'Player 3');

// getMoveByHuman
game = new Game(TEST_BOARD1, B, 'no use', 'no use');
let move = getMoveByHuman(game);
assertEqual(move, NO_MOVE, 'getMoveByHuman 1');

game.humanMove = 1;
move = getMoveByHuman(game);
assertEqual(move, 1, 'getMoveByHuman 2');
assertEqual(game.humanMove, NO_MOVE, 'getMoveByHuman 3');

// getMoveByRandom
for (let i=0; i<10; i++) {
  let move = getMoveByRandom(new Game(TEST_BOARD1, B, 'no use', 'no use'));
  assertEqual(getLegalMoves(B, TEST_BOARD1).includes(move), true, 'getMoveByRandom ' + (i + 1));
}
