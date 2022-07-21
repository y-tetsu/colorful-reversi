const H = 0;  // 穴
const E = 1;  // 空きマス
const B = 2;  // 黒色の石
const W = 3;  // 白色の石
const A = 4;  // 灰色の石
const C = 5;  // シアン色の石
const Y = 6;  // 山吹色の石
const G = 7;  // 緑色の石
const R = 8;  // 赤色の石
const S = 9;  // ボードの状態の数
const DIRECTION_XY = [
  {'x': 0, 'y':-1},  // 上
  {'x': 1, 'y':-1},  // 右上
  {'x': 1, 'y': 0},  // 右
  {'x': 1, 'y': 1},  // 右下
  {'x': 0, 'y': 1},  // 下
  {'x':-1, 'y': 1},  // 左下
  {'x':-1, 'y': 0},  // 左
  {'x':-1, 'y':-1},  // 左上
];
const WILDCARD = G;            // 変化石
const PERMANENTS = [G, C, Y];  // 不変石
const BOMB = R;                // ボム石
const BOARD = [
  H, H, H, H, H, H, H, H, H, H, H, H,
  H, H, H, H, H, E, E, H, H, H, H, H,
  H, H, H, H, E, E, R, E, H, H, H, H,
  H, H, H, E, E, E, E, E, E, H, H, H,
  H, H, E, E, E, G, C, E, E, E, H, H,
  H, E, R, E, Y, W, B, G, E, E, E, H,
  H, E, E, E, G, B, W, Y, E, R, E, H,
  H, H, E, E, E, C, G, E, E, E, H, H,
  H, H, H, E, E, E, E, E, E, H, H, H,
  H, H, H, H, E, R, E, E, H, H, H, H,
  H, H, H, H, H, E, E, H, H, H, H, H,
  H, H, H, H, H, H, H, H, H, H, H, H,
];
const BOARD_COLOR = [
  '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*',
  '*', '*', '*', '*', '*', '1', '2', '*', '*', '*', '*', '*',
  '*', '*', '*', '*', '1', '1', '2', '2', '*', '*', '*', '*',
  '*', '*', '*', '1', '5', '1', '2', '2', '2', '*', '*', '*',
  '*', '*', '1', '1', '1', '1', '2', '2', '6', '2', '*', '*',
  '*', '1', '1', '1', '1', '1', '2', '2', '2', '2', '2', '*',
  '*', '3', '3', '3', '3', '3', '4', '4', '4', '4', '4', '*',
  '*', '*', '3', '6', '3', '3', '4', '4', '4', '4', '*', '*',
  '*', '*', '*', '3', '3', '3', '4', '5', '4', '*', '*', '*',
  '*', '*', '*', '*', '3', '3', '4', '4', '*', '*', '*', '*',
  '*', '*', '*', '*', '*', '3', '4', '*', '*', '*', '*', '*',
  '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*',
];
const COLOR_CODE = {
  '0': 'green',
  '1': 'lightskyblue',
  '2': 'pink',
  '3': 'mediumaquamarine',
  '4': 'navajowhite',
  '5': 'white',
  '6': 'black',
  '7': '#DED5FA',
  '*': '* no color *',
};
const MAX_BITSIZE = 32;

// ビットボードを返す
// (引数)
//  board    : 盤面情報を格納した配列
// (戻り値)
//  bitboard : ビットボード
function getBitBoard(board) {
  // サイズ取得
  const boardSize = Math.sqrt(board.length);
  const playableSize = boardSize - 2;
  const pageSize = Math.ceil(playableSize * playableSize / MAX_BITSIZE);
  // ビットボード初期設定
  let bits = [];
  let bitboard = {'bits': bits, 'size': playableSize, 'pageSize': pageSize};
  for (let s=0; s<S; s++) {
    bits.push([]);
    for (let p=0; p<pageSize; p++) bits[s].push(0);
  }
  // ビットボード情報格納
  let p = -1;
  for (let y=0; y<playableSize; y++) {
    for (let x=0; x<playableSize; x++) {
      const s = board[(y + 1) * boardSize + (x + 1)];         // ゲーム盤面の状態を取得
      const bitIndex = (y * playableSize + x) % MAX_BITSIZE;  // ページ単位のビット位置を取得
      const mask = 1 << ((MAX_BITSIZE - 1) - bitIndex);       // マスク値を設定
      if (bitIndex === 0) p++;                                // ページ切り替え
      bits[s][p] = (bits[s][p] | mask) >>> 0;                 // ビットデータに変換
    }
  }
  return bitboard;
}

// 配列ボードを返す
// (引数)
//  bitboard : ビットボード
// (戻り値)
//  board    : 盤面情報を格納した配列
function getArrayBoard(bitboard) {
  const bits = bitboard['bits'];
  const playableSize = bitboard['size'];
  const boardSize = playableSize + 2;
  const pageSize = bitboard['pageSize'];
  let board = Array(boardSize*boardSize).fill(H);
  let count = 0;
  for (let p=0; p<pageSize; p++) {
    let mask = 1 << (MAX_BITSIZE - 1);
    for (let b=0; b<MAX_BITSIZE; b++) {
      const y = Math.floor(count / playableSize);
      const x = count % playableSize;
      const index = (y + 1) * boardSize + (x + 1);
      for (let s=0; s<S; s++) {
        if ((bits[s][p] & mask) !== 0) {
          board[index] = s;
          break;
        }
      }
      mask >>>= 1;
      count++;
      if (count >= playableSize*playableSize) break;
    }
    if (count >= playableSize*playableSize) break;
  }
  return board;
}

// 打てる手を取得する処理
// (引数)
//  turn     : プレイヤーの手番(色)
//  bitboard : 盤面情報を格納したビットボード
//  mask     : ビットボードのマスク値
// (戻り値)
//  legalMoves : 打てる手(マスを表す番号)の配列
function getLegalMoves(turn, bitboard, mask) {
  const legalMovesBits = getLegalMovesBits(turn, bitboard, mask);
  const legalMoves = bitsToIndexs(legalMovesBits, bitboard['size']);
  return legalMoves;
}

// 打てる手を取得する処理(配列版)
// (引数)
//  turn  : プレイヤーの手番(色)
//  board : 盤面情報を格納した配列
// (戻り値)
//  legalMoves : 打てる手(マスを表す番号)の配列
function getLegalMovesArray(turn, board) {
  let legalMoves = [];
  for (let i=0; i<board.length; i++) {
    const {flippables, flippers, erasable} = getFlippablesAtIndexArray(turn, board, i);
    if (flippables.length > 0) legalMoves.push(i);
  }
  return legalMoves;
}

// 打てる手を取得する処理(ビットボード版)
// (引数)
//  turn     : プレイヤーの手番(色)
//  bitboard : ビットボード
//  mask     : マスク値
// (戻り値)
//  legalMovesBits : 打てる手(マスを表す番号)のビットボード
function getLegalMovesBits(turn, bitboard, mask) {
  //--- 時間計測 ---//
  //startMeasure(0);
  //--- 時間計測 ---//
  const s = bitboard['size'];
  const bits = bitboard['bits'];
  const pageSize = bitboard['pageSize'];
  const shifts = (s * s > MAX_BITSIZE ? Math.floor(MAX_BITSIZE / s) : s);
  const opponents = getOpponentsBitBoard(turn, bitboard);
  const blank = bitboard['bits'][E];
  const wildcard = bits[WILDCARD];
  const mH = mask['horizontal'];
  const mV = mask['vertical'];
  const mD = mask['diagonal'];
  let player = bits[turn].concat();
  let horizontal = opponents.concat();
  let vertical = opponents.concat();
  let diagonal = opponents.concat();
  for (let p=0; p<pageSize; p++) {
    player[p] |= wildcard[p];
    horizontal[p] &= mH[p];
    vertical[p] &= mV[p];
    diagonal[p] &= mD[p];
  }

  const s1m = s - 1;
  const s1p = s + 1;
  const shLR = MAX_BITSIZE - 1;
  const shTB = MAX_BITSIZE - s;
  const shLTRB = shTB - 1;
  const shLBRT = shTB + 1;
  let legal = Array(pageSize).fill(0);
  let tL  = 0;
  let tT  = 0;
  let tLT = 0;
  let tRT = 0;
  let tR  = 0;
  let tB  = 0;
  let tLB = 0;
  let tRB = 0;
  let cL  = 0;
  let cT  = 0;
  let cLT = 0;
  let cRT = 0;
  let cR  = 0;
  let cB  = 0;
  let cLB = 0;
  let cRB = 0;

  for (let p=0; p<pageSize; p++) {
    const rev = (pageSize - 1) - p;
    const pOrg = player[p];
    const pPre = (p - 1) >= 0 ? player[p - 1] : 0;
    const pRev = player[rev];
    const pRevNext = (rev + 1) < pageSize ? player[rev + 1] : 0;
    const h = horizontal[p];
    const v = vertical[p];
    const d = diagonal[p];
    const b = blank[p];
    const hRev = horizontal[rev];
    const vRev = vertical[rev];
    const dRev = diagonal[rev];
    const bRev = blank[rev];

    tR  = ((pOrg >>> 1)   | (cR  | pPre)     <<  shLR)   & h;     // 右
    tB  = ((pOrg >>> s)   | (cB  | pPre)     <<  shTB)   & v;     // 下
    tLB = ((pOrg >>> s1m) | (cLB | pPre)     <<  shLBRT) & d;     // 左下
    tRB = ((pOrg >>> s1p) | (cRB | pPre)     <<  shLTRB) & d;     // 右下
    tL  = ((pRev <<  1)   | (cL  | pRevNext) >>> shLR)   & hRev;  // 左
    tT  = ((pRev <<  s)   | (cT  | pRevNext) >>> shTB)   & vRev;  // 上
    tLT = ((pRev <<  s1p) | (cLT | pRevNext) >>> shLTRB) & dRev;  // 左上
    tRT = ((pRev <<  s1m) | (cRT | pRevNext) >>> shLBRT) & dRev;  // 右上

    for (let i=0; i<shifts; i++) {
      tR  |= (tR  >>> 1)   & h;
      tB  |= (tB  >>> s)   & v;
      tLB |= (tLB >>> s1m) & d;
      tRB |= (tRB >>> s1p) & d;
      tL  |= (tL  <<  1)   & hRev;
      tT  |= (tT  <<  s)   & vRev;
      tLT |= (tLT <<  s1p) & dRev;
      tRT |= (tRT <<  s1m) & dRev;
    }
    for (let i=0; i<s-3-shifts; i++) {
      tR |= (tR >>> 1) & h;
      tL |= (tL <<  1) & hRev;
    }

    legal[p]   |= (((tR >>> 1) | (cR <<  shLR)) | ((tB >>> s) | (cB <<  shTB)) | ((tLB >>> s1m) | (cLB <<  shLBRT)) | ((tRB >>> s1p) | (cRB <<  shLTRB))) & b;
    legal[rev] |= (((tL <<  1) | (cL >>> shLR)) | ((tT <<  s) | (cT >>> shTB)) | ((tLT <<  s1p) | (cLT >>> shLTRB)) | ((tRT <<  s1m) | (cRT >>> shLBRT))) & bRev;

    cR  = tR;
    cB  = tB;
    cLB = tLB;
    cRB = tRB;
    cL  = tL;
    cT  = tT;
    cLT = tLT;
    cRT = tRT;
  }
  for (let p=0; p<pageSize; p++) legal[p] >>>= 0;
  //--- 時間計測 ---//
  //stopMeasure(0);
  //--- 時間計測 ---//
  return legal;
}

// ビットデータをインデックス配列に変換
// (引数)
//  bits : ビットボード
//  size : 盤面サイズ
// (戻り値)
//  indexs : 打てる手(マスを表す番号)の配列
function bitsToIndexs(bits, size) {
  //--- 時間計測 ---//
  //startMeasure(1);
  //--- 時間計測 ---//
  const boardSize = size + 2;
  let indexs = [];
  let count = 0;
  for (let p=0; p<bits.length; p++) {
    const b = bits[p];
    let mask = 1 << (MAX_BITSIZE - 1);
    for (let i=0; i<MAX_BITSIZE; i++) {
      if ((b & mask) !== 0) {
        const y = Math.floor(count / size);
        const x = count % size;
        const index = (y + 1) * boardSize + (x + 1);
        indexs.push(index);
      }
      mask >>>= 1;
      count++;
    }
  }
  //--- 時間計測 ---//
  //stopMeasure(1);
  //--- 時間計測 ---//
  return indexs;
}

// 打ち手をビットデータに変換
// (引数)
//  move : 打ち手の番号
//  size : 盤面サイズ
// (戻り値)
//  bits : ビットボード
function moveToBits(move, size) {
  const boardSize = size + 2;
  const pageSize = Math.ceil(size * size / MAX_BITSIZE);
  const x = (move % boardSize) - 1;
  const y = Math.floor(move / boardSize) - 1;
  const count = size * y + x;
  let bits = Array(pageSize).fill(0);
  const p = Math.floor(count / MAX_BITSIZE);
  const q = count % MAX_BITSIZE;
  let bit = 1 << (MAX_BITSIZE - 1);
  for (let i=0; i<q; i++) bit >>>= 1;
  bits[p] |= bit;
  return bits;
}


// 対戦相手のビットボード取得
// (引数)
//  turn     : プレイヤーの手番(色)
//  bitboard : ビットボード
function getOpponentsBitBoard(turn, bitboard) {
  const bits = bitboard['bits'];
  let opponents = [];
  for (let p=0; p<bitboard['pageSize']; p++) {
    let value = 0;
    for (let s=2; s<S; s++) {  // H,E除外
      if (s === turn) continue;
      value = (value | bits[s][p]) >>> 0;
    }
    opponents.push(value);
  }
  return opponents;
}

// ビットボードのマスク値取得
// (引数)
//  size     : 盤面のサイズ
//  pageSize : ビットボードのページサイズ
function getBitBoardMask(size, pageSize) {
  let [mask, page] = [{}, -1];
  for (let i=0; i<pageSize * MAX_BITSIZE; i++) {
    // マスク条件設定
    const row = i % size;
    const lr = (row > 0) && (row < (size - 1)) && (i < size * size);
    const tb = (i >= size) && (i < (size * (size - 1)));
    const r  = (row !== 0) && (i < size * size);
    const l  = (row !== (size - 1)) && (i < size * size);
    const t  = (i < (size * (size - 1)));
    const b  = (i >= size) && (i < size * size);
    const rt = r & t;
    const rb = r & b;
    const lt = l & t;
    const lb = l & b;
    const condition = {
      'horizontal': lr,
      'vertical'  : tb,
      'diagonal'  : lr && tb,
      'r'         : r,
      'l'         : l,
      't'         : t,
      'b'         : b,
      'rt'        : rt,
      'rb'        : rb,
      'lt'        : lt,
      'lb'        : lb,
    };
    if (i === 0) for (let key in condition) mask[key] = [];  // 初回のみ初期化
    // ページ切り替え
    if ((i % MAX_BITSIZE) === 0) {
      for (let key in condition) mask[key].push(0);  // 次のページを追加
      page++;
    }
    // マスク値生成
    for (let key in condition) {
      const [cond, next] = [condition[key], mask[key][page] << 1];
      mask[key][page] = (cond ? (next | 1) : next) >>> 0;  // 条件成立時ビットをON
    }
  }
  return mask;
}

// ビットが1の数を数える
// (引数)
//  bits : ビットボード配列
function popcount(bits) {
  let count = 0;
  for (let i=0; i<bits.length; i++) {
    let bit = bits[i];
    bit = bit - ((bit >>> 1) & 0x55555555);
    bit = (bit & 0x33333333) + ((bit >>> 2) & 0x33333333);
    bit = (bit + (bit >>> 4)) & 0x0F0F0F0F;
    bit = bit + (bit >>> 8);
    count += (bit + (bit >>> 16)) & 0x0000003F;
  }
  return count;
}

// ひっくり返せる石を取得する処理
// (引数)
//  turn     : プレイヤーの手番(色)
//  bitboard : ビットボード
//  mask     : ビットボードのマスク値
//  index    : 石を置く位置(マスを示すビットボード)
// (戻り値)
//  return : ひっくり返せる石、挟んだ石、消せるかどうか
function getFlippablesAtIndex(turn, bitboard, mask, index) {
  //--- 時間計測 ---//
  //startMeasure(2);
  //--- 時間計測 ---//
  let bits = getFlippablesAtIndexBits(turn, bitboard, mask, index);
  //--- 時間計測 ---//
  //stopMeasure(2);
  //--- 時間計測 ---//
  const size = bitboard['size'];
  return {
    'flippables': bitsToIndexs(bits['flippables'], size),
    'flippers'  : bitsToIndexs(bits['flippers'], size),
    'erasable'  : bits['erasable'],
  };
}

// ひっくり返せる石を取得する処理(ビットボード版)
// (引数)
//  turn     : プレイヤーの手番(色)
//  bitboard : ビットボード
//  mask     : ビットボードのマスク値
//  index    : 石を置く位置(マスを示すビットボード)
// (戻り値)
//  return : ひっくり返せる石、挟んだ石、消せるかどうか
function getFlippablesAtIndexBits(turn, bitboard, mask, index) {
  const pageSize = bitboard['pageSize'];
  const empty = bitboard['bits'][E];
  let flippables = Array(pageSize).fill(0);
  let flippers = Array(pageSize).fill(0);
  let erasable = false;
  for (let p=0; p<pageSize; p++) {
    if (index[p] !== 0 && empty[p] & index[p] === 0) return {
      'flippables': flippables,
      'flippers'  : flippers,
      'erasable'  : erasable,
    };  // 空きマス以外はスキップ
  }

  const s = bitboard['size'];
  const s1m = s - 1;
  const s1p = s + 1;
  const shifts = (s * s > MAX_BITSIZE ? Math.floor(MAX_BITSIZE / s) : s);
  const shLR__ = MAX_BITSIZE - 1;
  const shTB__ = MAX_BITSIZE - s;
  const shLTRB = shTB__ - 1;
  const shLBRT = shTB__ + 1;
  const bits = bitboard['bits'];
  const opponents = getOpponentsBitBoard(turn, bitboard);
  const blank = bitboard['bits'][E];
  const wildcard = bits[WILDCARD];
  const mT_ = mask['t'];
  const mRT = mask['rt'];
  const mR_ = mask['r'];
  const mRB = mask['rb'];
  const mB_ = mask['b'];
  const mLB = mask['lb'];
  const mL_ = mask['l'];
  const mLT = mask['lt'];
  let player = bits[turn].concat();
  for (let p=0; p<pageSize; p++) {
    player[p] |= wildcard[p];  // プレイヤーにWILDCARDを追加
  }
  let cR_ = Array(pageSize).fill(0);
  let cB_ = Array(pageSize).fill(0);
  let cLB = Array(pageSize).fill(0);
  let cRB = Array(pageSize).fill(0);
  let cL_ = Array(pageSize).fill(0);
  let cT_ = Array(pageSize).fill(0);
  let cLT = Array(pageSize).fill(0);
  let cRT = Array(pageSize).fill(0);
  let checkWildcard = Array(8).fill(false);  // ひっくり返せる方向毎にフラグ用意
  for (let p=0; p<pageSize; p++) {
    const rev = (pageSize - 1) - p;
    const iOrg = index[p];
    const iPre = p > 0 ? index[p - 1] : 0;
    const iRev = index[rev];
    const iNxt = (rev + 1) < pageSize ? index[rev + 1] : 0;
    const oOrg = opponents[p];
    const oRev = opponents[rev];
    const mr_ = mR_[p];
    const mb_ = mB_[p];
    const mlb = mLB[p];
    const mrb = mRB[p];
    const ml_ = mL_[rev];
    const mt_ = mT_[rev];
    const mlt = mLT[rev];
    const mrt = mRT[rev];

    // 相手の石
    let oR_ = mr_ & oOrg;
    let oB_ = mb_ & oOrg;
    let oLB = mlb & oOrg;
    let oRB = mrb & oOrg;
    let oL_ = ml_ & oRev;
    let oT_ = mt_ & oRev;
    let oLT = mlt & oRev;
    let oRT = mrt & oRev;

    // 打った場所から8方向の連続する相手の石(+隣接ページの打った場所と連続する相手の石も考慮)
    let tR_ = oR_ & ((iOrg >>> 1)   | ((iPre | cR_[p]) <<  shLR__));
    let tB_ = oB_ & ((iOrg >>> s)   | ((iPre | cB_[p]) <<  shTB__));
    let tLB = oLB & ((iOrg >>> s1m) | ((iPre | cLB[p]) <<  shLBRT));
    let tRB = oRB & ((iOrg >>> s1p) | ((iPre | cRB[p]) <<  shLTRB));
    let tL_ = oL_ & ((iRev <<  1)   | ((iNxt | cL_[rev]) >>> shLR__));
    let tT_ = oT_ & ((iRev <<  s)   | ((iNxt | cT_[rev]) >>> shTB__));
    let tLT = oLT & ((iRev <<  s1p) | ((iNxt | cLT[rev]) >>> shLTRB));
    let tRT = oRT & ((iRev <<  s1m) | ((iNxt | cRT[rev]) >>> shLBRT));
    for (let i=0; i<shifts; i++) {
      tR_ |= oR_ & (tR_ >>> 1);
      tB_ |= oB_ & (tB_ >>> s);
      tLB |= oLB & (tLB >>> s1m);
      tRB |= oRB & (tRB >>> s1p);
      tL_ |= oL_ & (tL_ <<  1);
      tT_ |= oT_ & (tT_ <<  s);
      tLT |= oLT & (tLT <<  s1p);
      tRT |= oRT & (tRT <<  s1m);
    }
    for (let i=0; i<s-3-shifts; i++) {
      tR_ |= oR_ & (tR_ >>> 1);
      tL_ |= oL_ & (tL_ <<  1);
    }

    // 連続が途切れた位置に自分の石がある場合
    const pOrg = player[p];
    const pRev = player[rev];
    const canPre = p > 0;
    const canNext = (rev + 1) < pageSize;
    const pmR_ = pOrg & mr_;
    const pmB_ = pOrg & mb_;
    const pmLB = pOrg & mlb;
    const pmRB = pOrg & mrb;
    const pmL_ = pRev & ml_;
    const pmT_ = pRev & mt_;
    const pmLT = pRev & mlt;
    const pmRT = pRev & mrt;
    let pR_ = pmR_ & (tR_ >>> 1);
    let pB_ = pmB_ & (tB_ >>> s);
    let pLB = pmLB & (tLB >>> s1m);
    let pRB = pmRB & (tRB >>> s1p);
    let pL_ = pmL_ & (tL_ <<  1);
    let pT_ = pmT_ & (tT_ <<  s);
    let pLT = pmLT & (tLT <<  s1p);
    let pRT = pmRT & (tRT <<  s1m);
    if (pR_) {
      flippables[p] |= tR_;
      for (let i=0; i<p; i++) flippables[i] |= cR_[i+1];  // 隣接ページの候補追加
      flippers[p] |= pR_;
      checkWildcard[0] = ((pR_ & bits[turn][p]) === 0) ? true : false;  // WILDCARDで挟む場合
    }
    if (pB_) {
      flippables[p] |= tB_;
      for (let i=0; i<p; i++) flippables[i] |= cB_[i+1];
      flippers[p] |= pB_;
      checkWildcard[1] = ((pB_ & bits[turn][p]) === 0) ? true : false;  // WILDCARDで挟む場合
    }
    if (pLB) {
      flippables[p] |= tLB;
      for (let i=0; i<p; i++) flippables[i] |= cLB[i+1];
      flippers[p] |= pLB;
      checkWildcard[2] = ((pLB & bits[turn][p]) === 0) ? true : false;  // WILDCARDで挟む場合
    }
    if (pRB) {
      flippables[p] |= tRB;
      for (let i=0; i<p; i++) flippables[i] |= cRB[i+1];
      flippers[p] |= pRB;
      checkWildcard[3] = ((pRB & bits[turn][p]) === 0) ? true : false;  // WILDCARDで挟む場合
    }
    if (pL_) {
      flippables[rev] |= tL_;
      for (let i=rev+1; i<pageSize; i++) flippables[i] |= cL_[i-1];
      flippers[rev] |= pL_;
      checkWildcard[4] = ((pL_ & bits[turn][rev]) === 0) ? true : false;  // WILDCARDで挟む場合
    }
    if (pT_) {
      flippables[rev] |= tT_;
      for (let i=rev+1; i<pageSize; i++) flippables[i] |= cT_[i-1];
      flippers[rev] |= pT_;
      checkWildcard[5] = ((pT_ & bits[turn][rev]) === 0) ? true : false;  // WILDCARDで挟む場合
    }
    if (pLT) {
      flippables[rev] |= tLT;
      for (let i=rev+1; i<pageSize; i++) flippables[i] |= cLT[i-1];
      flippers[rev] |= pLT;
      checkWildcard[6] = ((pLT & bits[turn][rev]) === 0) ? true : false;  // WILDCARDで挟む場合
    }
    if (pRT) {
      flippables[rev] |= tRT;
      for (let i=rev+1; i<pageSize; i++) flippables[i] |= cRT[i-1];
      flippers[rev] |= pRT;
      checkWildcard[7] = ((pRT & bits[turn][rev]) === 0) ? true : false;  // WILDCARDで挟む場合
    }

    // ページ境界の自分の石またはWILDCARDで隣接ページの石を挟む場合
    if (canPre) {
      if (!pR_ || checkWildcard[0]) {
        pR_ = pmR_ & (cR_[p] << shLR__);
        if (pR_) {
          for (let i=0; i<p; i++) flippables[i] |= cR_[i+1];
          flippers[p] |= pR_;
          checkWildcard[0] = ((pR_ & bits[turn][p]) === 0) ? true : false;  // WILDCARDで挟む場合
        }
      }
      if (!pB_ || checkWildcard[1]) {
        pB_ = pmB_ & (cB_[p] << shTB__);
        if (pB_) {
          for (let i=0; i<p; i++) flippables[i] |= cB_[i+1];
          flippers[p] |= pB_;
          checkWildcard[1] = ((pB_ & bits[turn][p]) === 0) ? true : false;  // WILDCARDで挟む場合
        }
      }
      if (!pLB || checkWildcard[2]) {
        pLB = pmLB & (cLB[p] << shLBRT);
        if (pLB) {
          for (let i=0; i<p; i++) flippables[i] |= cLB[i+1];
          flippers[p] |= pLB;
          checkWildcard[2] = ((pLB & bits[turn][p]) === 0) ? true : false;  // WILDCARDで挟む場合
        }
      }
      if (!pRB || checkWildcard[3]) {
        pRB = pmRB & (cRB[p] << shLTRB);
        if (pRB) {
          for (let i=0; i<p; i++) flippables[i] |= cRB[i+1];
          flippers[p] |= pRB;
          checkWildcard[3] = ((pRB & bits[turn][p]) === 0) ? true : false;  // WILDCARDで挟む場合
        }
      }
    }
    if (canNext) {
      if (!pL_ || checkWildcard[4]) {
        pL_ = pmL_ & (cL_[rev] >>> shLR__);
        if (pL_) {
          for (let i=rev+1; i<pageSize; i++) flippables[i] |= cL_[i-1];
          flippers[rev] |= pL_;
          checkWildcard[4] = ((pL_ & bits[turn][rev]) === 0) ? true : false;  // WILDCARDで挟む場合
        }
      }
      if (!pT_ || checkWildcard[5]) {
        pT_ = pmT_ & (cT_[rev] >>> shTB__);
        if (pT_) {
          for (let i=rev+1; i<pageSize; i++) flippables[i] |= cT_[i-1];
          flippers[rev] |= pT_;
          checkWildcard[5] = ((pT_ & bits[turn][rev]) === 0) ? true : false;  // WILDCARDで挟む場合
        }
      }
      if (!pLT || checkWildcard[6]) {
        pLT = pmLT & (cLT[rev] >>> shLTRB);
        if (pLT) {
          for (let i=rev+1; i<pageSize; i++) flippables[i] |= cLT[i-1];
          flippers[rev] |= pLT;
          checkWildcard[6] = ((pLT & bits[turn][rev]) === 0) ? true : false;  // WILDCARDで挟む場合
        }
      }
      if (!pRT || checkWildcard[7]) {
        pRT = pmRT & (cRT[rev] >>> shLBRT);
        if (pRT) {
          for (let i=rev+1; i<pageSize; i++) flippables[i] |= cRT[i-1];
          flippers[rev] |= pRT;
          checkWildcard[7] = ((pRT & bits[turn][rev]) === 0) ? true : false;  // WILDCARDで挟む場合
        }
      }
    }

    // 隣接ページへの繰り越し
    cR_[p+1]   = tR_;
    cB_[p+1]   = tB_;
    cLB[p+1]   = tLB;
    cRB[p+1]   = tRB;
    cL_[rev-1] = tL_;
    cT_[rev-1] = tT_;
    cLT[rev-1] = tLT;
    cRT[rev-1] = tRT;
  }

  // WILDCARDの処理
  for (let p=0; p<pageSize; p++) {
    flippers[p] &= ~flippables[p];
  }

  // - R
  if (checkWildcard[0]) {
    for (let p=0; p<pageSize; p++) {
      const rev = (pageSize - 1) - p;
      if (cR_[rev+1]) {
        let put = 0;
        let tmp_p = cR_[rev+1] | player[rev];
        for (let i=0; i<s-2; i++) {
          tmp_p <<= 1;
          tmp_p &= mR_[rev];
          const tmp = (cR_[rev+1] & ~(tmp_p | (player[rev+1] >>> shLR__)));
          put = wildcard[rev] & tmp;
          if (put) {
            flippers[rev] |= put;
            break;
          }
          else {
            flippables[rev] &= ~tmp;  // WILDCARD外側削除
          }
        }
        if (put) break;
      }
    }
  }

  // - B
  if (checkWildcard[1]) {
    for (let p=0; p<pageSize; p++) {
      const rev = (pageSize - 1) - p;
      if (cB_[rev+1]) {
        let put = 0;
        let tmp_p = cB_[rev+1] | player[rev];
        for (let i=0; i<shifts+1; i++) {
          tmp_p <<= s;
          tmp_p &= mB_[rev];
          const tmp = (cB_[rev+1] & ~(tmp_p | (player[rev+1] >>> shTB__)));
          put = wildcard[rev] & tmp;
          if (put) {
            flippers[rev] |= put;
            break;
          }
          else {
            flippables[rev] &= ~tmp;  // WILDCARD外側削除
          }
        }
        if (put) break;
      }
    }
  }

  // - LB
  if (checkWildcard[2]) {
    for (let p=0; p<pageSize; p++) {
      const rev = (pageSize - 1) - p;
      if (cLB[rev+1]) {
        let put = 0;
        let tmp_p = cLB[rev+1] | player[rev];
        for (let i=0; i<shifts+1; i++) {
          tmp_p <<= s1m;
          tmp_p &= mLB[rev];
          const tmp = (cLB[rev+1] & ~(tmp_p | (player[rev+1] >>> shLBRT)));
          put = wildcard[rev] & tmp;
          if (put) {
            flippers[rev] |= put;
            break;
          }
          else {
            flippables[rev] &= ~tmp;  // WILDCARD外側削除
          }
        }
        if (put) break;
      }
    }
  }

  // - RB
  if (checkWildcard[3]) {
    for (let p=0; p<pageSize; p++) {
      const rev = (pageSize - 1) - p;
      if (cRB[rev+1]) {
        let put = 0;
        let tmp_p = cRB[rev+1] | player[rev];
        for (let i=0; i<shifts+1; i++) {
          tmp_p <<= s1p;
          tmp_p &= mRB[rev];
          const tmp = (cRB[rev+1] & ~(tmp_p | (player[rev+1] >>> shLTRB)));
          put = wildcard[rev] & tmp;
          if (put) {
            flippers[rev] |= put;
            break;
          }
          else {
            flippables[rev] &= ~tmp;  // WILDCARD外側削除
          }
        }
        if (put) break;
      }
    }
  }

  // - L
  if (checkWildcard[4]) {
    for (let p=0; p<pageSize; p++) {
      if (cL_[p-1]) {
        let put = 0;
        let tmp_p = cL_[p-1] | player[p];
        for (let i=0; i<s-2; i++) {
          tmp_p >>>= 1;
          tmp_p &= mL_[p];
          // 端のwildcardを取り出す
          const tmp = (cL_[p-1] & ~(tmp_p | (player[p-1] << shLR__)));  // 隣接からの自分の石も考慮
          const put = wildcard[p] & tmp;
          if (put) {
            flippers[p] |= put;
            break;
          }
          else {
            flippables[p] &= ~tmp;  // WILDCARD外側削除
          }
        }
        if (put) break;
      }
    }
  }

  // - T
  if (checkWildcard[5]) {
    for (let p=0; p<pageSize; p++) {
      if (cT_[p-1]) {
        let put = 0;
        let tmp_p = cT_[p-1] | player[p];
        for (let i=0; i<shifts+1; i++) {
          tmp_p >>>= s;
          tmp_p &= mT_[p];
          const tmp = (cT_[p-1] & ~(tmp_p | (player[p-1] << shTB__)));
          put = wildcard[p] & tmp;
          if (put) {
            flippers[p] |= put;
            break;
          }
          else {
            flippables[p] &= ~tmp;  // WILDCARD外側削除
          }
        }
        if (put) break;
      }
    }
  }

  // - LT
  if (checkWildcard[6]) {
    for (let p=0; p<pageSize; p++) {
      if (cLT[p-1]) {
        let put = 0;
        let tmp_p = cLT[p-1] | player[p];
        for (let i=0; i<shifts+1; i++) {
          tmp_p >>>= s1p;
          tmp_p &= mLT[p];
          const tmp = (cLT[p-1] & ~(tmp_p | (player[p-1] << shLTRB)));
          put = wildcard[p] & tmp;
          if (put) {
            flippers[p] |= put;
            break;
          }
          else {
            flippables[p] &= ~tmp;  // WILDCARD外側削除
          }
        }
        if (put) break;
      }
    }
  }

  // - RT
  if (checkWildcard[7]) {
    for (let p=0; p<pageSize; p++) {
      if (cRT[p-1]) {
        let put = 0;
        let tmp_p = cRT[p-1] | player[p];
        for (let i=0; i<shifts+1; i++) {
          tmp_p >>>= s1m;
          tmp_p &= mRT[p];
          const tmp = (cRT[p-1] & ~(tmp_p | (player[p-1] << shLBRT)));
          put = wildcard[p] & tmp;
          if (put) {
            flippers[p] |= put;
            break;
          }
          else {
            flippables[p] &= ~tmp;  // WILDCARD外側削除
          }
        }
        if (put) break;
      }
    }
  }

  for (let p=0; p<pageSize; p++) {
    flippables[p] &= ~flippers[p];
  }

  // 符号なし整数に変換
  for (let p=0; p<pageSize; p++) {
    flippables[p] >>>= 0;
    flippers[p] >>>= 0;
  }

  // ボム石のチェック
  const bomb = bits[R];
  for (let p=0; p<pageSize; p++) {
    if ((flippables[p] & bomb[p]) !== 0) {
      erasable = true;
      break;
    }
  }

  return {'flippables': flippables, 'flippers': flippers, 'erasable': erasable};
}

// ひっくり返せる石を取得する処理(配列版)
// (引数)
//  turn  : プレイヤーの手番(色)
//  board : 盤面情報を格納した配列
//  index : 石を置く位置(マスを示す番号)
// (戻り値)
//  return : ひっくり返せる石、挟んだ石、消せるかどうか
function getFlippablesAtIndexArray(turn, board, index) {
  let flippables = [];
  let flippers = [];
  let erasable = false;
  if (board[index] !== E) return {
    'flippables': flippables,
    'flippers'  : flippers,
    'erasable'  : erasable,
  };  // 空きマス以外はスキップ
  const opponents = getOpponentColors(turn);
  const size = Math.sqrt(board.length);
  for (let {x, y} of DIRECTION_XY) {
    const dir = (size * y) + x;
    let opponentDiscs = [];
    let next = index + dir;
    // 相手ディスクが連続しているものを候補とする
    while (opponents.includes(board[next])) {
      opponentDiscs.push(next);
      next += dir;
    }
    // 連続が途切れた箇所が自ディスクの場合、候補を戻り値に追加
    if (board[next] === turn) {
      flippables = flippables.concat(opponentDiscs);
      // 挟んだ側の石を記憶
      if (opponentDiscs.length > 0) flippers.push(next);
      // ボム石が見つかったら記憶
      if (opponentDiscs.map(e => board[e]).includes(BOMB)) erasable = true;
    }
    else {
      while (opponentDiscs.length) {
        // 候補をpopし、変化石を探す
        const pre = opponentDiscs.pop();
        if (board[pre] === WILDCARD) {
          // 変化石が見つかったら、残りの候補を戻り値に追加
          flippables = flippables.concat(opponentDiscs);
          // 挟んだ側の石を記憶
          if (opponentDiscs.length > 0) flippers.push(pre);
          // ボム石が見つかったら記憶
          if (opponentDiscs.map(e => board[e]).includes(BOMB)) erasable = true;
          break;
        }
      }
    }
  }
  return {'flippables': flippables, 'flippers': flippers, 'erasable': erasable};
}

// 石を置く処理
// (引数)
//  turn     : プレイヤーの手番(色)
//  board    : 盤面情報を格納した配列
//  index    : 石を置く位置(マスを示す番号)
// (戻り値)
//  return : 置いた石、ひっくり返した石、挟んだ石、消せるかどうか
function putDisc(turn, board, index) {
  if (index === NO_MOVE) return {'put': NO_MOVE, 'flipped': [], 'flippers': [], 'erasable': false};
  //--- 時間計測 ---//
  //startMeasure(3);
  //--- 時間計測 ---//
  const {flippables, flippers, erasable} = getFlippablesAtIndexArray(turn, board, index);
  if (erasable === true) {
    for (let erase of flippables.concat(flippers)) board[erase] = E;  // 石を消す
  }
  else {
    board[index] = turn;                                                    // 手の位置にディスクを置く
    for (let flippable of flippables) {                                     // 相手のディスクをひっくり返す
      if (!PERMANENTS.includes(board[flippable])) board[flippable] = turn;  // 不変石はひっくり返さない
    }
  }
  //--- 時間計測 ---//
  //stopMeasure(3);
  //--- 時間計測 ---//
  return {'put': index, 'flipped': flippables, 'flippers': flippers, 'erasable': erasable};
}

// 石を置く処理(ビットボード)
// (引数)
//  turn     : プレイヤーの手番(色)
//  bitboard : ビットボード
//  mask     : ビットボードのマスク値
//  index    : 石を置く位置(マスを示すビットボード)
// (戻り値)
//  return : 置いた石、ひっくり返した石、挟んだ石、消せるかどうか
function putDiscBits(turn, bitboard, mask, index) {
  if (index === NO_MOVE) return {'put': NO_MOVE, 'flipped': [], 'flippers': [], 'erasable': false};
  //--- 時間計測 ---//
  //startMeasure(3);
  //--- 時間計測 ---//
  const bits = getFlippablesAtIndexBits(turn, bitboard, mask, index);
  const erasable = bits['erasable'];
  const flippables = bits['flippables'];
  const flippers = bits['flippers'];
  const b = bitboard['bits'];
  if (erasable === true) {
    for (let s=0; s<S; s++) {
      for (let p=0; p<bitboard['pageSize']; p++) {
        if (s === E) {
          b[s][p] |= (flippables[p] | flippers[p]);
        }
        else {
          b[s][p] &= ~(flippables[p] | flippers[p]);
        }
      }
    }
  }
  else {
    for (let p=0; p<bitboard['pageSize']; p++) {
      // 不変石を除外
      let fExp = flippables[p];
      for (let permanent of PERMANENTS) fExp &= ~b[permanent][p];
      // 石をひっくり返す
      for (let s=0; s<S; s++) {
        // 自分の石
        if (s === turn) {
          b[s][p] |= (index[p] | fExp);
        }
        // 相手の石
        else {
          b[s][p] &= ~(index[p] | fExp);
        }
      }
    }
  }
  //--- 時間計測 ---//
  //stopMeasure(3);
  //--- 時間計測 ---//
  return {'put': index, 'flipped': flippables, 'flippers': flippers, 'erasable': erasable};
}

// 自身の対戦相手を返す
// (引数)
//  turn  : プレイヤーの手番(色)
// (戻り値)
//  return : 対戦相手を格納した配列
function getOpponentColors(turn) {
  return turn in FLIPPERS ? FLIPPERS[turn].opponents : [];
}
