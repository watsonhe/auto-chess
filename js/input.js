// Auto Chess - Input Handling
window.AC = window.AC || {};

AC.Input = {
  mouse: { x: 0, y: 0, down: false, click: false },
  dragPiece: null,
  dragOrigin: null, // { type: 'board'|'bench', index: N }
  hoveredCell: -1,
  _canvas: null,

  init(canvas) {
    this._canvas = canvas;

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = AC.LOGICAL_W / rect.width;
      const scaleY = AC.LOGICAL_H / rect.height;
      this.mouse.x = (e.clientX - rect.left) * scaleX;
      this.mouse.y = (e.clientY - rect.top) * scaleY;
    });

    canvas.addEventListener('mousedown', (e) => {
      if (e.button === 0) {
        this.mouse.down = true;
        this._handlePress();
      }
    });

    canvas.addEventListener('mouseup', (e) => {
      if (e.button === 0) {
        this.mouse.down = false;
        this._handleRelease();
      }
    });

    // Right-click to sell
    canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this._handleRightClick();
    });

    // Touch support
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const scaleX = AC.LOGICAL_W / rect.width;
      const scaleY = AC.LOGICAL_H / rect.height;
      this.mouse.x = (e.touches[0].clientX - rect.left) * scaleX;
      this.mouse.y = (e.touches[0].clientY - rect.top) * scaleY;
      this.mouse.down = true;
      this._handlePress();
    });

    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const scaleX = AC.LOGICAL_W / rect.width;
      const scaleY = AC.LOGICAL_H / rect.height;
      this.mouse.x = (e.touches[0].clientX - rect.left) * scaleX;
      this.mouse.y = (e.touches[0].clientY - rect.top) * scaleY;
    });

    canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.mouse.down = false;
      this._handleRelease();
    });
  },

  update() {
    this.mouse.click = false;
    // Update hovered cell
    this.hoveredCell = AC.Utils.pixelToCellClamped(this.mouse.x, this.mouse.y);
  },

  _handlePress() {
    const st = AC.state ? AC.state.current : 'MENU';

    if (st === 'MENU') {
      AC.StateMachine.startGame();
      return;
    }

    if (st === 'GAME_OVER') {
      AC.StateMachine.startGame();
      return;
    }

    if (st === 'PREPARATION') {
      this._handlePrepPress();
    }

    if (st === 'ROUND_RESULT') {
      AC.StateMachine.nextRound();
    }
  },

  _handlePrepPress() {
    const mx = this.mouse.x;
    const my = this.mouse.y;

    // Check ready button
    if (AC.Renderer._readyButtonRect) {
      const r = AC.Renderer._readyButtonRect;
      if (mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) {
        AC.StateMachine.startBattle();
        return;
      }
    }

    // Check level-up button
    if (AC.Renderer._levelUpRect) {
      const r = AC.Renderer._levelUpRect;
      if (mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) {
        AC.Player.buyXp();
        return;
      }
    }

    // Check reroll button
    if (AC.Renderer._rerollRect) {
      const r = AC.Renderer._rerollRect;
      if (mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) {
        AC.Shop.reroll();
        return;
      }
    }

    // Check shop slots
    if (AC.Renderer._shopRects) {
      for (let i = 0; i < AC.Renderer._shopRects.length; i++) {
        const r = AC.Renderer._shopRects[i];
        if (r && mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) {
          AC.Shop.buy(i);
          return;
        }
      }
    }

    // Check board cells (start drag or select)
    const cellIdx = AC.Utils.pixelToCellClamped(mx, my);
    if (cellIdx >= 0 && AC.Utils.isPlayerZone(cellIdx)) {
      const pieceId = AC.Player.board[cellIdx];
      if (pieceId) {
        const piece = AC.Player.getPieceById(pieceId);
        if (piece) {
          this.dragPiece = piece;
          this.dragOrigin = { type: 'board', index: cellIdx };
          return;
        }
      }
    }

    // Check bench
    if (AC.Renderer._benchRects) {
      for (let i = 0; i < AC.Player.bench.length; i++) {
        const r = AC.Renderer._benchRects[i];
        if (r && mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) {
          const piece = AC.Player.bench[i];
          if (piece) {
            this.dragPiece = piece;
            this.dragOrigin = { type: 'bench', index: i };
            return;
          }
        }
      }
    }
  },

  _handleRelease() {
    if (!this.dragPiece) return;

    const mx = this.mouse.x;
    const my = this.mouse.y;
    const cellIdx = AC.Utils.pixelToCellClamped(mx, my);

    if (cellIdx >= 0 && AC.Utils.isPlayerZone(cellIdx)) {
      // Place on board
      if (this.dragOrigin.type === 'board') {
        // Move within board (swap)
        const targetPieceId = AC.Player.board[cellIdx];
        const srcPieceId = AC.Player.board[this.dragOrigin.index];

        if (targetPieceId && targetPieceId !== srcPieceId) {
          // Swap
          AC.Player.board[cellIdx] = srcPieceId;
          AC.Player.board[this.dragOrigin.index] = targetPieceId;
          const srcPiece = AC.Player.getPieceById(srcPieceId);
          const targetPiece = AC.Player.getPieceById(targetPieceId);
          if (srcPiece) srcPiece.boardIndex = cellIdx;
          if (targetPiece) targetPiece.boardIndex = this.dragOrigin.index;
        } else if (!targetPieceId) {
          // Move to empty cell
          AC.Player.board[cellIdx] = srcPieceId;
          AC.Player.board[this.dragOrigin.index] = null;
          this.dragPiece.boardIndex = cellIdx;
        }
      } else if (this.dragOrigin.type === 'bench') {
        // Place from bench to board
        const currentOnBoard = AC.Player.board.filter(c => c !== null).length;
        const maxUnits = AC.MAX_UNITS[AC.Player.level] || 4;
        const targetPieceId = AC.Player.board[cellIdx];

        if (currentOnBoard < maxUnits || targetPieceId) {
          AC.Player.bench.splice(this.dragOrigin.index, 1);
          if (targetPieceId) {
            // Swap: bench piece goes to board, board piece goes to bench
            const oldPiece = AC.Player.getPieceById(targetPieceId);
            if (oldPiece) {
              oldPiece.boardIndex = -1;
              AC.Player.bench.push(oldPiece);
            }
          }
          AC.Player.board[cellIdx] = this.dragPiece.instanceId;
          this.dragPiece.boardIndex = cellIdx;
        }
      }
    } else if (this._isOverBench(mx, my)) {
      // Return to bench
      if (this.dragOrigin.type === 'board') {
        if (AC.Player.bench.length < AC.MAX_BENCH) {
          AC.Player.board[this.dragOrigin.index] = null;
          this.dragPiece.boardIndex = -1;
          AC.Player.bench.push(this.dragPiece);
        }
      }
    } else if (this._isOverSellZone(mx, my)) {
      // Sell piece
      AC.Shop.sellPiece(this.dragPiece, this.dragOrigin);
    } else {
      // Return to original position (cancel drag)
      // Nothing to do, piece stays where it was
    }

    this.dragPiece = null;
    this.dragOrigin = null;
  },

  _handleRightClick() {
    const st = AC.state ? AC.state.current : 'MENU';
    if (st !== 'PREPARATION') return;

    const mx = this.mouse.x;
    const my = this.mouse.y;
    const cellIdx = AC.Utils.pixelToCellClamped(mx, my);

    if (cellIdx >= 0 && AC.Utils.isPlayerZone(cellIdx)) {
      const pieceId = AC.Player.board[cellIdx];
      if (pieceId) {
        const piece = AC.Player.getPieceById(pieceId);
        if (piece) {
          AC.Shop.sellPiece(piece, { type: 'board', index: cellIdx });
          return;
        }
      }
    }

    // Check bench
    if (AC.Renderer._benchRects) {
      for (let i = 0; i < AC.Player.bench.length; i++) {
        const r = AC.Renderer._benchRects[i];
        if (r && mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) {
          const piece = AC.Player.bench[i];
          if (piece) {
            AC.Shop.sellPiece(piece, { type: 'bench', index: i });
            return;
          }
        }
      }
    }
  },

  _isOverBench(mx, my) {
    if (!AC.Renderer._benchRects) return false;
    for (const r of AC.Renderer._benchRects) {
      if (r && mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) return true;
    }
    return false;
  },

  _isOverSellZone(mx, my) {
    // Sell zone is below the shop
    return mx >= AC.SHOP_X && mx <= AC.SHOP_X + AC.BOARD_X - 32 &&
           my >= AC.SHOP_Y + AC.SHOP_SLOTS * (AC.SHOP_SLOT_SIZE + 4) + 4 &&
           my <= AC.SHOP_Y + AC.SHOP_SLOTS * (AC.SHOP_SLOT_SIZE + 4) + 36;
  },
};
