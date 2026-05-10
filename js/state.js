// Auto Chess - State Machine
window.AC = window.AC || {};

AC.state = {
  current: 'MENU',
  prepTimer: 0,
  battleTimer: 0,
};

AC.StateMachine = {

  setState(newState) {
    AC.state.current = newState;
    if (newState === 'PREPARATION') {
      AC.state.prepTimer = AC.PREP_DURATION;
      AC.Shop.refreshShop();
      // Check for piece upgrades
      AC.Player.checkUpgrades();
      // Reset piece states
      AC.Player.resetPieces();
      AC.Enemy.pieces = [];
    }
    if (newState === 'BATTLE') {
      AC.state.battleTimer = AC.BATTLE_DURATION;
      AC.Battle.startBattle();
    }
    if (newState === 'ROUND_RESULT') {
      AC.Player.processRoundResult();
    }
  },

  startGame() {
    AC.Player.reset();
    AC.Enemy.pieces = [];
    AC.Battle.floatingTexts = [];
    this.setState('PREPARATION');
  },

  startBattle() {
    this.setState('BATTLE');
  },

  nextRound() {
    AC.Player.round++;
    AC.Player.gainXp(2); // Auto XP per round
    this.setState('PREPARATION');
  },

  endBattle(playerWon) {
    AC.Player._lastBattleResult = playerWon;
    this.setState('ROUND_RESULT');
  },

  gameOver() {
    this.setState('GAME_OVER');
  },

  updateTimers(dt) {
    if (AC.state.current === 'PREPARATION') {
      AC.state.prepTimer -= dt;
      if (AC.state.prepTimer <= 0) {
        this.startBattle();
      }
    }
    if (AC.state.current === 'BATTLE') {
      AC.state.battleTimer -= dt;
      if (AC.state.battleTimer <= 0) {
        // Time's up - total HP decides
        AC.Battle.resolveByTimeout();
      }
    }
  },
};
