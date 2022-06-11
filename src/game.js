const GAME_INIT = 0;
const GAME_PLAY = 1;
const GAME_STOP = 2;
const GAME_END = 3;
const GAME_TURN_END = 'End';
const DRAW = 'Draw';
const PASS = 'Pass';
const WIN = 'Win!';
const WAIT_TIME = 800;                 // ウェイト時間(ms)
const ORDER = [B, W, A];               // プレイヤーの順番
const NO_CUTIN = -1;
const CUTINS = {                       // 割り込みプレイヤー
  10: C,                               // 10手目でシアンが打つ
  30: Y,                               // 30手目で山吹色が打つ
  40: Y,                               // 40手目で山吹色が打つ
};
const FLIPPERS = {                     // 使用可能な全プレイヤー情報(石をひっくり返せる)
  [B]: {                               // 黒
    'player'   : new Player(HUMAN),    // 人が操作
    'opponents': [W, A, C, Y, G, R],   // 対戦相手 + 置き石
    'score'    : 0,                    // 黒の石の数
  },
  [W]: {                               // 白
    'player'   : new Player(MCS),      // コンピュータが操作(原始モンテカルロ探索)
    'opponents': [B, A, C, Y, G, R],   // 対戦相手 + 置き石
    'score'    : 0,                    // 白の石の数
  },
  [A]: {                               // 灰
    'player'   : new Player(RANDOM),   // コンピュータが操作(ランダム)
    'opponents': [B, W, C, Y, G, R],   // 対戦相手 + 置き石
    'score'    : 0,                    // 灰の石の数
  },
  [C]: {                               // シアン
    'player'   : new Player(MINIMUM),  // コンピュータが操作(Minimum)
    'opponents': [B, W, A, Y, G, R],   // 対戦相手 + 置き石
    'score'    : 0,                    // シアンの石の数
  },
  [Y]: {                               // 山吹
    'player'   : new Player(MAXIMUM),  // コンピュータが操作(Maximum)
    'opponents': [B, W, A, C, G, R],   // 対戦相手 + 置き石
    'score'    : 0,                    // 山吹の石の数
  },
};

// ゲームの管理
class Game {
  constructor(board, order, flippers, cutins) {
    this.board = board.concat();
    this.moveCount = 1;
    this.order = this.moveCount in cutins ? [cutins[this.moveCount]].concat(order) : order.concat();
    this.turnIndex = 0;
    this.cutInIndex = this.moveCount in cutins ? this.turnIndex : NO_CUTIN;
    this.turn = this.order[this.turnIndex];
    this.flippers = this.copyFlippers(flippers);
    this.player = this.flippers[this.turn].player;
    this.cutins = cutins;
    this.participants = [...new Set(order)];
    this.pass = 0;
    this.wait = WAIT_TIME;
    this.humanMove = NO_MOVE;
    this.updateScore();
    this.updatedDiscs = {'put': NO_MOVE, 'flipped': [], 'flippers': [], 'erasable': false};
    this.state = GAME_INIT;
  }

  // ゲームループ
  loop() {
    this.updatedDiscs = {'put': NO_MOVE, 'flipped': [], 'flippers': [], 'erasable': false};
    this.state = this.play();
    this.updateScore();
    updateUi();
    switch (this.state) {
      case GAME_PLAY:
        setTimeout(() => this.loop(), this.wait);
        break;
      case GAME_STOP:
        break;
      case GAME_END:
        alert(this.getWinnerMessage());
        break;
      default:
        break;
    }
  }

  // 1手プレイ
  play() {
    if (this.isEnd()) return GAME_END;
    if (this.indicatePass()) alert(this.getPassMessage());
    this.pass = 0;
    this.updatedDiscs = this.player.actMove(this);
    if (this.updatedDiscs.put === NO_MOVE) return GAME_STOP;
    this.moveCount++;
    this.setNextPlayer();
    return GAME_PLAY;
  }

  // 次のプレイヤーを設定する
  setNextPlayer() {
    // 今回の割り込みプレイヤー削除
    this.deleteCutInPlayer();
    // 手番を回す
    this.turnIndex++;
    if (this.turnIndex >= this.order.length) this.turnIndex = 0;
    // 次回の割り込みプレイヤー追加
    this.addCutInPlayer();
    // プレイヤー設定更新
    this.turn = this.order[this.turnIndex];
    this.player = this.flippers[this.turn].player;
  }

  // 割り込みプレイヤーを削除する
  deleteCutInPlayer() {
    if (this.cutInIndex != NO_CUTIN) {
      if (this.turnIndex >= this.cutInIndex) this.turnIndex--;
      this.order.splice(this.cutInIndex, 1);
      this.cutInIndex = NO_CUTIN;
    }
  }

  // 割り込みプレイヤーを追加する
  addCutInPlayer() {
    if (this.moveCount in this.cutins) {
      this.cutInIndex = this.turnIndex;
      this.order.splice(this.cutInIndex, 0, this.cutins[this.moveCount]);
    }
  }

  // スコアの更新
  updateScore() {
    for (let color of this.order) {
      this.flippers[color].score = this.board.filter(e => e === color).length;
    }
  }

  // 終了の判定
  isEnd() {
    for (let i=0; i<this.order.length; i++) {
      if (!this.isPass()) return false;
    }
    this.turn = GAME_TURN_END;
    return true;
  }

  // パスの判定
  isPass() {
    if (getLegalMoves(this.turn, this.board).length <= 0) {
      this.setNextPlayer(this.turn);
      this.pass++;
      return true;
    }
    return false;
  }

  // パス通知の有無
  indicatePass() {
    const pass = (this.pass < this.order.length && this.pass > 0);
    const human = this.participants.map(e => this.flippers[e].player.name).includes(HUMAN);
    return pass && human;
  }

  // パス通知のメッセージを取得
  getPassMessage() {
    let pre = []
    let index = this.turnIndex;
    for (let i=0; i<this.pass; i++) {
      index--;
      if (index < 0) index = this.order.length - 1;
      pre.push(getGameTurnText(this.order[index]));
    }
    return pre.reverse().join(' and ') + ' ' + PASS;
  }

  // 勝利プレイヤー通知のメッセージを取得
  getWinnerMessage() {
    const winner = this.getWinner();
    return winner === DRAW ? winner : getGameTurnText(winner) + ' ' + WIN;
  }

  // 勝利プレイヤーの石を返す
  getWinner() {
    const scores = this.participants.map(e => this.flippers[e].score);
    const max = Math.max(...scores);
    if (scores.filter(e => e === max).length === 1) return this.participants[scores.indexOf(max)];
    return DRAW;
  }

  // プレイヤー情報のコピー
  copyFlippers(flippers) {
    let copy = {};
    for (let key in flippers) {
      copy[key] = {
        'player'   : new Player(flippers[key].player.name),
        'opponents': flippers[key].opponents.concat(),
        'score'    : flippers[key].score,
      };
    }
    return copy;
  }
}
