// Auto Chess - Canvas Renderer
window.AC = window.AC || {};

AC.Renderer = {
  ctx: null,
  canvas: null,

  init() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = AC.LOGICAL_W;
    this.canvas.height = AC.LOGICAL_H;
    this.canvas.style.width = AC.LOGICAL_W + 'px';
    this.canvas.style.height = AC.LOGICAL_H + 'px';
    this.ctx.imageSmoothingEnabled = false;
  },

  // ---- Drawing Primitives ----

  clear() {
    this.ctx.fillStyle = '#0a0a0f';
    this.ctx.fillRect(0, 0, AC.LOGICAL_W, AC.LOGICAL_H);
  },

  rect(x, y, w, h, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
  },

  rectBorder(x, y, w, h, color, lineWidth = 1) {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeRect(Math.floor(x) + 0.5, Math.floor(y) + 0.5, Math.floor(w) - 1, Math.floor(h) - 1);
  },

  text(str, x, y, color = '#ffffff', size = 13, fontFamily = 'monospace', align = 'left') {
    this.ctx.fillStyle = color;
    this.ctx.font = `${size}px ${fontFamily}`;
    this.ctx.textAlign = align;
    this.ctx.textBaseline = 'top';
    this.ctx.fillText(str, Math.floor(x), Math.floor(y));
  },

  pixelText(str, x, y, color = '#ffffff', size = 11, align = 'left') {
    this.ctx.fillStyle = color;
    this.ctx.font = `${size}px "Press Start 2P", monospace`;
    this.ctx.textAlign = align;
    this.ctx.textBaseline = 'top';
    this.ctx.fillText(str, Math.floor(x), Math.floor(y));
  },

  // ---- Board ----

  drawBoard() {
    // Zone background fills
    // Enemy zone (rows 0-2): red-tinted dark
    this.rect(AC.BOARD_X, AC.BOARD_Y, AC.BOARD_W, 3 * AC.CELL_SIZE, '#1a1015');
    // Neutral zone (rows 3-4): dark neutral
    this.rect(AC.BOARD_X, AC.BOARD_Y + 3 * AC.CELL_SIZE, AC.BOARD_W, 2 * AC.CELL_SIZE, '#151518');
    // Player zone (rows 5-7): blue-tinted dark
    this.rect(AC.BOARD_X, AC.BOARD_Y + 5 * AC.CELL_SIZE, AC.BOARD_W, 3 * AC.CELL_SIZE, '#10141a');

    for (let row = 0; row < AC.BOARD_ROWS; row++) {
      for (let col = 0; col < AC.BOARD_COLS; col++) {
        const x = AC.BOARD_X + col * AC.CELL_SIZE;
        const y = AC.BOARD_Y + row * AC.CELL_SIZE;
        const isDark = (row + col) % 2 === 0;

        let cellColor;
        if (row >= 5) {
          // Player zone: blue-tinted cells
          cellColor = isDark ? '#1a2430' : '#1f2a38';
        } else if (row <= 2) {
          // Enemy zone: red-tinted cells
          cellColor = isDark ? '#2a1818' : '#301f1f';
        } else {
          // Neutral zone
          cellColor = isDark ? '#1c1c1c' : '#242424';
        }
        this.rect(x, y, AC.CELL_SIZE, AC.CELL_SIZE, cellColor);
      }
    }

    // Zone divider lines
    const midY1 = AC.BOARD_Y + 3 * AC.CELL_SIZE;
    const midY2 = AC.BOARD_Y + 5 * AC.CELL_SIZE;

    this.ctx.strokeStyle = '#553030';
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([]);
    this.ctx.beginPath();
    this.ctx.moveTo(AC.BOARD_X, midY1);
    this.ctx.lineTo(AC.BOARD_X + AC.BOARD_W, midY1);
    this.ctx.stroke();

    this.ctx.strokeStyle = '#305050';
    this.ctx.beginPath();
    this.ctx.moveTo(AC.BOARD_X, midY2);
    this.ctx.lineTo(AC.BOARD_X + AC.BOARD_W, midY2);
    this.ctx.stroke();

    // Zone labels
    this.ctx.globalAlpha = 0.6;
    this.pixelText('ENEMY', AC.BOARD_X + 4, AC.BOARD_Y + 4, '#c04040', 9);
    this.pixelText('敌方', AC.BOARD_X + AC.BOARD_W - 28, AC.BOARD_Y + 4, '#c04040', 8);

    this.pixelText('NEUTRAL', AC.BOARD_X + 4, AC.BOARD_Y + 3 * AC.CELL_SIZE + 4, '#555555', 8);

    this.pixelText('我方', AC.BOARD_X + 4, AC.BOARD_Y + 5 * AC.CELL_SIZE + 4, '#4080c0', 9);
    this.pixelText('PLAYER', AC.BOARD_X + AC.BOARD_W - 48, AC.BOARD_Y + 5 * AC.CELL_SIZE + 4, '#4080c0', 8);
    this.ctx.globalAlpha = 1.0;
  },

  drawCellHighlight(idx, color = '#f8f830', alpha = 0.4) {
    const col = idx % AC.BOARD_COLS;
    const row = Math.floor(idx / AC.BOARD_COLS);
    const x = AC.BOARD_X + col * AC.CELL_SIZE;
    const y = AC.BOARD_Y + row * AC.CELL_SIZE;
    this.rect(x, y, AC.CELL_SIZE, AC.CELL_SIZE, color);
    this.rectBorder(x, y, AC.CELL_SIZE, AC.CELL_SIZE, color, 2);
  },

  // ---- Piece Sprites ----

  drawSprite(spriteKey, sx, sy, scale = AC.SPRITE_PX, facingRight = true) {
    const pixels = AC.SPRITES[spriteKey];
    if (!pixels) return;

    const pw = pixels[0].length;
    const ph = pixels.length;

    for (let y = 0; y < ph; y++) {
      for (let x = 0; x < pw; x++) {
        const colorIdx = pixels[y][x];
        if (colorIdx === 0) continue; // transparent
        const srcX = facingRight ? x : (pw - 1 - x);
        this.rect(
          sx + srcX * scale,
          sy + y * scale,
          scale,
          scale,
          AC.PALETTE[colorIdx] || '#fff'
        );
      }
    }

    return { w: pw * scale, h: ph * scale };
  },

  // Draw piece centered in a board cell
  drawPieceInCell(idx, spriteKey, starLevel = 1, facingRight = true, alpha = 1.0) {
    const center = AC.Utils.cellCenter(idx);
    const spriteW = 14 * AC.SPRITE_PX;
    const spriteH = 16 * AC.SPRITE_PX;

    this.ctx.globalAlpha = alpha;
    this.drawSprite(spriteKey, center.x - spriteW / 2, center.y - spriteH / 2 + 4, AC.SPRITE_PX, facingRight);

    // Star indicator
    if (starLevel > 0) {
      const starColor = AC.STAR_COLORS[starLevel] || '#aaaaaa';
      const starY = center.y + spriteH / 2 - 6;
      const starStr = '★'.repeat(starLevel);
      this.text(starStr, center.x, starY, starColor, 10, 'monospace', 'center');
    }
    this.ctx.globalAlpha = 1.0;
  },

  // ---- HP / Mana Bars ----

  drawHPBar(idx, currentHP, maxHP) {
    const col = idx % AC.BOARD_COLS;
    const row = Math.floor(idx / AC.BOARD_COLS);
    const x = AC.BOARD_X + col * AC.CELL_SIZE + 4;
    const y = AC.BOARD_Y + row * AC.CELL_SIZE + 2;
    const w = AC.CELL_SIZE - 8;
    const h = 4;

    // Background
    this.rect(x, y, w, h, '#400000');
    // Fill
    const ratio = Math.max(0, currentHP / maxHP);
    const hpColor = ratio > 0.5 ? '#40d040' : ratio > 0.25 ? '#d0d040' : '#d04040';
    this.rect(x, y, w * ratio, h, hpColor);
  },

  drawManaBar(idx, currentMana, maxMana) {
    if (maxMana <= 0) return;
    const col = idx % AC.BOARD_COLS;
    const row = Math.floor(idx / AC.BOARD_COLS);
    const x = AC.BOARD_X + col * AC.CELL_SIZE + 4;
    const y = AC.BOARD_Y + row * AC.CELL_SIZE + 7;
    const w = AC.CELL_SIZE - 8;
    const h = 3;

    this.rect(x, y, w, h, '#000040');
    const ratio = Math.max(0, currentMana / maxMana);
    this.rect(x, y, w * ratio, h, '#4040f0');
  },

  // ---- Top Bar ----

  drawTopBar() {
    // Background
    this.rect(0, 0, AC.LOGICAL_W, AC.TOP_BAR_HEIGHT, '#151520');
    this.rect(0, AC.TOP_BAR_HEIGHT - 2, AC.LOGICAL_W, 2, '#303050');

    const p = AC.Player;
    if (!p) return;

    const y = 8;

    // HP
    this.text('HP', 16, y, '#f04040', 11, '"Press Start 2P"');
    this.text(p.hp + '', 16, y + 14, '#f04040', 17, 'monospace');
    // HP bar
    this.rect(50, y + 4, 100, 10, '#400000');
    this.rect(50, y + 4, 100 * (p.hp / AC.START_HP), 10, '#f04040');

    // Gold
    this.text('GOLD', 170, y, '#f4d448', 11, '"Press Start 2P"');
    this.text(p.gold + '', 170, y + 14, '#f4d448', 17, 'monospace');

    // Level
    this.text('LV', 260, y, '#44aaff', 11, '"Press Start 2P"');
    this.text(p.level + '', 260, y + 14, '#44aaff', 17, 'monospace');

    // XP
    const xpNeeded = AC.XP_TO_LEVEL[p.level + 1] || 0;
    this.text('XP', 310, y + 4, '#8888cc', 10, '"Press Start 2P"');
    this.text(p.xp + '/' + xpNeeded, 310, y + 14, '#8888cc', 13, 'monospace');

    // Round
    this.text('ROUND', 430, y, '#e8e8e8', 11, '"Press Start 2P"');
    this.text(p.round + '', 430, y + 14, '#e8e8e8', 17, 'monospace');

    // Streak
    if (p.winStreak >= 2) {
      this.text('W' + p.winStreak, 530, y + 8, '#ff8844', 15, 'monospace');
    } else if (p.loseStreak >= 2) {
      this.text('L' + p.loseStreak, 530, y + 8, '#888888', 15, 'monospace');
    }

    // State indicator
    const stateText = AC.state ? AC.state.current : 'LOADING';
    this.text(stateText, AC.LOGICAL_W - 16, y + 8, '#888888', 11, '"Press Start 2P"', 'right');
  },

  // ---- Synergy Panel ----

  drawSynergyPanel() {
    const p = AC.Player;
    if (!p) return;

    const sx = AC.SHOP_X;
    const sy = AC.BOARD_Y + AC.BOARD_H + 8;
    const panelW = AC.BOARD_X - 32;
    const panelH = AC.LOGICAL_H - sy - 8;

    this.rect(sx, sy, panelW, panelH, '#111118');
    this.rectBorder(sx, sy, panelW, panelH, '#303048');

    this.pixelText('SYNERGIES', sx + 4, sy + 4, '#888888', 9);

    const activeSyns = AC.Synergy ? AC.Synergy.getActiveSynergies() : [];
    let ty = sy + 16;

    for (const syn of activeSyns) {
      const color = syn.type === 'faction'
        ? AC.FACTIONS[syn.key]?.color || '#888'
        : '#c8c8c8';
      this.text(syn.name + ' ' + syn.count + '/' + syn.threshold,
        sx + 6, ty, color, 11, 'monospace');
      this.text(syn.effect, sx + 6, ty + 13, '#aaaaaa', 10, 'monospace');
      ty += 30;
      if (ty > sy + panelH - 20) break;
    }
  },

  // ---- Menu Screen ----

  drawMenu() {
    this.clear();

    // Title
    this.pixelText('AUTO CHESS', AC.LOGICAL_W / 2, 60, '#f4d448', 30, 'center');
    this.pixelText('蜀 山 幻 世', AC.LOGICAL_W / 2, 100, '#8cb8d4', 18, 'center');

    // Decorative sprites - smaller, above instructions
    this.drawSprite('warrior_sword', 120, 140, 3, true);
    this.drawSprite('mage_staff', 120, 200, 3, false);
    this.drawSprite('demon_king', 120, 260, 3, true);
    this.drawSprite('dragon_knight', 780, 140, 3, false);
    this.drawSprite('celestial_lord', 780, 200, 3, true);
    this.drawSprite('monster_beast', 780, 260, 3, false);

    // ---- Instructions Panel ----
    const px = 200;
    const py = 140;
    const pw = 560;
    const ph = 300;

    this.rect(px, py, pw, ph, '#0e0e18');
    this.rectBorder(px, py, pw, ph, '#303050');

    this.pixelText('HOW TO PLAY', px + pw / 2, py + 12, '#f4d448', 11, 'center');

    const instructions = [
      { label: '1. 购买棋子', desc: '点击左侧商店购买棋子，费用=星级' },
      { label: '2. 放置棋子', desc: '将棋子从备战区拖到下方蓝色棋盘' },
      { label: '3. 开始战斗', desc: '点击READY按钮或等待计时结束' },
      { label: '4. 自动战斗', desc: '棋子自动移动、攻击和释放技能' },
      { label: '5. 羁绊加成', desc: '同阵营/职业达到数量获得属性加成' },
      { label: '6. 棋子升星', desc: '3个相同棋子自动合成更高星级' },
      { label: '7. 购买经验', desc: '花费4金币购买4点经验提升等级' },
      { label: '8. 胜利条件', desc: '存活30轮即为通关' },
    ];

    let iy = py + 38;
    for (const inst of instructions) {
      this.text(inst.label, px + 14, iy, '#44aaff', 12, 'monospace');
      this.text(inst.desc, px + 140, iy, '#aaaacc', 12, 'monospace');
      iy += 30;
    }

    // Economy hint
    iy += 6;
    this.rect(px + 12, iy, pw - 24, 1, '#303050');
    iy += 8;
    this.text('提示：利息每10金币+1收入(上限5)，连胜利有额外金币', px + 14, iy, '#888866', 10, 'monospace');
    this.text('右键点击棋子可出售，刷新商店花费2金币', px + 14, iy + 20, '#888866', 10, 'monospace');

    // Start prompt
    const alpha = 0.5 + 0.5 * Math.sin(Date.now() / 800);
    this.ctx.globalAlpha = alpha;
    this.pixelText('>>> CLICK TO START <<<', AC.LOGICAL_W / 2, AC.LOGICAL_H - 50, '#f4d448', 13, 'center');
    this.ctx.globalAlpha = 1.0;

    // Footer
    this.text('Inspired by 蜀山传 · Pixel Art Auto Battler · 混合中西玄幻风格',
      AC.LOGICAL_W / 2, AC.LOGICAL_H - 20, '#444444', 10, 'monospace', 'center');
  },

  // ---- Game Over Screen ----

  drawGameOver() {
    // Overlay
    this.rect(0, 0, AC.LOGICAL_W, AC.LOGICAL_H, 'rgba(0, 0, 0, 0.7)');

    this.pixelText('GAME OVER', AC.LOGICAL_W / 2, 180, '#f04040', 26, 'center');

    const p = AC.Player;
    if (p) {
      this.text('Rounds Survived: ' + p.round, AC.LOGICAL_W / 2, 240, '#e8e8e8', 15, 'monospace', 'center');
      this.text('Final Level: ' + p.level, AC.LOGICAL_W / 2, 265, '#e8e8e8', 15, 'monospace', 'center');
      this.text('Total Pieces: ' + (p.bench.length + p.board.filter(c => c !== null).length),
        AC.LOGICAL_W / 2, 290, '#e8e8e8', 15, 'monospace', 'center');
    }

    const alpha = 0.5 + 0.5 * Math.sin(Date.now() / 800);
    this.ctx.globalAlpha = alpha;
    this.pixelText('CLICK TO PLAY AGAIN', AC.LOGICAL_W / 2, 380, '#888888', 13, 'center');
    this.ctx.globalAlpha = 1.0;
  },

  // ---- Floating Damage Numbers ----

  drawFloatingText(text, x, y, color = '#ffffff', size = 14) {
    this.text(text, x, y, color, size, 'monospace', 'center');
  },

  // ---- Shop ----

  _shopRects: [],
  _rerollRect: null,

  drawShop() {
    const p = AC.Player;
    if (!p || (AC.state.current !== 'PREPARATION' && AC.state.current !== 'BATTLE')) return;

    const sx = AC.SHOP_X;
    const sy = AC.SHOP_Y;
    const slotSize = AC.SHOP_SLOT_SIZE;
    const gap = 4;

    this._shopRects = [];

    for (let i = 0; i < AC.SHOP_COUNT; i++) {
      const x = sx;
      const y = sy + i * (slotSize + gap);
      this._shopRects.push({ x, y, w: slotSize, h: slotSize });

      // Slot background
      this.rect(x, y, slotSize, slotSize, '#1a1a2a');
      this.rectBorder(x, y, slotSize, slotSize, '#404058');

      if (i < AC.Shop.slots.length) {
        const pieceId = AC.Shop.slots[i];
        const data = AC.PIECE_DATA[pieceId];
        if (data) {
          // Draw sprite
          this.drawSprite(data.spriteKey, x + 4, y + 4, 2.5, true);
          // Cost
          const costColor = data.tier >= 4 ? '#f4d448' : data.tier >= 3 ? '#44aaff' : '#aaaaaa';
          this.text(data.tier + 'g', x + slotSize - 16, y + slotSize - 14, costColor, 12, 'monospace', 'right');
          // Name
          this.text(data.nameCN, x + 2, y + slotSize - 14, '#ccc', 10, 'monospace');
        }
      }
    }

    // Reroll button
    const rerollY = sy + AC.SHOP_COUNT * (slotSize + gap) + 4;
    this._rerollRect = { x: sx, y: rerollY, w: slotSize, h: 28 };
    this.rect(sx, rerollY, slotSize, 28, '#303050');
    this.rectBorder(sx, rerollY, slotSize, 28, '#505070');
    this.text('⟳ 2g', sx + slotSize / 2, rerollY + 4, '#f4d448', 12, 'monospace', 'center');

    // Sell zone
    const sellY = rerollY + 32;
    this.rect(sx, sellY, slotSize, 24, '#402020');
    this.rectBorder(sx, sellY, slotSize, 24, '#603030');
    this.text('SELL', sx + slotSize / 2, sellY + 3, '#f04040', 11, 'monospace', 'center');
  },

  // ---- Bench ----

  _benchRects: [],

  drawBench() {
    const p = AC.Player;
    if (!p) return;

    const bx = AC.BENCH_X;
    const by = AC.BENCH_Y;
    const slotSize = AC.BENCH_SLOT_SIZE;
    const gap = 4;

    // Label
    this.text('BENCH', bx, by - 18, '#888888', 11, '"Press Start 2P"');

    this._benchRects = [];

    for (let i = 0; i < AC.MAX_BENCH; i++) {
      const y = by + i * (slotSize + gap);
      this._benchRects.push({ x: bx, y, w: slotSize, h: slotSize });

      if (i < p.bench.length && p.bench[i]) {
        const piece = p.bench[i];
        this.rect(bx, y, slotSize, slotSize, '#1a1a2a');
        this.rectBorder(bx, y, slotSize, slotSize, '#404058');
        this.drawSprite(piece.spriteKey, bx + 4, y + 4, 2.5, true);
        // Star indicator
        const starStr = '★'.repeat(piece.starLevel);
        this.text(starStr, bx + slotSize / 2, y + slotSize - 12,
          AC.STAR_COLORS[piece.starLevel], 10, 'monospace', 'center');
      } else {
        this.rect(bx, y, slotSize, slotSize, '#111118');
        this.rectBorder(bx, y, slotSize, slotSize, '#282830');
      }
    }
  },

  // ---- Buttons ----

  _readyButtonRect: null,
  _levelUpRect: null,

  drawReadyButton() {
    if (AC.state.current !== 'PREPARATION') return;

    const bx = AC.BOARD_X + AC.BOARD_W + 16;
    const by = AC.BOARD_Y + AC.BOARD_H - 40;
    const bw = 100;
    const bh = 32;

    this._readyButtonRect = { x: bx, y: by, w: bw, h: bh };

    const timer = Math.ceil(Math.max(0, AC.state.prepTimer));
    const color = timer <= 5 ? '#f04040' : '#40d040';

    this.rect(bx, by, bw, bh, '#203020');
    this.rectBorder(bx, by, bw, bh, color, 2);
    this.pixelText('READY', bx + bw / 2, by + 3, color, 11, 'center');
    this.text(timer + 's', bx + bw / 2, by + 18, color, 14, 'monospace', 'center');

    // Prep hint for new players
    if (AC.Player.round <= 2) {
      const hintX = AC.BOARD_X + AC.BOARD_W + 16;
      const hintY = AC.BOARD_Y + AC.BOARD_H - 120;
      this.text('购买棋子→拖到', hintX, hintY, '#888888', 10, 'monospace');
      this.text('蓝色区域→READY', hintX, hintY + 14, '#888888', 10, 'monospace');
    }
  },

  drawLevelUpButton() {
    if (AC.state.current !== 'PREPARATION') return;
    if (AC.Player.level >= 10) return;

    const bx = AC.BOARD_X + AC.BOARD_W + 16;
    const by = AC.BOARD_Y + AC.BOARD_H - 80;
    const bw = 100;
    const bh = 32;

    this._levelUpRect = { x: bx, y: by, w: bw, h: bh };

    const affordable = AC.Player.canAfford(AC.XP_COST);
    const color = affordable ? '#44aaff' : '#666666';

    this.rect(bx, by, bw, bh, '#102030');
    this.rectBorder(bx, by, bw, bh, color, 1);
    this.text('BUY XP', bx + bw / 2, by + 3, color, 11, 'monospace', 'center');
    this.text(AC.XP_COST + 'g → ' + AC.XP_PER_BUY + 'XP', bx + bw / 2, by + 20, color, 10, 'monospace', 'center');
  },

  // ---- Tooltip ----

  drawTooltip() {
    const mx = AC.Input.mouse.x;
    const my = AC.Input.mouse.y;

    // Check board
    const cellIdx = AC.Input.hoveredCell;
    if (cellIdx >= 0) {
      const pieceId = AC.Player.board[cellIdx];
      if (pieceId) {
        const piece = AC.Player.getPieceById(pieceId);
        if (piece) {
          this._drawPieceTooltip(piece, mx, my);
          return;
        }
      }
      // Check enemy pieces during battle
      if (AC.Enemy.pieces) {
        for (const ep of AC.Enemy.pieces) {
          if (ep && !ep.isDead && ep.boardIndex === cellIdx) {
            this._drawPieceTooltip(ep, mx, my, true);
            return;
          }
        }
      }
    }

    // Check shop
    if (AC.Renderer._shopRects && AC.state.current === 'PREPARATION') {
      for (let i = 0; i < AC.Renderer._shopRects.length; i++) {
        const r = AC.Renderer._shopRects[i];
        if (r && mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) {
          if (i < AC.Shop.slots.length) {
            const data = AC.PIECE_DATA[AC.Shop.slots[i]];
            if (data) this._drawDataTooltip(data, mx, my);
          }
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
          if (piece) this._drawPieceTooltip(piece, mx, my);
          return;
        }
      }
    }
  },

  _drawPieceTooltip(piece, mx, my, isEnemy = false) {
    const w = 200;
    const h = 130;
    let tx = Math.min(mx + 16, AC.LOGICAL_W - w - 8);
    let ty = Math.min(my + 16, AC.LOGICAL_H - h - 8);

    this.rect(tx, ty, w, h, 'rgba(10, 10, 20, 0.95)');
    this.rectBorder(tx, ty, w, h, '#505070');

    const factionData = AC.FACTIONS[piece.faction];
    const classData = AC.CLASSES[piece.className];
    const starColor = AC.STAR_COLORS[piece.starLevel];

    this.text('★'.repeat(piece.starLevel) + ' ' + piece.nameCN, tx + 6, ty + 4, starColor, 12, 'monospace');
    this.text(piece.name, tx + 6, ty + 18, '#888', 10, 'monospace');

    this.text(factionData.name + ' · ' + classData.name, tx + 6, ty + 32, factionData.color, 11, 'monospace');

    // Stats
    const atk = piece.currentAttack();
    const def = piece.currentDefense();
    const hp = piece.currentHP;
    const mhp = piece.currentMaxHP();

    this.text('HP: ' + hp + '/' + mhp, tx + 6, ty + 46, '#40d040', 11, 'monospace');
    this.text('ATK: ' + atk + '  DEF: ' + def, tx + 6, ty + 60, '#e8e8e8', 11, 'monospace');
    this.text('SPD: ' + piece.currentAttackSpeed().toFixed(2), tx + 6, ty + 74, '#e8e8e8', 11, 'monospace');
    this.text('Range: ' + piece.range, tx + 6, ty + 88, '#e8e8e8', 11, 'monospace');

    if (piece.data.ability) {
      this.text(piece.data.ability.name + ': ' + piece.data.ability.desc,
        tx + 6, ty + 102, '#f4d448', 10, 'monospace');
    }
  },

  _drawDataTooltip(data, mx, my) {
    const w = 180;
    const h = 120;
    let tx = Math.min(mx + 16, AC.LOGICAL_W - w - 8);
    let ty = Math.min(my + 16, AC.LOGICAL_H - h - 8);

    this.rect(tx, ty, w, h, 'rgba(10, 10, 20, 0.95)');
    this.rectBorder(tx, ty, w, h, '#505070');

    const factionData = AC.FACTIONS[data.faction];
    const classData = AC.CLASSES[data.class];
    const tierColor = data.tier >= 4 ? '#f4d448' : data.tier >= 3 ? '#44aaff' : '#aaaaaa';

    this.text('T' + data.tier + ' ' + data.nameCN, tx + 6, ty + 4, tierColor, 12, 'monospace');
    this.text(data.name, tx + 6, ty + 18, '#888', 10, 'monospace');
    this.text(factionData.name + ' · ' + classData.name, tx + 6, ty + 32, factionData.color, 11, 'monospace');

    this.text('HP: ' + data.hp[0] + '/' + data.hp[1] + '/' + data.hp[2], tx + 6, ty + 48, '#40d040', 10, 'monospace');
    this.text('ATK: ' + data.attack[0] + '/' + data.attack[1] + '/' + data.attack[2], tx + 6, ty + 62, '#e8e8e8', 10, 'monospace');
    this.text('DEF: ' + data.defense[0] + '/' + data.defense[1] + '/' + data.defense[2], tx + 6, ty + 76, '#e8e8e8', 10, 'monospace');

    if (data.ability) {
      this.text(data.ability.name, tx + 6, ty + 92, '#f4d448', 10, 'monospace');
    }
  },

  // ---- Round Result ----

  drawRoundResult() {
    const overlayAlpha = 0.6;
    this.rect(0, AC.TOP_BAR_HEIGHT, AC.LOGICAL_W, AC.LOGICAL_H - AC.TOP_BAR_HEIGHT,
      'rgba(0, 0, 0, ' + overlayAlpha + ')');

    const cx = AC.LOGICAL_W / 2;
    const cy = AC.LOGICAL_H / 2 - 30;

    const won = AC.Player._lastBattleResult;

    if (won) {
      this.pixelText('VICTORY!', cx, cy, '#f4d448', 20, 'center');
    } else {
      const surviving = AC.Enemy.getSurvivingCount();
      const damage = surviving * AC.HP_DAMAGE_PER_ENEMY;
      this.pixelText('DEFEAT', cx, cy, '#f04040', 20, 'center');
      this.text('-' + damage + ' HP', cx, cy + 28, '#f04040', 15, 'monospace', 'center');
    }

    // Income breakdown
    const interest = AC.Player.getInterest();
    const streakGold = AC.Player.getStreakGold();
    const total = AC.BASE_INCOME + interest + streakGold;

    this.text('Income: ' + AC.BASE_INCOME + ' + ' + interest + ' (int) + ' + streakGold + ' (streak) = ' + total + 'g',
      cx, cy + 54, '#f4d448', 12, 'monospace', 'center');

    const alpha = 0.5 + 0.5 * Math.sin(Date.now() / 600);
    this.ctx.globalAlpha = alpha;
    this.text('CLICK TO CONTINUE', cx, cy + 80, '#888888', 12, 'monospace', 'center');
    this.ctx.globalAlpha = 1.0;
  },
};
