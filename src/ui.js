const UI_BOARD = 'ui_board';
const UI_PLAYER_INFO = {
  [B]: {
    'name': 'Black',
    'img' : './image/black.png',
  },
  [W]: {
    'name': 'White',
    'img' : './image/white.png',
  },
  [A]: {
    'name': 'Ash',
    'img' : './image/ash.png',
  },
  [C]: {
    'name': 'Cyan',
    'img' : './image/cyan.png',
  },
  [Y]: {
    'name': 'Yamabuki',
    'img' : './image/yamabuki.png',
  },
  [G]: {
    'name': 'Green',
    'img' : './image/green.png',
  },
};
const BOARD_SIZE = Math.sqrt(BOARD.length);
const PLAYABLE_SIZE = BOARD_SIZE - 2;
const BOARD_ELEMENT_NUM = BOARD_SIZE * BOARD_SIZE;
const PLAYABLE_START = BOARD_SIZE + 1;
const PLAYABLE_END = (BOARD_SIZE + 1) * PLAYABLE_SIZE;
const PLAYABLE_INDEXS = getPlayableIndexs();
const BASE_UI_SIZE = 930;
const BASE_IMAGE_SIZE = 35;
const BASE_BOARD_SIZE = 12;
const MIN_IMAGE_SIZE = 25;
const WIDTH_ASPECT = 1.25;

let imageSize = BASE_IMAGE_SIZE * (BASE_BOARD_SIZE / BOARD_SIZE);
let tableSize = imageSize * 1.5;
let prePut = NO_MOVE;

// ゲームで遊べる範囲の全ての盤面位置を取得
function getPlayableIndexs() {
  const all = Array(BOARD_ELEMENT_NUM).fill().map((_, i) => i)
  const limited = all.filter(e => (e >= PLAYABLE_START && e <= PLAYABLE_END));
  return limited.filter(e => (e % BOARD_SIZE !== 0 && (e + 1) % BOARD_SIZE !== 0));
}

// 盤面の初期設定
function initUi() {
  createBoardTable();  // 盤面のテーブルを作成
  updateUi();          // ゲーム情報を反映
  resizeUi();          // 盤面のリサイズ
}

// 盤面のテーブル作成
function createBoardTable() {
  // ボードの子要素を一旦全削除
  const uiBoard = document.getElementById(UI_BOARD);
  removeChilds(uiBoard);
  // ヘッダ含めた盤面をテーブルで作成
  const table = document.createElement('table');
  uiBoard.appendChild(table);
  for (let y=0; y<BOARD_SIZE; y++) {
    const tr = document.createElement('tr');
    table.appendChild(tr);
    for (let x=0; x<BOARD_SIZE; x++) {
      const td = document.createElement('td');
      tr.appendChild(td);
      td.addEventListener('click', onBoardClicked);
      td.setAttribute('id', UI_BOARD + (y * BOARD_SIZE + x));
    }
  }
  // 盤面のサイズと背景色と形
  for (let i=0; i<BOARD.length; i++) {
    const square = document.getElementById(UI_BOARD + i);
    square.width = tableSize;
    square.height = tableSize;
    const boardColor = BOARD_COLOR[i];
    if (reversi.board[i] !== H && boardColor !== '*') {
      square.style.backgroundColor = COLOR_CODE[boardColor];
    }
  }
  // 盤面のヘッダー情報を追加
  for (let i=0; i<PLAYABLE_SIZE; i++) {
    // 上辺のヘッダ(アルファベット)
    const topHeader = document.getElementById(UI_BOARD + (i + 1));
    topHeader.textContent = String.fromCharCode('A'.charCodeAt(0) + i);
    // 左辺のヘッダ(数字)
    const leftHeader = document.getElementById(UI_BOARD + ((i + 1) * BOARD_SIZE));
    leftHeader.textContent = i + 1;
  }
  // 石の初期配置
  setupDiscs(PLAYABLE_INDEXS);
}

// 盤面の更新
function updateUi() {
  updateDiscs();
  const turn = document.getElementById('turn');
  turn.textContent = getGameTurnText(reversi.turn);
  const score = document.getElementById('score');
  score.textContent = reversi.participants.map(e => reversi.flippers[e].score).join(' : ');
}

// 盤面のリサイズ
function resizeUi(){
  const innerWidth = window.innerWidth * WIDTH_ASPECT;
  const innerHeight = window.innerHeight;
  const uiSize = innerWidth < innerHeight ? innerWidth : innerHeight;
  imageSize = BASE_IMAGE_SIZE * (uiSize / BASE_UI_SIZE) * (BASE_BOARD_SIZE / BOARD_SIZE);
  imageSize = imageSize < MIN_IMAGE_SIZE ? MIN_IMAGE_SIZE : imageSize;
  tableSize = imageSize * 1.5;
  for (let i=0; i<BOARD.length; i++) {
    // マス
    let square = document.getElementById(UI_BOARD + i);
    square.width = tableSize;
    square.height = tableSize;
    // 石
    const disc = reversi.board[i];
    if (disc in UI_PLAYER_INFO) setImg(square, UI_PLAYER_INFO[disc].img);
  }
}

// 石を更新
function updateDiscs() {
  const {put, flipped} = reversi.updatedDiscs;
  if (put === NO_MOVE) return;
  // 前回の手のハイライトを消す
  if (prePut !== NO_MOVE) {
    const square = document.getElementById(UI_BOARD + prePut);
    square.style.backgroundColor = COLOR_CODE[BOARD_COLOR[prePut]];
  }
  // 石を置く
  setupDiscs(flipped.concat(put));
  // 今回の手をハイライト
  document.getElementById(UI_BOARD + put).style.backgroundColor = COLOR_CODE['7'];
  prePut = put;
}

// 石を並べる
// (引数)
//  indexs  : 石を置く位置(マスを示す番号)の配列
function setupDiscs(indexs) {
  for (let index of indexs) {
    const square = document.getElementById(UI_BOARD + index);
    const disc = reversi.board[index];
    if (disc in UI_PLAYER_INFO) setImg(square, UI_PLAYER_INFO[disc].img);
  }
}

// 画像を配置
// (引数)
//  element : Document要素
//  imgPath : 画像のパス
function setImg(element, imgPath) {
  removeChilds(element);                      // 一旦、子要素削除
  const img = document.createElement('img');  // 画像要素作成
  img.src = imgPath;                          // 画像パス
  img.width = imageSize;                      // 横サイズ（px）
  img.height = imageSize;                     // 縦サイズ（px）
  element.appendChild(img);                   // 画像追加
}

// 要素の子を削除
function removeChilds(element) {
  for (let i=element.childNodes.length-1; i>=0; i--) {
    element.removeChild(element.childNodes[i]);
  }
}

// 手番の文字列を取得
function getGameTurnText(turn) {
  return turn in UI_PLAYER_INFO ? UI_PLAYER_INFO[turn].name : GAME_TURN_END;
}

// マスをクリックした時の処理
function onBoardClicked(event) {
  if (reversi.state !== GAME_STOP) return;
  if (reversi.player.name === HUMAN) {
    const index = Number(this.getAttribute('id').replace(UI_BOARD, ''));
    const flippables = getFlippablesAtIndex(reversi.turn, reversi.board, index);
    if (flippables.length > 0) {
      reversi.humanMove = index;
      reversi.loop();
    }
  }
}
