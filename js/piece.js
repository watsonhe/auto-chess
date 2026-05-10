// Auto Chess - Piece Instance Class
window.AC = window.AC || {};

AC.PieceInstance = class PieceInstance {
  constructor(pieceId, starLevel = 1) {
    const data = AC.PIECE_DATA[pieceId];
    if (!data) throw new Error('Unknown piece: ' + pieceId);

    this.pieceId = pieceId;
    this.instanceId = AC.Utils.uid();
    this.starLevel = starLevel;
    this.data = data;

    this.currentHP = this.baseStats().hp;
    this.maxHP = this.baseStats().hp;
    this.attack = this.baseStats().atk;
    this.defense = this.baseStats().def;
    this.attackSpeed = data.attackSpeed;
    this.range = data.range;
    this.mana = data.mana[0] || 0;
    this.maxMana = data.mana[1] || 0;

    this.boardIndex = -1;
    this.facingRight = true;
    this.attackCooldown = 0;
    this.isDead = false;

    this.bonusHP = 0;
    this.bonusATK = 0;
    this.bonusDEF = 0;
    this.bonusASPD = 0;

    this.animX = 0;
    this.animY = 0;
    this.animTargetX = 0;
    this.animTargetY = 0;
    this.isMoving = false;
  }

  get faction() { return this.data.faction; }
  get className() { return this.data.class; }
  get name() { return this.data.name; }
  get nameCN() { return this.data.nameCN; }
  get tier() { return this.data.tier; }
  get spriteKey() { return this.data.spriteKey; }

  baseStats() {
    const hp = this.data.hp[this.starLevel - 1];
    const atk = this.data.attack[this.starLevel - 1];
    const def = this.data.defense[this.starLevel - 1];
    return { hp, atk, def };
  }

  currentAttack() {
    return this.attack + this.bonusATK;
  }

  currentDefense() {
    return this.defense + this.bonusDEF;
  }

  currentMaxHP() {
    return this.maxHP + this.bonusHP;
  }

  currentAttackSpeed() {
    return this.attackSpeed + this.bonusASPD;
  }

  takeDamage(rawDamage) {
    const def = this.currentDefense();
    const multiplier = 100 / (100 + Math.max(0, def));
    const damage = Math.max(1, Math.floor(rawDamage * multiplier));
    this.currentHP -= damage;
    if (this.currentHP <= 0) {
      this.currentHP = 0;
      this.isDead = true;
    }
    return damage;
  }

  heal(amount) {
    const max = this.currentMaxHP();
    this.currentHP = Math.min(max, this.currentHP + amount);
  }

  gainMana(amount) {
    if (this.maxMana <= 0) return false;
    this.mana = Math.min(this.maxMana, this.mana + amount);
    return this.mana >= this.maxMana;
  }

  canCast() {
    return this.maxMana > 0 && this.mana >= this.maxMana;
  }

  castAbility(target) {
    if (!this.canCast()) return null;
    this.mana = 0;
    if (this.data.ability && this.data.ability.onCast) {
      return this.data.ability.onCast(this, target);
    }
    return null;
  }

  resetForBattle() {
    const base = this.baseStats();
    this.maxHP = base.hp;
    this.currentHP = base.hp;
    this.attack = base.atk;
    this.defense = base.def;
    this.mana = this.data.mana[0] || 0;
    this.attackCooldown = 0;
    this.isDead = false;
    this.bonusHP = 0;
    this.bonusATK = 0;
    this.bonusDEF = 0;
    this.bonusASPD = 0;
    this.isMoving = false;
  }
};
