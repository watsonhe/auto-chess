// Auto Chess - Utility Functions
window.AC = window.AC || {};

AC.Utils = {

  // Manhattan distance between two board indices
  manhattan(idxA, idxB) {
    const ax = idxA % AC.BOARD_COLS, ay = Math.floor(idxA / AC.BOARD_COLS);
    const bx = idxB % AC.BOARD_COLS, by = Math.floor(idxB / AC.BOARD_COLS);
    return Math.abs(ax - bx) + Math.abs(ay - by);
  },

  // Chessboard distance (max of x and y diff) for ranged attacks feeling better
  chebyshev(idxA, idxB) {
    const ax = idxA % AC.BOARD_COLS, ay = Math.floor(idxA / AC.BOARD_COLS);
    const bx = idxB % AC.BOARD_COLS, by = Math.floor(idxB / AC.BOARD_COLS);
    return Math.max(Math.abs(ax - bx), Math.abs(ay - by));
  },

  // Euclidean-like but integer grid
  distance(idxA, idxB) {
    return this.manhattan(idxA, idxB);
  },

  // Get cell coordinates from board index
  idxToXY(idx) {
    return { x: idx % AC.BOARD_COLS, y: Math.floor(idx / AC.BOARD_COLS) };
  },

  // Get board index from cell coordinates
  xyToIdx(x, y) {
    if (x < 0 || x >= AC.BOARD_COLS || y < 0 || y >= AC.BOARD_ROWS) return -1;
    return y * AC.BOARD_COLS + x;
  },

  // Get pixel position of cell center
  cellCenter(idx) {
    const col = idx % AC.BOARD_COLS;
    const row = Math.floor(idx / AC.BOARD_COLS);
    return {
      x: AC.BOARD_X + col * AC.CELL_SIZE + AC.CELL_SIZE / 2,
      y: AC.BOARD_Y + row * AC.CELL_SIZE + AC.CELL_SIZE / 2
    };
  },

  // Get pixel position of cell top-left
  cellTL(idx) {
    const col = idx % AC.BOARD_COLS;
    const row = Math.floor(idx / AC.BOARD_COLS);
    return {
      x: AC.BOARD_X + col * AC.CELL_SIZE,
      y: AC.BOARD_Y + row * AC.CELL_SIZE
    };
  },

  // Screen pixel to board index
  pixelToCell(px, py) {
    const col = Math.floor((px - AC.BOARD_X) / AC.CELL_SIZE);
    const row = Math.floor((py - AC.BOARD_Y) / AC.CELL_SIZE);
    return this.xyToIdx(col, row);
  },

  // Screen pixel to board index, returns -1 if outside board
  pixelToCellClamped(px, py) {
    const col = Math.floor((px - AC.BOARD_X) / AC.CELL_SIZE);
    const row = Math.floor((py - AC.BOARD_Y) / AC.CELL_SIZE);
    if (col < 0 || col >= AC.BOARD_COLS || row < 0 || row >= AC.BOARD_ROWS) return -1;
    return row * AC.BOARD_COLS + col;
  },

  // Check if cell is in player placement zone (rows 5-7)
  isPlayerZone(idx) {
    if (idx < 0) return false;
    const row = Math.floor(idx / AC.BOARD_COLS);
    return row >= 5 && row <= 7;
  },

  // Check if cell is in enemy zone (rows 0-2)
  isEnemyZone(idx) {
    if (idx < 0) return false;
    const row = Math.floor(idx / AC.BOARD_COLS);
    return row >= 0 && row <= 2;
  },

  // Fisher-Yates shuffle
  shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },

  // Random int [min, max] inclusive
  randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  // Random float [0, 1)
  rand() {
    return Math.random();
  },

  // Weighted random selection: picks index from weights array
  weightedRandom(weights) {
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < weights.length; i++) {
      r -= weights[i];
      if (r <= 0) return i;
    }
    return weights.length - 1;
  },

  // Clamp value
  clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  },

  // Linear interpolation
  lerp(a, b, t) {
    return a + (b - a) * t;
  },

  // Short unique ID
  uid() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
  },

  // Get all adjacent cells (4-directional)
  getAdjacent(idx) {
    const col = idx % AC.BOARD_COLS;
    const row = Math.floor(idx / AC.BOARD_COLS);
    const adj = [];
    if (col > 0) adj.push(idx - 1);
    if (col < AC.BOARD_COLS - 1) adj.push(idx + 1);
    if (row > 0) adj.push(idx - AC.BOARD_COLS);
    if (row < AC.BOARD_ROWS - 1) adj.push(idx + AC.BOARD_COLS);
    return adj;
  },

  // Move 1 step from src toward dst on the grid
  stepToward(srcIdx, dstIdx) {
    const sx = srcIdx % AC.BOARD_COLS, sy = Math.floor(srcIdx / AC.BOARD_COLS);
    const dx = dstIdx % AC.BOARD_COLS, dy = Math.floor(dstIdx / AC.BOARD_COLS);
    const nx = sx + Math.sign(dx - sx);
    const ny = sy + Math.sign(dy - sy);
    // Prefer horizontal if both differ
    if (nx !== sx && ny !== sy) {
      // Move along larger axis
      if (Math.abs(dx - sx) >= Math.abs(dy - sy)) {
        return this.xyToIdx(nx, sy);
      } else {
        return this.xyToIdx(sx, ny);
      }
    }
    return this.xyToIdx(nx, ny);
  },

  // Range check: pieces attack if Chebyshev distance <= range (for intuitive diagonal attacks)
  inRange(idxA, idxB, range) {
    return this.chebyshev(idxA, idxB) <= range;
  },
};
