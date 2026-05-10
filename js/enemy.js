// Auto Chess - Enemy Wave Generation
window.AC = window.AC || {};

AC.Enemy = {
  pieces: [],

  generateWave(round) {
    this.pieces = [];
    const waveDef = AC.ROUNDS[Math.min(round - 1, AC.ROUNDS.length - 1)];
    if (!waveDef) return;

    const count = waveDef.enemies;
    const maxTier = waveDef.maxTier;
    const theme = waveDef.theme;

    // Determine star levels based on round
    let maxStar = 1;
    if (round > 15) maxStar = 3;
    else if (round > 10) maxStar = 2;
    else if (round > 5) maxStar = 2;

    // Build pool of available pieces
    const pool = this._buildPool(maxTier, theme);

    // Generate pieces
    for (let i = 0; i < count; i++) {
      const pieceId = pool[AC.Utils.randInt(0, pool.length - 1)];
      const starLevel = Math.min(maxStar, AC.Utils.weightedRandom(
        maxStar >= 3 ? [0.5, 0.35, 0.15] :
        maxStar >= 2 ? [0.6, 0.4] : [1.0]
      ) + 1);

      const piece = new AC.PieceInstance(pieceId, starLevel);
      piece.facingRight = false;
      this.pieces.push(piece);
    }

    // Place enemies on board
    this._placeEnemies();
  },

  _buildPool(maxTier, theme) {
    const pool = [];
    for (const id in AC.PIECE_DATA) {
      const data = AC.PIECE_DATA[id];
      if (data.tier <= maxTier) {
        if (!theme || data.faction === theme || Math.random() < 0.2) {
          pool.push(id);
        }
      }
    }
    if (pool.length === 0) {
      // Fallback: include all pieces up to maxTier
      for (const id in AC.PIECE_DATA) {
        if (AC.PIECE_DATA[id].tier <= maxTier) pool.push(id);
      }
    }
    return pool;
  },

  _placeEnemies() {
    const tanks = this.pieces.filter(p => p.className === 'guardian');
    const ranged = this.pieces.filter(p => ['mage', 'ranger', 'warlock'].includes(p.className));
    const melee = this.pieces.filter(p => !tanks.includes(p) && !ranged.includes(p));

    // Placement zones
    const frontRow = []; // row 2
    const midRow = [];   // row 1
    const backRow = [];  // row 0

    for (let col = 0; col < AC.BOARD_COLS; col++) {
      frontRow.push(AC.Utils.xyToIdx(col, 2));
      midRow.push(AC.Utils.xyToIdx(col, 1));
      backRow.push(AC.Utils.xyToIdx(col, 0));
    }

    // Shuffle available cells within each row
    const shuffleArr = (arr) => AC.Utils.shuffle(arr);

    const frontCells = shuffleArr(frontRow);
    const midCells = shuffleArr(midRow);
    const backCells = shuffleArr(backRow);

    let fi = 0, mi = 0, bi = 0;

    // Place tanks in front
    for (const p of tanks) {
      if (fi < frontCells.length) {
        p.boardIndex = frontCells[fi++];
      } else if (mi < midCells.length) {
        p.boardIndex = midCells[mi++];
      }
    }

    // Place melee
    for (const p of melee) {
      if (fi < frontCells.length) {
        p.boardIndex = frontCells[fi++];
      } else if (mi < midCells.length) {
        p.boardIndex = midCells[mi++];
      } else if (bi < backCells.length) {
        p.boardIndex = backCells[bi++];
      }
    }

    // Place ranged in back
    for (const p of ranged) {
      if (bi < backCells.length) {
        p.boardIndex = backCells[bi++];
      } else if (mi < midCells.length) {
        p.boardIndex = midCells[mi++];
      } else if (fi < frontCells.length) {
        p.boardIndex = frontCells[fi++];
      }
    }

    // Remove pieces that couldn't be placed
    this.pieces = this.pieces.filter(p => p.boardIndex >= 0);
  },

  getSurvivingCount() {
    return this.pieces.filter(p => !p.isDead).length;
  },
};
