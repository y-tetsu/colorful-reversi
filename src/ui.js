// UIの盤面作成
const UI_BOARD_ID = 'ui_board';
const BLACK_IMG = './image/black.png';
const WHITE_IMG = './image/white.png';

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
  // 盤面のサイズと背景色
  for (let i=0; i<BOARD.length; i++) {
    let square = document.getElementById(UI_BOARD_ID + i);
    square.width = 60;
    square.height = 60;
    if (gameBoard[i] !== X) {
        square.style.backgroundColor = 'green';
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
  // 石の配置
  for (let index of BOARD_INDEXS) {
    let square = document.getElementById(UI_BOARD_ID + index);
    switch (gameBoard[index]) {
      case B:
        displayDisc(square, BLACK_IMG);
        break;
      case W:
        displayDisc(square, WHITE_IMG);
        break;
      default:
        break;
    }
  }
  document.getElementById('turn').textContent = getGameTurnText(gameTurn);         // 手番
  document.getElementById('score').textContent = blackScore + ' : ' + whiteScore;  // スコア
}

// 石の画像を表示
function displayDisc(element, imgPath) {
  // 一旦、子要素削除
  removeChilds(element);
  // 画像追加
  let img = document.createElement('img');
  img.src = imgPath;  // 画像パス
  img.width = 40;     // 横サイズ（px）
  img.height = 40;    // 縦サイズ（px）
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
  if (turn === B) return 'Black';
  if (turn === W) return 'White';
  return GAME_TURN_END;
}

// マスをクリックした時の処理
function onBoardClicked(event) {
  if (gameState !== GAME_STOP) return;
  let player = gameTurn === B ? BLACK_PLAYER : WHITE_PLAYER;
  if (player === HUMAN) {
    const index = Number(this.getAttribute('id').replace(UI_BOARD_ID, ''));
    if (getFlippablesAtIndex(gameTurn, gameBoard, index).length > 0) {
      humanClicked = true;
      humanMove = index;
      gameLoop();
    }
  }
}
