let turns = null;
let indexs = null;
let moves = null;
let passs = null;
let winners = null;
let scores = null;
let players = null;
let playerNexts = null;
let playerPres = null;
let legalTopNexts = null;
let legalBottomPres = null;
let horizontals = null;
let verticals = null;
let blanks = null;
let messages = null;
let sizes = null;
let bitss = null;
let counts = null;
let orders = null;
let bits = null;
let expecteds = null;
let waits = null;
let total = '  OK   (total)';

// assertEqual
function assertEqual(first, second, name) {
  let result = '  OK   (' + name + ')';
  first = JSON.stringify(first);
  second = JSON.stringify(second);
  if (first != second) {
    result = '* NG * (' + name + ')\n' + 'first != second' + '\n' + 'first = ' + first + '\n' + 'second = ' + second;
    total = '* NG * (total)';
  }
  console.log(result);
};

// assertNotEqual
function assertNotEqual(first, second, name) {
  let result = '  OK   (' + name + ')';
  first = JSON.stringify(first);
  second = JSON.stringify(second);
  if (first == second) {
    result = '* NG * (' + name + ')\n' + 'first == second' + '\n' + 'first = ' + first + '\n' + 'second = ' + second;
    total = '* NG * (total)';
  }
  console.log(result);
};

// assertIncludes
function assertIncludes(first, second, name) {
  let result = '  OK   (' + name + ')';
  first = JSON.stringify(first);
  second = second.map(e => JSON.stringify(e));
  if (!second.includes(first)) {
    result = '* NG * (' + name + ')\n' + 'second not includes first' + '\n' + 'first = ' + first + '\n' + 'second = ' + second;
    total = '* NG * (total)';
  }
  console.log(result);
};
