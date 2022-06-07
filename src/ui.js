// UIの盤面作成
const UI_BOARD_ID = 'ui_board';
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
const BASE_UI_SIZE = 930;
const BASE_IMAGE_SIZE = 35;
const MIN_IMAGE_SIZE = 25;
const WIDTH_ASPECT = 1.25;

let imageSize = BASE_IMAGE_SIZE;
let tableSize = imageSize * 1.5;

// 盤面の初期設定
function initUi() {
  createBoardTable();  // 盤面のテーブルを作成
  updateUi();          // ゲーム情報を反映
}

// 盤面のテーブル作成
function createBoardTable() {
  // ボードの子要素を一旦全削除
  const uiBoard = document.getElementById(UI_BOARD_ID);
  removeChilds(uiBoard);
  // ヘッダ含めた盤面をテーブルで作成
  const table = document.createElement('table');
  uiBoard.appendChild(table);
  for (let y=0; y<GAME_BOARD_SIZE; y++) {
    const tr = document.createElement('tr');
    table.appendChild(tr);
    for (let x=0; x<GAME_BOARD_SIZE; x++) {
      const td = document.createElement('td');
      tr.appendChild(td);
      td.addEventListener('click', onBoardClicked);  // クリック時のイベントリスナーを登録
      td.setAttribute('id', UI_BOARD_ID + (y * GAME_BOARD_SIZE + x));
    }
  }
  // 盤面のサイズと背景色、盤面形状
  for (let i=0; i<BOARD.length; i++) {
    let square = document.getElementById(UI_BOARD_ID + i);
    square.width = tableSize;
    square.height = tableSize;
    // 背景色の反映
    const boardColor = BOARD_COLOR[i];
    if (gameBoard[i] !== H && boardColor !== '*') {  // 穴と色なしは除外
      square.style.backgroundColor = COLOR_CODE_CONFIG[boardColor];
    }
  }
  // 盤面のヘッダー情報を追加
  for (let i=0; i<BOARD_SIZE; i++) {
    // 上辺のヘッダ(アルファベット)
    let topHeader = document.getElementById(UI_BOARD_ID + (i + 1));
    topHeader.textContent = String.fromCharCode('A'.charCodeAt(0) + i);
    // 左辺のヘッダ(数字)
    let leftHeader = document.getElementById(UI_BOARD_ID + ((i + 1) * GAME_BOARD_SIZE));
    leftHeader.textContent = i + 1;
  }
}

// 盤面の更新
function updateUi() {
  document.getElementById('turn').textContent = getGameTurnText(gameTurn);                            // 手番
  document.getElementById('score').textContent = PLAYERS.map(e => playersInfo[e].score).join(' : ');  // スコア
  // 盤面のリサイズ
  resizeUi();
}

// 盤面のリサイズ
function resizeUi(){
  const innerWidth = window.innerWidth * WIDTH_ASPECT;
  const innerHeight = window.innerHeight;
  const uiSize = innerWidth < innerHeight ? innerWidth : innerHeight;
  imageSize = BASE_IMAGE_SIZE * (uiSize / BASE_UI_SIZE);
  imageSize = imageSize < MIN_IMAGE_SIZE ? MIN_IMAGE_SIZE : imageSize;
  tableSize = imageSize * 1.5;
  for (let i=0; i<BOARD.length; i++) {
    // マス
    let square = document.getElementById(UI_BOARD_ID + i);
    square.width = tableSize;
    square.height = tableSize;
    // 石
    const boardState = gameBoard[i];
    if (boardState in UI_PLAYER_INFO) displayDisc(square, UI_PLAYER_INFO[boardState].img);
  }
}

// 石の画像を表示
function displayDisc(element, imgPath) {
  // 一旦、子要素削除
  removeChilds(element);
  // 画像追加
  let img = document.createElement('img');
  img.src = imgPath;       // 画像パス
  img.width = imageSize;   // 横サイズ（px）
  img.height = imageSize;  // 縦サイズ（px）
  element.appendChild(img);
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
  if (gameState !== GAME_STOP) return;
  if (playersInfo[gameTurn].player === HUMAN) {
    const index = Number(this.getAttribute('id').replace(UI_BOARD_ID, ''));
    if (getFlippablesAtIndex(gameTurn, gameBoard, index).length > 0) {
      humanClicked = true;
      humanMove = index;
      gameLoop();
    }
  }
}
