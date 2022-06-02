// UIの盤面作成
const UI_BOARD_ID = "ui_board";
const BLACK_IMG = './image/black.png';
const WHITE_IMG = './image/white.png';
const IMG_SIZE = 40;

function initUi() {
  createBoardTable();  // 盤面のテーブルを作成
  updateUi();          // ゲーム情報を反映
}

function createBoardTable() {
  // ヘッダ含めた盤面をテーブルで作成
  const table = document.createElement("table");
  document.getElementById(UI_BOARD_ID).appendChild(table);
  for (let y=0; y<GAME_BOARD_SIZE; y++) {
    const tr = document.createElement("tr");
    table.appendChild(tr);
    for (let x=0; x<GAME_BOARD_SIZE; x++) {
      const td = document.createElement("td");
      tr.appendChild(td);
      td.addEventListener("click", onBoardClicked);  // クリック時のイベントリスナーを登録
      td.setAttribute("id", UI_BOARD_ID + (y * GAME_BOARD_SIZE + x));
    }
  }
  // 盤面のヘッダー情報を追加
  for (let i=0; i<BOARD_SIZE; i++) {
    // 上辺のヘッダ(アルファベット)
    let topHeader = document.getElementById(UI_BOARD_ID + (i + 1));
    topHeader.setAttribute("class", "header");
    topHeader.textContent = String.fromCharCode('A'.charCodeAt(0) + i);
    // 左辺のヘッダ(数字)
    let leftHeader = document.getElementById(UI_BOARD_ID + ((i + 1) * GAME_BOARD_SIZE));
    leftHeader.setAttribute("class", "header");
    leftHeader.textContent = i + 1;
    // 右辺と下辺(表示なし)
    setUiBoardIdClassNone(((i + 1) * GAME_BOARD_SIZE) + BOARD_SIZE + 1);
    setUiBoardIdClassNone(((BOARD_SIZE + 1) * GAME_BOARD_SIZE) + 1 + i);
  }
  setUiBoardIdClassNone(0);                                        // 左上の角
  setUiBoardIdClassNone((GAME_BOARD_SIZE - 1) * GAME_BOARD_SIZE);  // 左下の角
  setUiBoardIdClassNone(GAME_BOARD_SIZE - 1);                      // 右上の角
  setUiBoardIdClassNone((GAME_BOARD_SIZE * GAME_BOARD_SIZE) - 1);  // 右下の角
}

function setUiBoardIdClassNone(index) {
  document.getElementById(UI_BOARD_ID + index).setAttribute("class", "none");
}

function updateUi() {
  for (let index of BOARD_INDEXS) {
    let boardSquare = document.getElementById(UI_BOARD_ID + index);
    // カラーの反映
    const boardColor = BOARD_COLOR[index];
    if (gameBoard[index] !== H && boardColor !== "*") {
      boardSquare.style.backgroundColor = COLOR_CODE_CONFIG[boardColor];
    }
    // ディスクとホールの反映
    removeChilds(boardSquare);
    switch (gameBoard[index]) {
      case B:
        boardSquare.setAttribute("class", "black");
        addImg(boardSquare, BLACK_IMG);
        break;
      case W:
        boardSquare.setAttribute("class", "white");
        addImg(boardSquare, WHITE_IMG);
        break;
      case H:
        boardSquare.setAttribute("class", "hole");
        break;
      default:
        boardSquare.setAttribute("class", "none");
        break;
    }
  }
  // 手番
  document.getElementById("turn").textContent = getGameTurnText(gameTurn);
  // スコア
  document.getElementById("black_score").textContent = blackScore;
  document.getElementById("white_score").textContent = whiteScore;
}

function addImg(element, imgPath) {
  let img = document.createElement('img');
  img.src = imgPath;     // 画像パス
  img.width = IMG_SIZE;  // 横サイズ（px）
  img.height = IMG_SIZE; // 縦サイズ（px）
  element.appendChild(img);
}

function removeChilds(element) {
  for (let i=element.childNodes.length-1; i>=0; i--) {
    element.removeChild(element.childNodes[i]);
  }
}

function getGameTurnText(turn) {
  if (turn === B) return "Black";
  if (turn === W) return "White";
  return GAME_TURN_END;
}

function onBoardClicked(event) {
  if (gameState !== GAME_STOP) return;
  let player = gameTurn === B ? BLACK_PLAYER : WHITE_PLAYER;
  if (player === HUMAN) {
    const index = Number(this.getAttribute("id").replace(UI_BOARD_ID, ""));
    if (getFlippablesAtIndex(gameTurn, gameBoard, index).length > 0) {
      humanClicked = true;
      humanMove = index;
      gameLoop();
    }
  }
}
