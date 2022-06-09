console.log('[simulator.js]');

players = [
  [MCS,    RANDOM, RANDOM],
  [RANDOM, MCS,    RANDOM],
  [RANDOM, RANDOM, MCS],
];

// simulator
function simulator(players, board, order, cutins, num) {
  const startTime = performance.now();
  console.log('------------------------------');
  console.log('start at ' + startTime.toFixed(3));
  console.log(order.map(e => getGameTurnText(e)).join(' : ') + ' (' + num + ' matches)');
  for (let player of players) {
    console.log(player.join(' : '));
    let result = {};
    for (let color of order) {
      result[color] = 0;
    }
    for (let i=0; i<num; i++) {
      let flippers = {};
      for (let key in FLIPPERS) {
        flippers[key] = Object.assign({}, FLIPPERS[key]);
      }
      let j = 0;
      for (let color of order) {
        flippers[color].player = new Player(player[j]);
        j++;
      }
      const game = new Game(board, order, flippers, cutins);
      while (game.play() === GAME_PLAY);
      game.updateScore();
      const winner = game.getWinner();
      if (winner in result) result[winner]++;
    }
    console.log('= ' + order.map(e => result[e]).join(' : '));
  }
  const endTime = performance.now();
  console.log('end at ' + endTime.toFixed(3) + ' (' + ((endTime - startTime) / 1000).toFixed(3) + 's)');
}


// ui
const start = document.getElementById('start');
start.addEventListener('click', onStartClicked);

function onStartClicked(event) {
  const num = document.getElementById('num').value;
  start.disabled = true;
  alert('start ' + num + ' matches simulation.');
  simulator(players, BOARD, ORDER, CUTINS, num);
  start.disabled = false;
}

