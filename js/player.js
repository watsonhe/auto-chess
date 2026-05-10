// Auto Chess - Player State
window.AC = window.AC || {};

AC.Player = {
  hp: AC.START_HP,
  gold: AC.START_GOLD,
  level: AC.START_LEVEL,
  xp: 0,
  round: 1,
  winStreak: 0,
  loseStreak: 0,
  bench: [],       // Array<PieceInstance>
  board: new Array(64).fill(null), // board[idx] = instanceId (string)
  _allPieces: {},  // instanceId -> PieceInstance
  _lastBattleResult: false,

  reset() {
    this.hp = AC.START_HP;
    this.gold = AC.START_GOLD;
    this.level = AC.START_LEVEL;
    this.xp = 0;
    this.round = 1;
    this.winStreak = 0;
    this.loseStreak = 0;
    this.bench = [];
    this.board = new Array(64).fill(null);
    this._allPieces = {};
    this._lastBattleResult = false;
  },

  // Register a piece instance
  addPiece(piece) {
    this._allPieces[piece.instanceId] = piece;
  },

  removePiece(piece) {
    delete this._allPieces[piece.instanceId];
    if (piece.boardIndex >= 0) {
      this.board[piece.boardIndex] = null;
    }
  },

  getPieceById(instanceId) {
    return this._allPieces[instanceId] || null;
  },

  // Get all player pieces (bench + board) for synergy counting
  getAllActivePieces() {
    const pieces = [];
    // Board pieces
    for (let i = 0; i < 64; i++) {
      const id = this.board[i];
      if (id) {
        const p = this._allPieces[id];
        if (p && !p.isDead) pieces.push(p);
      }
    }
    // Bench pieces also contribute to synergies during prep
    for (const p of this.bench) {
      if (p && !p.isDead) pieces.push(p);
    }
    return pieces;
  },

  // Get only board pieces (for battle)
  getBoardPieces() {
    const pieces = [];
    for (let i = 0; i < 64; i++) {
      const id = this.board[i];
      if (id) {
        const p = this._allPieces[id];
        if (p && !p.isDead) pieces.push(p);
      }
    }
    return pieces;
  },

  // Count pieces on board
  getBoardCount() {
    let count = 0;
    for (let i = 0; i < 64; i++) {
      if (this.board[i]) count++;
    }
    return count;
  },

  // Check if player can place more pieces
  canPlaceMore() {
    return this.getBoardCount() < (AC.MAX_UNITS[this.level] || 4);
  },

  // Gold operations
  canAfford(amount) {
    return this.gold >= amount;
  },

  spendGold(amount) {
    if (!this.canAfford(amount)) return false;
    this.gold -= amount;
    return true;
  },

  addGold(amount) {
    this.gold += amount;
  },

  // XP / Level
  gainXp(amount) {
    this.xp += amount;
    this._checkLevelUp();
  },

  buyXp() {
    if (this.level >= 10) return false;
    if (!this.spendGold(AC.XP_COST)) return false;
    this.gainXp(AC.XP_PER_BUY);
    return true;
  },

  _checkLevelUp() {
    while (this.level < 10) {
      const needed = AC.XP_TO_LEVEL[this.level + 1];
      if (this.xp >= needed) {
        this.xp -= needed;
        this.level++;
      } else {
        break;
      }
    }
  },

  // Streaks
  addWin() {
    this.winStreak++;
    this.loseStreak = 0;
  },

  addLoss() {
    this.loseStreak++;
    this.winStreak = 0;
  },

  getStreakGold() {
    if (this.winStreak >= 6) return 3;
    if (this.winStreak >= 4) return 2;
    if (this.winStreak >= 2) return 1;
    return 0;
  },

  // Interest
  getInterest() {
    return Math.min(AC.MAX_INTEREST, Math.floor(this.gold / AC.INTEREST_RATE));
  },

  // Process round result
  processRoundResult() {
    if (this._lastBattleResult) {
      this.addWin();
    } else {
      // Calculate HP damage
      const surviving = AC.Enemy.getSurvivingCount();
      const damage = surviving * AC.HP_DAMAGE_PER_ENEMY;
      this.hp -= damage;
      if (this.hp <= 0) {
        this.hp = 0;
      }
      this.addLoss();
    }

    // Income
    const interest = this.getInterest();
    const streakGold = this.getStreakGold();
    const totalIncome = AC.BASE_INCOME + interest + streakGold;
    this.addGold(totalIncome);

    if (this.hp <= 0) {
      AC.StateMachine.gameOver();
    }
  },

  // Upgrade check: 3 identical pieces → 1 higher star
  checkUpgrades() {
    // Group pieces on bench by pieceId + starLevel
    const groups = {};
    const allPieces = [...this.bench];
    for (let i = 0; i < 64; i++) {
      const id = this.board[i];
      if (id) {
        const p = this._allPieces[id];
        if (p) allPieces.push(p);
      }
    }

    for (const p of allPieces) {
      if (!p || p.starLevel >= 3) continue;
      const key = p.pieceId + '_' + p.starLevel;
      if (!groups[key]) groups[key] = [];
      groups[key].push(p);
    }

    for (const key in groups) {
      const group = groups[key];
      while (group.length >= 3) {
        const [a, b, c] = group.splice(0, 3);
        // Remove all three
        this._removePieceFromAll(a);
        this._removePieceFromAll(b);
        this._removePieceFromAll(c);

        // Create upgraded piece
        const upgraded = new AC.PieceInstance(a.pieceId, a.starLevel + 1);
        this.addPiece(upgraded);
        this.bench.push(upgraded);

        // Add the upgraded piece back to the group in case we have 3 more
        if (upgraded.starLevel < 3) {
          const newKey = upgraded.pieceId + '_' + upgraded.starLevel;
          if (!groups[newKey]) groups[newKey] = [];
          groups[newKey].push(upgraded);
        }
      }
    }
  },

  _removePieceFromAll(piece) {
    // Remove from board
    if (piece.boardIndex >= 0) {
      this.board[piece.boardIndex] = null;
    }
    // Remove from bench
    const benchIdx = this.bench.indexOf(piece);
    if (benchIdx >= 0) {
      this.bench.splice(benchIdx, 1);
    }
    delete this._allPieces[piece.instanceId];
  },

  // Reset all pieces for new round
  resetPieces() {
    for (const id in this._allPieces) {
      this._allPieces[id].resetForBattle();
    }
  },
};
