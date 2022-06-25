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
  const elapsed = endTime - startTime;
  console.log('end at ' + endTime.toFixed(3) + ' (' + msToSec(elapsed) + 's)');
  //--- 時間計測 ---//
  //console.log('total of getLegalMovesBits    ' + msToSec(measure[0].total) + '(s) ' + (measure[0].total / elapsed * 100).toFixed(1) + '(%)');
  //console.log('total of bitsToIndexs         ' + msToSec(measure[1].total) + '(s) ' + (measure[1].total / elapsed * 100).toFixed(1) + '(%)');
  //console.log('total of getFlippablesAtIndex ' + msToSec(measure[2].total) + '(s) ' + (measure[2].total / elapsed * 100).toFixed(1) + '(%)');
  //console.log('total of putDisc              ' + msToSec(measure[3].total) + '(s) ' + (measure[3].total / elapsed * 100).toFixed(1) + '(%)');
  //console.log('total of updateScore          ' + msToSec(measure[4].total) + '(s) ' + (measure[4].total / elapsed * 100).toFixed(1) + '(%)');
  //console.log('total of getBitBoard          ' + msToSec(measure[5].total) + '(s) ' + (measure[5].total / elapsed * 100).toFixed(1) + '(%)');
  //console.log('total of getLegalMovesBits1   ' + msToSec(measure[6].total) + '(s) ' + (measure[6].total / elapsed * 100).toFixed(1) + '(%)');
  //console.log('total of getLegalMovesBits2   ' + msToSec(measure[7].total) + '(s) ' + (measure[7].total / elapsed * 100).toFixed(1) + '(%)');
  //--- 時間計測 ---//
}

function msToSec(ms) {
  return (ms / 1000).toFixed(3);
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

