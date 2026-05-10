// Auto Chess - Battle System
window.AC = window.AC || {};

AC.Battle = {
  floatingTexts: [],
  _tickCount: 0,
  _enemyPieces: [],
  _playerPieces: [],

  startBattle() {
    this.floatingTexts = [];
    this._tickCount = 0;

    // Get player board pieces
    this._playerPieces = AC.Player.getBoardPieces();

    // Generate enemy wave
    AC.Enemy.generateWave(AC.Player.round);
    this._enemyPieces = AC.Enemy.pieces;

    // Reset all pieces for battle (clears bonuses)
    for (const p of this._playerPieces) p.resetForBattle();
    for (const p of this._enemyPieces) p.resetForBattle();

    // Apply synergies after reset (may buff allies and debuff enemies)
    AC.Synergy.applySynergies(this._playerPieces);

    // Set facing direction
    for (const p of this._playerPieces) p.facingRight = true;
    for (const p of this._enemyPieces) p.facingRight = false;
  },

  tick() {
    this._tickCount++;

    const dt = AC.TICK_RATE / 1000; // seconds

    // Process all alive pieces
    const allCombatants = [...this._playerPieces, ...this._enemyPieces];

    for (const piece of allCombatants) {
      if (piece.isDead) continue;

      // Decrease attack cooldown
      if (piece.attackCooldown > 0) {
        piece.attackCooldown -= dt;
      }

      // Determine enemies for this piece
      const enemies = piece.facingRight ? this._enemyPieces : this._playerPieces;

      // Find target
      const target = AC.Board.findNearestEnemy(piece.boardIndex, enemies);
      if (!target) continue; // No targets left

      // Check if in range
      if (AC.Utils.inRange(piece.boardIndex, target.boardIndex, piece.range)) {
        // Attack if cooldown is up
        if (piece.attackCooldown <= 0) {
          this._performAttack(piece, target);
        }
      } else {
        // Move toward target
        this._moveToward(piece, target);
      }

      // Check for ability cast
      if (piece.canCast()) {
        const tgt = AC.Board.findNearestEnemy(piece.boardIndex, enemies);
        piece.castAbility(tgt);
        this.addFloatingText('ABILITY!', piece.boardIndex, '#f4d448');
      }
    }

    // Remove dead pieces from board
    for (const piece of allCombatants) {
      if (piece.isDead && piece.boardIndex >= 0) {
        if (piece.facingRight) {
          AC.Player.board[piece.boardIndex] = null;
        }
        piece.boardIndex = -1;
      }
    }

    // Check win conditions
    const playerAlive = this._playerPieces.some(p => !p.isDead);
    const enemyAlive = this._enemyPieces.some(p => !p.isDead);

    if (!enemyAlive) {
      AC.StateMachine.endBattle(true);
    } else if (!playerAlive) {
      AC.StateMachine.endBattle(false);
    }
  },

  _performAttack(attacker, target) {
    const damage = target.takeDamage(attacker.currentAttack());
    attacker.attackCooldown = 1.0 / Math.max(0.1, attacker.currentAttackSpeed());
    attacker.gainMana(AC.MANA_PER_ATTACK);

    // Visual feedback
    this.addFloatingText('-' + damage, target.boardIndex, '#f04040');

    // Grant attacker mana for kill
    if (target.isDead) {
      attacker.gainMana(20);
    }
  },

  _moveToward(piece, target) {
    const nextIdx = AC.Utils.stepToward(piece.boardIndex, target.boardIndex);
    if (nextIdx === piece.boardIndex) return; // Can't move

    // Check if target cell is occupied
    if (AC.Board.isOccupied(nextIdx)) {
      // Try alternate axis
      const sx = piece.boardIndex % AC.BOARD_COLS;
      const sy = Math.floor(piece.boardIndex / AC.BOARD_COLS);
      const dx = target.boardIndex % AC.BOARD_COLS;
      const dy = Math.floor(target.boardIndex / AC.BOARD_COLS);

      // Try the other axis
      if (Math.abs(dx - sx) >= Math.abs(dy - sy)) {
        // Was moving horizontal, try vertical
        const altIdx = AC.Utils.xyToIdx(sx, sy + Math.sign(dy - sy));
        if (altIdx >= 0 && !AC.Board.isOccupied(altIdx)) {
          this._doMove(piece, altIdx);
          return;
        }
      } else {
        // Was moving vertical, try horizontal
        const altIdx = AC.Utils.xyToIdx(sx + Math.sign(dx - sx), sy);
        if (altIdx >= 0 && !AC.Board.isOccupied(altIdx)) {
          this._doMove(piece, altIdx);
          return;
        }
      }
      return; // Blocked
    }

    this._doMove(piece, nextIdx);
  },

  _doMove(piece, newIdx) {
    if (piece.facingRight) {
      AC.Player.board[piece.boardIndex] = null;
      AC.Player.board[newIdx] = piece.instanceId;
    }
    piece.boardIndex = newIdx;
  },

  resolveByTimeout() {
    // Total HP decides (player wins ties)
    const playerHP = this._playerPieces.reduce((sum, p) => sum + Math.max(0, p.currentHP), 0);
    const enemyHP = this._enemyPieces.reduce((sum, p) => sum + Math.max(0, p.currentHP), 0);
    AC.StateMachine.endBattle(playerHP >= enemyHP);
  },

  addFloatingText(text, boardIndex, color = '#ffffff') {
    const center = AC.Utils.cellCenter(boardIndex);
    this.floatingTexts.push({
      text,
      x: center.x + AC.Utils.randInt(-8, 8),
      y: center.y - 20,
      color,
      life: 1.0,
    });
    // Limit floating texts
    if (this.floatingTexts.length > 30) {
      this.floatingTexts.shift();
    }
  },

  // Called from main loop to update floating text lifetimes
  updateFloatingTexts() {
    for (const ft of this.floatingTexts) {
      ft.life -= AC.TICK_RATE / 1000;
      ft.y -= 0.5;
    }
    this.floatingTexts = this.floatingTexts.filter(ft => ft.life > 0);
  },
};
