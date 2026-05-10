// Auto Chess - Board Logic
window.AC = window.AC || {};

AC.Board = {
  // Get empty cells in player zone
  getEmptyPlayerCells() {
    const cells = [];
    for (let i = 0; i < 64; i++) {
      if (AC.Utils.isPlayerZone(i) && !AC.Player.board[i]) {
        cells.push(i);
      }
    }
    return cells;
  },

  // Get empty cells in enemy zone
  getEmptyEnemyCells() {
    const cells = [];
    for (let i = 0; i < 64; i++) {
      if (AC.Utils.isEnemyZone(i)) {
        cells.push(i);
      }
    }
    return cells;
  },

  // Place piece at specific cell
  placePiece(piece, cellIdx) {
    if (piece.boardIndex >= 0 && AC.Player.board[piece.boardIndex] === piece.instanceId) {
      AC.Player.board[piece.boardIndex] = null;
    }
    AC.Player.board[cellIdx] = piece.instanceId;
    piece.boardIndex = cellIdx;
  },

  // Remove piece from board
  removeFromBoard(piece) {
    if (piece.boardIndex >= 0) {
      AC.Player.board[piece.boardIndex] = null;
      piece.boardIndex = -1;
    }
  },

  // Move piece from one cell to another
  movePiece(piece, toIdx) {
    this.placePiece(piece, toIdx);
  },

  // Check if cell is occupied
  isOccupied(cellIdx) {
    if (cellIdx < 0 || cellIdx >= 64) return true;
    // Check player pieces
    if (AC.Player.board[cellIdx]) return true;
    // Check enemy pieces
    if (AC.Enemy.pieces) {
      for (const ep of AC.Enemy.pieces) {
        if (ep && !ep.isDead && ep.boardIndex === cellIdx) return true;
      }
    }
    return false;
  },

  // Find nearest enemy to a board position
  findNearestEnemy(fromIdx, enemyPieces) {
    let best = null;
    let bestDist = Infinity;
    for (const ep of enemyPieces) {
      if (ep.isDead || ep.boardIndex < 0) continue;
      const dist = AC.Utils.manhattan(fromIdx, ep.boardIndex);
      if (dist < bestDist || (dist === bestDist && best && ep.currentHP < best.currentHP)) {
        bestDist = dist;
        best = ep;
      }
    }
    return best;
  },

  // Find nearest player piece to a board position
  findNearestPlayer(fromIdx, playerPieces) {
    let best = null;
    let bestDist = Infinity;
    for (const pp of playerPieces) {
      if (pp.isDead || pp.boardIndex < 0) continue;
      const dist = AC.Utils.manhattan(fromIdx, pp.boardIndex);
      if (dist < bestDist || (dist === bestDist && best && pp.currentHP < best.currentHP)) {
        bestDist = dist;
        best = pp;
      }
    }
    return best;
  },
};
