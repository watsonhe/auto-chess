// Auto Chess - Main Bootstrap & Game Loop
window.AC = window.AC || {};

(function() {
  let lastTime = 0;
  let accumulator = 0;

  function gameLoop(timestamp) {
    if (lastTime === 0) lastTime = timestamp;
    const dt = Math.min(timestamp - lastTime, 200); // Cap at 200ms to avoid spiral
    lastTime = timestamp;

    // Update timers
    if (AC.StateMachine) AC.StateMachine.updateTimers(dt / 1000);

    // Update battle
    if (AC.state && AC.state.current === 'BATTLE') {
      accumulator += dt;
      while (accumulator >= AC.TICK_RATE) {
        if (AC.Battle) { AC.Battle.tick(); AC.Battle.updateFloatingTexts(); }
        accumulator -= AC.TICK_RATE;
      }
    }

    // Handle input
    if (AC.Input) AC.Input.update();

    // Render
    AC.Renderer.clear();

    if (!AC.state || AC.state.current === 'MENU') {
      AC.Renderer.drawMenu();
    } else {
      // Board always visible
      AC.Renderer.drawBoard();

      // Draw enemy pieces
      if (AC.Enemy && AC.Enemy.pieces) {
        for (const ep of AC.Enemy.pieces) {
          if (ep && !ep.isDead && ep.boardIndex >= 0) {
            AC.Renderer.drawPieceInCell(ep.boardIndex, ep.spriteKey, ep.starLevel, false);
            if (AC.state.current === 'BATTLE') {
              AC.Renderer.drawHPBar(ep.boardIndex, ep.currentHP, ep.maxHP);
              AC.Renderer.drawManaBar(ep.boardIndex, ep.mana, ep.maxMana);
            }
          }
        }
      }

      // Draw player pieces on board
      for (let i = 0; i < 64; i++) {
        const pieceId = AC.Player.board[i];
        if (pieceId) {
          const piece = AC.Player.getPieceById(pieceId);
          if (piece && !piece.isDead) {
            // Don't draw piece being dragged at its cell
            if (AC.Input && AC.Input.dragPiece === piece) continue;
            AC.Renderer.drawPieceInCell(i, piece.spriteKey, piece.starLevel, true);
            if (AC.state.current === 'BATTLE') {
              AC.Renderer.drawHPBar(i, piece.currentHP, piece.maxHP);
              AC.Renderer.drawManaBar(i, piece.mana, piece.maxMana);
            }
          }
        }
      }

      // Draw bench
      if (AC.Renderer.drawBench) AC.Renderer.drawBench();

      // Draw shop
      if (AC.Renderer.drawShop) AC.Renderer.drawShop();

      // Draw synergy panel
      AC.Renderer.drawSynergyPanel();

      // Draw top bar
      AC.Renderer.drawTopBar();

      // Draw drag ghost
      if (AC.Input && AC.Input.dragPiece) {
        const dp = AC.Input.dragPiece;
        const mx = AC.Input.mouse.x;
        const my = AC.Input.mouse.y;
        const sw = 14 * AC.SPRITE_PX;
        const sh = 16 * AC.SPRITE_PX;
        AC.Renderer.drawSprite(dp.spriteKey, mx - sw / 2, my - sh / 2, AC.SPRITE_PX, true);
      }

      // Draw hover tooltip
      if (AC.Renderer.drawTooltip) AC.Renderer.drawTooltip();

      // Draw ready button
      if (AC.Renderer.drawReadyButton) AC.Renderer.drawReadyButton();

      // Draw level-up button
      if (AC.Renderer.drawLevelUpButton) AC.Renderer.drawLevelUpButton();

      // Draw game over
      if (AC.state.current === 'GAME_OVER') {
        AC.Renderer.drawGameOver();
      }

      // Draw floating texts
      if (AC.Battle && AC.Battle.floatingTexts) {
        for (const ft of AC.Battle.floatingTexts) {
          AC.Renderer.drawFloatingText(ft.text, ft.x, ft.y, ft.color, 10);
        }
      }

      // Draw round result
      if (AC.Renderer.drawRoundResult && AC.state.current === 'ROUND_RESULT') {
        AC.Renderer.drawRoundResult();
      }
    }

    requestAnimationFrame(gameLoop);
  }

  // Initialize
  AC.Renderer.init();

  // Setup input handlers
  AC.Input.init(AC.Renderer.canvas);

  // Set initial state to MENU
  AC.StateMachine.setState('MENU');

  // Start game loop
  requestAnimationFrame(gameLoop);
})();
