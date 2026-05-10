// Auto Chess - Shop System
window.AC = window.AC || {};

AC.Shop = {
  slots: [], // Array of pieceId strings

  refreshShop() {
    this.slots = [];
    const level = AC.Player.level;
    const rates = AC.TIER_RATES[Math.min(level, 10)];

    const pool = this._buildPool();

    for (let i = 0; i < AC.SHOP_COUNT; i++) {
      const tier = AC.Utils.weightedRandom(rates) + 1;
      const tierPool = pool.filter(id => AC.PIECE_DATA[id].tier === tier);
      const usePool = tierPool.length > 0 ? tierPool : pool;
      const pieceId = usePool[AC.Utils.randInt(0, usePool.length - 1)];
      this.slots.push(pieceId);
    }
  },

  _buildPool() {
    const pool = [];
    for (const id in AC.PIECE_DATA) {
      // Each piece has a limited number in the shared pool (standard auto-chess mechanic)
      // Simplified: all pieces available
      pool.push(id);
    }
    return pool;
  },

  buy(slotIndex) {
    if (slotIndex < 0 || slotIndex >= this.slots.length) return null;
    if (AC.Player.bench.length >= AC.MAX_BENCH) return null;

    const pieceId = this.slots[slotIndex];
    const cost = AC.PIECE_DATA[pieceId].tier;

    if (!AC.Player.spendGold(cost)) return null;

    const piece = new AC.PieceInstance(pieceId, 1);
    AC.Player.addPiece(piece);
    AC.Player.bench.push(piece);

    // Remove from shop slot
    this.slots.splice(slotIndex, 1);

    // Check for upgrades
    AC.Player.checkUpgrades();

    return piece;
  },

  reroll() {
    if (!AC.Player.spendGold(AC.REROLL_COST)) return false;
    this.refreshShop();
    return true;
  },

  sellPiece(piece, origin) {
    const cost = AC.PIECE_DATA[piece.pieceId].tier;
    AC.Player.addGold(cost);

    // Remove from board or bench
    if (origin.type === 'board') {
      AC.Player.board[origin.index] = null;
    } else if (origin.type === 'bench') {
      AC.Player.bench.splice(origin.index, 1);
    }

    AC.Player.removePiece(piece);
    return cost;
  },
};
