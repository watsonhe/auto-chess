// Auto Chess - Configuration & Constants
window.AC = window.AC || {};

// ---- Canvas & Layout ----
AC.LOGICAL_W = 960;
AC.LOGICAL_H = 640;
AC.CELL_SIZE = 56;
AC.BOARD_COLS = 8;
AC.BOARD_ROWS = 8;
AC.BOARD_X = 256;
AC.BOARD_Y = 96;
AC.BOARD_W = AC.BOARD_COLS * AC.CELL_SIZE;
AC.BOARD_H = AC.BOARD_ROWS * AC.CELL_SIZE;
AC.SPRITE_PX = 3; // Scale factor for sprite pixels (14x16 sprite → 42x48 on screen)

// ---- Shop / Bench Layout ----
AC.SHOP_X = 16;
AC.SHOP_Y = 96;
AC.SHOP_SLOT_SIZE = 48;
AC.SHOP_SLOTS = 5;

AC.BENCH_X = AC.BOARD_X + AC.BOARD_W + 16;
AC.BENCH_Y = AC.BOARD_Y;
AC.BENCH_SLOTS = 8;
AC.BENCH_SLOT_SIZE = 48;

// ---- UI Zones ----
AC.TOP_BAR_HEIGHT = 60;

// ---- Color Palette (indexed) ----
AC.PALETTE = {
  // 0 = transparent
  1:  '#f4d4a8',  // skin_light
  2:  '#c49478',  // skin_dark
  3:  '#d4e8f4',  // ice_blue (Shushan)
  4:  '#8cb8d4',  // ice_dark
  5:  '#c8dce8',  // silver
  6:  '#dc2848',  // crimson (Demon Sect)
  7:  '#7c1428',  // blood_dark
  8:  '#3c1428',  // dark_purple
  9:  '#48a048',  // forest_green (Monster)
  10: '#6c5434',  // brown
  11: '#d4c8a0',  // bone_white
  12: '#708090',  // steel_gray (Mortal)
  13: '#1c3c5c',  // navy_blue
  14: '#f4d448',  // gold (Celestial)
  15: '#e8f4f4',  // bright_cyan
  16: '#48a878',  // jade_green (Dragon)
  17: '#d4783c',  // bronze
  18: '#e87830',  // fiery_orange
  19: '#282828',  // dark_bg
  20: '#484848',  // mid_gray
  21: '#f8f8f8',  // white
  22: '#f04040',  // hp_red
  23: '#4040f0',  // mana_blue
  24: '#f4d448',  // gold_yellow
  25: '#202020',  // shadow
  26: '#181818',  // cell_dark
  27: '#2a2a2a',  // cell_light
  28: '#f88030',  // highlight
  29: '#888888',  // disabled
  30: '#604020',  // wood
};

// ---- Star Color Coding ----
AC.STAR_COLORS = {
  1: '#aaaaaa',
  2: '#44aaff',
  3: '#ffaa00'
};

// ---- Game Constants ----
AC.MAX_BENCH = 8;
AC.SHOP_COUNT = 5;
AC.REROLL_COST = 2;
AC.XP_COST = 4;
AC.XP_PER_BUY = 4;
AC.BASE_INCOME = 5;
AC.MAX_INTEREST = 5;
AC.INTEREST_RATE = 10;
AC.START_GOLD = 10;
AC.START_HP = 100;
AC.START_LEVEL = 3;
AC.BATTLE_DURATION = 30; // seconds
AC.PREP_DURATION = 30;
AC.TICK_RATE = 100; // ms per battle tick
AC.HP_DAMAGE_PER_ENEMY = 2;
AC.MANA_PER_ATTACK = 10;
AC.ABILITY_MANA_MULT = 1.5;

// XP needed to reach each level (index = target level, value = XP needed from previous level)
AC.XP_TO_LEVEL = [0, 0, 2, 2, 6, 10, 20, 36, 56, 80, 100];
// Max units on board by level
AC.MAX_UNITS = [0, 3, 3, 4, 5, 6, 7, 8, 9, 10, 10];

// Tier appearance rates by player level [level][tier-1]
AC.TIER_RATES = [
  null,
  [1.00, 0.00, 0.00, 0.00, 0.00],  // Lv 1
  [1.00, 0.00, 0.00, 0.00, 0.00],  // Lv 2
  [0.70, 0.25, 0.05, 0.00, 0.00],  // Lv 3
  [0.50, 0.35, 0.15, 0.00, 0.00],  // Lv 4
  [0.35, 0.35, 0.25, 0.05, 0.00],  // Lv 5
  [0.20, 0.35, 0.30, 0.15, 0.00],  // Lv 6
  [0.14, 0.30, 0.30, 0.21, 0.05],  // Lv 7
  [0.10, 0.20, 0.30, 0.30, 0.10],  // Lv 8
  [0.05, 0.15, 0.25, 0.35, 0.20],  // Lv 9
  [0.02, 0.10, 0.20, 0.35, 0.33],  // Lv 10
];

// Star upgrade stats multiplier (multiply base stats)
AC.STAR_MULTIPLIER = {
  1: { hp: 1.0, atk: 1.0, def: 1.0 },
  2: { hp: 1.8, atk: 1.8, def: 1.5 },
  3: { hp: 3.24, atk: 3.24, def: 2.25 },
};

// ---- Factions & Classes ----
AC.FACTIONS = {
  shushan:       { name: '蜀山', nameEN: 'Shushan', color: '#8cb8d4' },
  demon_sect:    { name: '魔教', nameEN: 'Demon Sect', color: '#dc2848' },
  monster_clan:  { name: '妖族', nameEN: 'Monster Clan', color: '#48a048' },
  mortal_kingdom:{ name: '人间', nameEN: 'Mortal Kingdom', color: '#708090' },
  celestial:     { name: '仙庭', nameEN: 'Celestial Court', color: '#f4d448' },
  dragon:        { name: '龙族', nameEN: 'Dragon Temple', color: '#d4783c' },
};

AC.CLASSES = {
  warrior:  { name: '战士', nameEN: 'Warrior', icon: 'W' },
  guardian: { name: '护卫', nameEN: 'Guardian', icon: 'G' },
  assassin: { name: '刺客', nameEN: 'Assassin', icon: 'A' },
  mage:     { name: '法师', nameEN: 'Mage', icon: 'M' },
  ranger:   { name: '射手', nameEN: 'Ranger', icon: 'R' },
  warlock:  { name: '术士', nameEN: 'Warlock', icon: 'L' },
};

// ============================================================
//  PIECE DATA
//  Stats are [1-star, 2-star, 3-star] for hp, attack, defense
// ============================================================
AC.PIECE_DATA = {

  // ===== 蜀山 Shushan (Ice/Sword Immortals) =====
  li_yingqi: {
    id: 'li_yingqi', name: 'Li Yingqi', nameCN: '李英奇',
    faction: 'shushan', class: 'warrior', tier: 1,
    hp: [500, 900, 1620], attack: [50, 90, 162], defense: [25, 45, 81],
    attackSpeed: 0.8, range: 1, mana: [0, 80],
    ability: { name: 'Sky Sword', desc: 'Deals 200% ATK to target',
      onCast: (self, target) => { if (target) target.takeDamage(self.currentAttack() * 2); } },
    spriteKey: 'warrior_sword',
  },
  xuan_tianzong: {
    id: 'xuan_tianzong', name: 'Xuan Tianzong', nameCN: '玄天宗',
    faction: 'shushan', class: 'assassin', tier: 3,
    hp: [600, 1080, 1944], attack: [70, 126, 226], defense: [20, 36, 64],
    attackSpeed: 1.0, range: 1, mana: [0, 60],
    ability: { name: 'Thunder Flash', desc: 'Teleports to lowest HP enemy, deals 250% ATK',
      onCast: (self, target) => { if (target) target.takeDamage(self.currentAttack() * 2.5); } },
    spriteKey: 'immortal_glow',
  },
  bai_mei: {
    id: 'bai_mei', name: 'Bai Mei', nameCN: '白眉真人',
    faction: 'shushan', class: 'mage', tier: 5,
    hp: [550, 990, 1782], attack: [85, 153, 275], defense: [15, 27, 48],
    attackSpeed: 0.65, range: 3, mana: [30, 100],
    ability: { name: '浩瀚星河', desc: 'Deals 150% ATK to all enemies',
      onCast: (self, target) => {
        const enemies = AC.Battle._enemyPieces;
        for (const e of enemies) { if (!e.isDead) e.takeDamage(self.currentAttack() * 1.5); }
      } },
    spriteKey: 'mage_staff',
  },
  dan_chenzi: {
    id: 'dan_chenzi', name: 'Dan Chenzi', nameCN: '丹辰子',
    faction: 'shushan', class: 'guardian', tier: 2,
    hp: [800, 1440, 2592], attack: [35, 63, 113], defense: [50, 90, 162],
    attackSpeed: 0.6, range: 1, mana: [0, 100],
    ability: { name: 'Iron Wings', desc: 'Gains a shield equal to 30% max HP',
      onCast: (self) => { self.heal(Math.floor(self.maxHP * 0.3)); } },
    spriteKey: 'guardian_shield',
  },
  kunlun_jing: {
    id: 'kunlun_jing', name: 'Kunlun Jing', nameCN: '昆仑镜',
    faction: 'shushan', class: 'warlock', tier: 4,
    hp: [450, 810, 1458], attack: [60, 108, 194], defense: [20, 36, 64],
    attackSpeed: 0.7, range: 3, mana: [40, 90],
    ability: { name: 'Mirror Light', desc: 'Heals lowest HP ally for 200% ATK',
      onCast: (self) => {
        const allies = AC.Battle._playerPieces.filter(p => !p.isDead);
        allies.sort((a, b) => a.currentHP - b.currentHP);
        if (allies[0]) allies[0].heal(self.currentAttack() * 2);
      } },
    spriteKey: 'immortal_glow',
  },
  lei_yan: {
    id: 'lei_yan', name: 'Lei Yan', nameCN: '雷炎',
    faction: 'shushan', class: 'ranger', tier: 3,
    hp: [500, 900, 1620], attack: [65, 117, 210], defense: [20, 36, 64],
    attackSpeed: 0.75, range: 4, mana: [0, 80],
    ability: { name: 'Thunder Arrow', desc: 'Fires lightning dealing 180% ATK and bouncing to 2 nearby enemies',
      onCast: (self, target) => {
        if (target) {
          target.takeDamage(self.currentAttack() * 1.8);
          const enemies = AC.Battle._enemyPieces.filter(p => !p.isDead && p !== target);
          enemies.sort((a, b) => AC.Utils.manhattan(target.boardIndex, a.boardIndex) - AC.Utils.manhattan(target.boardIndex, b.boardIndex));
          for (let i = 0; i < Math.min(2, enemies.length); i++) {
            enemies[i].takeDamage(self.currentAttack() * 0.9);
          }
        }
      } },
    spriteKey: 'ranger_bow',
  },

  // ===== 魔教 Demon Sect =====
  chi_you: {
    id: 'chi_you', name: 'Chi You', nameCN: '蚩尤',
    faction: 'demon_sect', class: 'warrior', tier: 4,
    hp: [700, 1260, 2268], attack: [75, 135, 243], defense: [35, 63, 113],
    attackSpeed: 0.75, range: 1, mana: [0, 100],
    ability: { name: 'Blood Rage', desc: 'Gains 50% ATK for 5 seconds',
      onCast: (self) => { self.bonusATK += Math.floor(self.attack * 0.5); } },
    spriteKey: 'demon_blade',
  },
  you_quan: {
    id: 'you_quan', name: 'You Quan', nameCN: '幽泉',
    faction: 'demon_sect', class: 'mage', tier: 5,
    hp: [500, 900, 1620], attack: [90, 162, 291], defense: [15, 27, 48],
    attackSpeed: 0.6, range: 3, mana: [40, 100],
    ability: { name: '血魔大法', desc: 'Deals 200% ATK to all enemies and heals self for 50% of damage',
      onCast: (self) => {
        const enemies = AC.Battle._enemyPieces;
        let totalDmg = 0;
        for (const e of enemies) { if (!e.isDead) totalDmg += e.takeDamage(self.currentAttack() * 2); }
        self.heal(Math.floor(totalDmg * 0.5));
      } },
    spriteKey: 'blood_mage',
  },
  xue_mo: {
    id: 'xue_mo', name: 'Xue Mo', nameCN: '血魔',
    faction: 'demon_sect', class: 'assassin', tier: 2,
    hp: [500, 900, 1620], attack: [65, 117, 210], defense: [15, 27, 48],
    attackSpeed: 1.1, range: 1, mana: [0, 60],
    ability: { name: 'Shadow Strike', desc: 'Deals 300% ATK to target, ignores 50% DEF',
      onCast: (self, target) => {
        if (target) {
          const def = target.currentDefense();
          target.defense = Math.floor(def * 0.5);
          const dmg = target.takeDamage(self.currentAttack() * 3);
          target.defense = def;
        }
      } },
    spriteKey: 'assassin_dagger',
  },
  hei_shan: {
    id: 'hei_shan', name: 'Hei Shan', nameCN: '黑山老妖',
    faction: 'demon_sect', class: 'guardian', tier: 3,
    hp: [900, 1620, 2916], attack: [30, 54, 97], defense: [60, 108, 194],
    attackSpeed: 0.5, range: 1, mana: [0, 120],
    ability: { name: 'Dark Shield', desc: 'Reduces damage taken by 40% for 5s',
      onCast: (self) => { self.bonusDEF += 50; } },
    spriteKey: 'demon_king',
  },
  zi_ling: {
    id: 'zi_ling', name: 'Zi Ling', nameCN: '紫灵',
    faction: 'demon_sect', class: 'warlock', tier: 1,
    hp: [400, 720, 1296], attack: [45, 81, 145], defense: [15, 27, 48],
    attackSpeed: 0.7, range: 3, mana: [20, 80],
    ability: { name: 'Soul Drain', desc: 'Steals 15 DEF and 15 ATK from target',
      onCast: (self, target) => {
        if (target) {
          target.bonusATK -= 15; target.bonusDEF -= 15;
          self.bonusATK += 15; self.bonusDEF += 15;
          target.takeDamage(self.currentAttack());
        }
      } },
    spriteKey: 'warlock_skull',
  },
  mo_li_qing: {
    id: 'mo_li_qing', name: 'Mo Liqing', nameCN: '魔礼青',
    faction: 'demon_sect', class: 'ranger', tier: 2,
    hp: [450, 810, 1458], attack: [60, 108, 194], defense: [20, 36, 64],
    attackSpeed: 0.8, range: 4, mana: [0, 80],
    ability: { name: 'Demon Arrow', desc: 'Deals 200% ATK and poisons for 3s',
      onCast: (self, target) => { if (target) { target.takeDamage(self.currentAttack() * 2); } } },
    spriteKey: 'ranger_bow',
  },

  // ===== 妖族 Monster Clan =====
  bai_suzhen: {
    id: 'bai_suzhen', name: 'Bai Suzhen', nameCN: '白素贞',
    faction: 'monster_clan', class: 'warlock', tier: 4,
    hp: [550, 990, 1782], attack: [65, 117, 210], defense: [25, 45, 81],
    attackSpeed: 0.7, range: 3, mana: [30, 100],
    ability: { name: 'Thousand Year Cultivation', desc: 'Heals all allies for 150% ATK',
      onCast: (self) => {
        const allies = AC.Battle._playerPieces;
        for (const a of allies) { if (!a.isDead) a.heal(self.currentAttack() * 1.5); }
      } },
    spriteKey: 'fox_spirit',
  },
  xiao_qing: {
    id: 'xiao_qing', name: 'Xiao Qing', nameCN: '小青',
    faction: 'monster_clan', class: 'assassin', tier: 2,
    hp: [450, 810, 1458], attack: [60, 108, 194], defense: [20, 36, 64],
    attackSpeed: 1.05, range: 1, mana: [0, 60],
    ability: { name: 'Snake Strike', desc: 'Deals 220% ATK and stuns for 1s',
      onCast: (self, target) => {
        if (target) {
          target.takeDamage(self.currentAttack() * 2.2);
          target.attackCooldown += 1.0;
        }
      } },
    spriteKey: 'fox_spirit',
  },
  niu_mo_wang: {
    id: 'niu_mo_wang', name: 'Niu Mo Wang', nameCN: '牛魔王',
    faction: 'monster_clan', class: 'guardian', tier: 5,
    hp: [1000, 1800, 3240], attack: [40, 72, 129], defense: [70, 126, 226],
    attackSpeed: 0.5, range: 1, mana: [0, 120],
    ability: { name: 'Bull Charge', desc: 'Charges dealing 200% ATK and pushing target back 2 cells',
      onCast: (self, target) => {
        if (target) {
          target.takeDamage(self.currentAttack() * 2);
          // Push target back: increase distance by moving target 2 cells away
          const tIdx = target.boardIndex;
          const sIdx = self.boardIndex;
          const dx = (tIdx % 8) - (sIdx % 8);
          const dy = Math.floor(tIdx / 8) - Math.floor(sIdx / 8);
          const newX = AC.Utils.clamp((tIdx % 8) + Math.sign(dx) * 2, 0, 7);
          const newY = AC.Utils.clamp(Math.floor(tIdx / 8) + Math.sign(dy) * 2, 0, 2);
          const newIdx = AC.Utils.xyToIdx(newX, newY);
          if (newIdx >= 0 && !AC.Board.isOccupied(newIdx)) {
            target.boardIndex = newIdx;
          }
        }
      } },
    spriteKey: 'monster_beast',
  },
  sun_wukong: {
    id: 'sun_wukong', name: 'Sun Wukong', nameCN: '孙悟空',
    faction: 'monster_clan', class: 'warrior', tier: 5,
    hp: [650, 1170, 2106], attack: [80, 144, 259], defense: [30, 54, 97],
    attackSpeed: 0.9, range: 1, mana: [0, 80],
    ability: { name: '72 Transformations', desc: 'Creates 2 clones that deal 50% damage',
      onCast: (self) => { self.bonusATK += Math.floor(self.attack * 0.5); self.bonusASPD += 0.3; } },
    spriteKey: 'monster_beast',
  },
  zhu_ba_jie: {
    id: 'zhu_ba_jie', name: 'Zhu Bajie', nameCN: '猪八戒',
    faction: 'monster_clan', class: 'guardian', tier: 3,
    hp: [850, 1530, 2754], attack: [35, 63, 113], defense: [55, 99, 178],
    attackSpeed: 0.55, range: 1, mana: [0, 100],
    ability: { name: 'Iron Skin', desc: 'Gains +100 DEF for 5s',
      onCast: (self) => { self.bonusDEF += 100; } },
    spriteKey: 'monster_beast',
  },
  hu_yao: {
    id: 'hu_yao', name: 'Hu Yao', nameCN: '狐妖',
    faction: 'monster_clan', class: 'mage', tier: 2,
    hp: [400, 720, 1296], attack: [65, 117, 210], defense: [15, 27, 48],
    attackSpeed: 0.7, range: 3, mana: [20, 80],
    ability: { name: 'Fox Fire', desc: 'Burns 3 random enemies for 150% ATK',
      onCast: (self) => {
        const enemies = AC.Utils.shuffle(AC.Battle._enemyPieces.filter(p => !p.isDead));
        for (let i = 0; i < Math.min(3, enemies.length); i++) {
          enemies[i].takeDamage(self.currentAttack() * 1.5);
        }
      } },
    spriteKey: 'fox_spirit',
  },

  // ===== 人间 Mortal Kingdom =====
  general_li: {
    id: 'general_li', name: 'General Li', nameCN: '李将军',
    faction: 'mortal_kingdom', class: 'warrior', tier: 2,
    hp: [550, 990, 1782], attack: [55, 99, 178], defense: [30, 54, 97],
    attackSpeed: 0.8, range: 1, mana: [0, 80],
    ability: { name: 'Commander Strike', desc: 'Deals 180% ATK and buffs adjacent allies +20 ATK',
      onCast: (self, target) => {
        if (target) target.takeDamage(self.currentAttack() * 1.8);
        const adj = AC.Utils.getAdjacent(self.boardIndex);
        for (const idx of adj) {
          const pid = AC.Player.board[idx];
          if (pid) {
            const ally = AC.Player.getPieceById(pid);
            if (ally && !ally.isDead) ally.bonusATK += 20;
          }
        }
      } },
    spriteKey: 'knight_sword',
  },
  princess_changping: {
    id: 'princess_changping', name: 'Princess Changping', nameCN: '长平公主',
    faction: 'mortal_kingdom', class: 'ranger', tier: 1,
    hp: [400, 720, 1296], attack: [55, 99, 178], defense: [15, 27, 48],
    attackSpeed: 0.85, range: 4, mana: [0, 70],
    ability: { name: 'Royal Arrow', desc: 'Fires a precise shot dealing 220% ATK',
      onCast: (self, target) => { if (target) target.takeDamage(self.currentAttack() * 2.2); } },
    spriteKey: 'ranger_bow',
  },
  master_gu: {
    id: 'master_gu', name: 'Master Gu', nameCN: '古大师',
    faction: 'mortal_kingdom', class: 'warlock', tier: 3,
    hp: [450, 810, 1458], attack: [55, 99, 178], defense: [20, 36, 64],
    attackSpeed: 0.7, range: 3, mana: [30, 90],
    ability: { name: 'Healing Herbs', desc: 'Heals all allies for 120% ATK over 3s',
      onCast: (self) => {
        const allies = AC.Battle._playerPieces;
        for (const a of allies) { if (!a.isDead) a.heal(self.currentAttack() * 1.2); }
      } },
    spriteKey: 'warlock_skull',
  },
  zhao_yun: {
    id: 'zhao_yun', name: 'Zhao Yun', nameCN: '赵云',
    faction: 'mortal_kingdom', class: 'assassin', tier: 4,
    hp: [600, 1080, 1944], attack: [75, 135, 243], defense: [25, 45, 81],
    attackSpeed: 1.0, range: 1, mana: [0, 60],
    ability: { name: 'Dragon Spear', desc: 'Strikes 3 times for 120% ATK each',
      onCast: (self, target) => {
        if (target) {
          for (let i = 0; i < 3; i++) target.takeDamage(self.currentAttack() * 1.2);
        }
      } },
    spriteKey: 'general_spear',
  },
  nie_yinniang: {
    id: 'nie_yinniang', name: 'Nie Yinniang', nameCN: '聂隐娘',
    faction: 'mortal_kingdom', class: 'assassin', tier: 1,
    hp: [400, 720, 1296], attack: [55, 99, 178], defense: [15, 27, 48],
    attackSpeed: 1.1, range: 1, mana: [0, 50],
    ability: { name: 'Swift Strike', desc: 'Deals 250% ATK to furthest enemy',
      onCast: (self) => {
        const enemies = AC.Battle._enemyPieces.filter(p => !p.isDead);
        let furthest = null, maxDist = -1;
        for (const e of enemies) {
          const d = AC.Utils.manhattan(self.boardIndex, e.boardIndex);
          if (d > maxDist) { maxDist = d; furthest = e; }
        }
        if (furthest) furthest.takeDamage(self.currentAttack() * 2.5);
      } },
    spriteKey: 'assassin_dagger',
  },
  huang_fei: {
    id: 'huang_fei', name: 'Huang Fei', nameCN: '黄飞',
    faction: 'mortal_kingdom', class: 'mage', tier: 1,
    hp: [350, 630, 1134], attack: [55, 99, 178], defense: [10, 18, 32],
    attackSpeed: 0.7, range: 3, mana: [20, 80],
    ability: { name: 'Fire Talisman', desc: 'Deals 200% ATK in a line',
      onCast: (self, target) => {
        if (target) {
          target.takeDamage(self.currentAttack() * 2);
          // Hit adjacent enemies on same row
          const tidx = target.boardIndex;
          const enemies = AC.Battle._enemyPieces;
          for (const e of enemies) {
            if (e !== target && !e.isDead && Math.floor(e.boardIndex / 8) === Math.floor(tidx / 8)) {
              if (Math.abs((e.boardIndex % 8) - (tidx % 8)) <= 2) {
                e.takeDamage(self.currentAttack() * 1.0);
              }
            }
          }
        }
      } },
    spriteKey: 'mage_staff',
  },

  // ===== 仙庭 Celestial Court =====
  yu_huang: {
    id: 'yu_huang', name: 'Yu Huang', nameCN: '玉皇大帝',
    faction: 'celestial', class: 'mage', tier: 5,
    hp: [600, 1080, 1944], attack: [95, 171, 307], defense: [20, 36, 64],
    attackSpeed: 0.6, range: 3, mana: [50, 120],
    ability: { name: 'Heavenly Wrath', desc: 'Deals 300% ATK to all enemies',
      onCast: (self) => {
        const enemies = AC.Battle._enemyPieces;
        for (const e of enemies) { if (!e.isDead) e.takeDamage(self.currentAttack() * 3); }
      } },
    spriteKey: 'celestial_lord',
  },
  wang_mu: {
    id: 'wang_mu', name: 'Wang Mu', nameCN: '王母娘娘',
    faction: 'celestial', class: 'warlock', tier: 5,
    hp: [650, 1170, 2106], attack: [70, 126, 226], defense: [30, 54, 97],
    attackSpeed: 0.65, range: 3, mana: [40, 100],
    ability: { name: 'Peach of Immortality', desc: 'Revives one fallen ally with 50% HP',
      onCast: (self) => {
        const allies = AC.Battle._playerPieces;
        let best = null;
        for (const a of allies) {
          if (a.isDead && (!best || a.maxHP > best.maxHP)) best = a;
        }
        if (best) {
          best.isDead = false;
          best.currentHP = Math.floor(best.maxHP * 0.5);
          // Place on nearest empty cell
          const empty = AC.Board.getEmptyPlayerCells();
          if (empty.length > 0) {
            best.boardIndex = empty[0];
            AC.Player.board[empty[0]] = best.instanceId;
          }
        }
      } },
    spriteKey: 'cloud_maiden',
  },
  tai_bai: {
    id: 'tai_bai', name: 'Tai Bai Jin Xing', nameCN: '太白金星',
    faction: 'celestial', class: 'ranger', tier: 4,
    hp: [500, 900, 1620], attack: [75, 135, 243], defense: [20, 36, 64],
    attackSpeed: 0.8, range: 4, mana: [20, 80],
    ability: { name: 'Starfall Arrow', desc: 'Calls down stars dealing 180% ATK to 3 enemies',
      onCast: (self) => {
        const enemies = AC.Battle._enemyPieces.filter(p => !p.isDead);
        enemies.sort((a, b) => a.currentHP - b.currentHP);
        for (let i = 0; i < Math.min(3, enemies.length); i++) {
          enemies[i].takeDamage(self.currentAttack() * 1.8);
        }
      } },
    spriteKey: 'ranger_bow',
  },
  ne_zha: {
    id: 'ne_zha', name: 'Ne Zha', nameCN: '哪吒',
    faction: 'celestial', class: 'warrior', tier: 3,
    hp: [600, 1080, 1944], attack: [70, 126, 226], defense: [30, 54, 97],
    attackSpeed: 0.85, range: 1, mana: [0, 80],
    ability: { name: 'Wind Fire Wheels', desc: 'Deals 200% ATK to target and adjacent enemies',
      onCast: (self, target) => {
        if (target) {
          target.takeDamage(self.currentAttack() * 2);
          const adj = AC.Utils.getAdjacent(target.boardIndex);
          for (const idx of adj) {
            const enemies = AC.Battle._enemyPieces;
            for (const e of enemies) {
              if (e.boardIndex === idx && !e.isDead) e.takeDamage(self.currentAttack() * 1.0);
            }
          }
        }
      } },
    spriteKey: 'celestial_lord',
  },
  chang_e: {
    id: 'chang_e', name: 'Chang E', nameCN: '嫦娥',
    faction: 'celestial', class: 'mage', tier: 2,
    hp: [400, 720, 1296], attack: [60, 108, 194], defense: [15, 27, 48],
    attackSpeed: 0.7, range: 3, mana: [20, 80],
    ability: { name: 'Moonlight', desc: 'Deals 160% ATK and reduces enemy ATK by 20 for 5s',
      onCast: (self, target) => {
        if (target) {
          target.takeDamage(self.currentAttack() * 1.6);
          target.bonusATK -= 20;
        }
      } },
    spriteKey: 'cloud_maiden',
  },
  er_lang: {
    id: 'er_lang', name: 'Er Lang Shen', nameCN: '二郎神',
    faction: 'celestial', class: 'guardian', tier: 4,
    hp: [800, 1440, 2592], attack: [50, 90, 162], defense: [55, 99, 178],
    attackSpeed: 0.7, range: 1, mana: [0, 100],
    ability: { name: 'Third Eye', desc: 'Stuns the highest ATK enemy for 2s and deals 150% ATK',
      onCast: (self) => {
        const enemies = AC.Battle._enemyPieces.filter(p => !p.isDead);
        enemies.sort((a, b) => b.currentAttack() - a.currentAttack());
        if (enemies[0]) {
          enemies[0].takeDamage(self.currentAttack() * 1.5);
          enemies[0].attackCooldown += 2.0;
        }
      } },
    spriteKey: 'guardian_shield',
  },

  // ===== 龙族 Dragon Temple =====
  ao_guang: {
    id: 'ao_guang', name: 'Ao Guang', nameCN: '敖广',
    faction: 'dragon', class: 'mage', tier: 5,
    hp: [550, 990, 1782], attack: [90, 162, 291], defense: [25, 45, 81],
    attackSpeed: 0.6, range: 3, mana: [40, 100],
    ability: { name: 'Dragon Breath', desc: 'Breathes fire dealing 250% ATK in a cone',
      onCast: (self) => {
        const enemies = AC.Battle._enemyPieces.filter(p => !p.isDead);
        for (const e of enemies) {
          if (AC.Utils.chebyshev(self.boardIndex, e.boardIndex) <= 3) {
            e.takeDamage(self.currentAttack() * 2.5);
          }
        }
      } },
    spriteKey: 'dragon_mage',
  },
  ao_bing: {
    id: 'ao_bing', name: 'Ao Bing', nameCN: '敖丙',
    faction: 'dragon', class: 'warrior', tier: 4,
    hp: [650, 1170, 2106], attack: [75, 135, 243], defense: [35, 63, 113],
    attackSpeed: 0.8, range: 1, mana: [0, 80],
    ability: { name: 'Dragon Claw', desc: 'Slashes for 220% ATK and gains +30 ATK',
      onCast: (self, target) => {
        if (target) target.takeDamage(self.currentAttack() * 2.2);
        self.bonusATK += 30;
      } },
    spriteKey: 'dragon_knight',
  },
  ying_long: {
    id: 'ying_long', name: 'Ying Long', nameCN: '应龙',
    faction: 'dragon', class: 'guardian', tier: 3,
    hp: [850, 1530, 2754], attack: [40, 72, 129], defense: [60, 108, 194],
    attackSpeed: 0.55, range: 1, mana: [0, 110],
    ability: { name: 'Dragon Scales', desc: 'Reflects 30% damage taken for 5s',
      onCast: (self) => { self.bonusDEF += 40; self.bonusHP += Math.floor(self.maxHP * 0.2); } },
    spriteKey: 'dragon_knight',
  },
  jiao_long: {
    id: 'jiao_long', name: 'Jiao Long', nameCN: '蛟龙',
    faction: 'dragon', class: 'assassin', tier: 2,
    hp: [450, 810, 1458], attack: [65, 117, 210], defense: [20, 36, 64],
    attackSpeed: 1.0, range: 1, mana: [0, 55],
    ability: { name: 'Water Strike', desc: 'Deals 230% ATK and slows target attack speed by 30%',
      onCast: (self, target) => {
        if (target) {
          target.takeDamage(self.currentAttack() * 2.3);
          target.bonusASPD -= 0.3;
        }
      } },
    spriteKey: 'dragon_knight',
  },
  long_nu: {
    id: 'long_nu', name: 'Long Nu', nameCN: '龙女',
    faction: 'dragon', class: 'ranger', tier: 3,
    hp: [500, 900, 1620], attack: [65, 117, 210], defense: [20, 36, 64],
    attackSpeed: 0.8, range: 4, mana: [10, 70],
    ability: { name: 'Water Arrow', desc: 'Deals 180% ATK and heals self for 20% max HP',
      onCast: (self, target) => {
        if (target) target.takeDamage(self.currentAttack() * 1.8);
        self.heal(Math.floor(self.maxHP * 0.2));
      } },
    spriteKey: 'dragon_mage',
  },
  qing_long: {
    id: 'qing_long', name: 'Qing Long', nameCN: '青龙',
    faction: 'dragon', class: 'warlock', tier: 4,
    hp: [500, 900, 1620], attack: [60, 108, 194], defense: [25, 45, 81],
    attackSpeed: 0.7, range: 3, mana: [30, 90],
    ability: { name: 'Azure Blessing', desc: 'Buffs all allies with +25 ATK and +15 DEF',
      onCast: (self) => {
        const allies = AC.Battle._playerPieces;
        for (const a of allies) {
          if (!a.isDead) { a.bonusATK += 25; a.bonusDEF += 15; }
        }
      } },
    spriteKey: 'dragon_mage',
  },
};

// ============================================================
//  SYNERGY DATA
// ============================================================
AC.SYNERGY_DATA = {

  // ---- Faction Synergies ----
  shushan: {
    name: '蜀山', type: 'faction',
    thresholds: {
      2: { desc: '蜀山单位+25% ATK',
        apply: (pieces) => {
          for (const p of pieces) { if (p.faction === 'shushan') p.bonusATK += Math.floor(p.attack * 0.25); }
        } },
      4: { desc: '蜀山单位+50% ATK，全体+15% ATK',
        apply: (pieces) => {
          for (const p of pieces) {
            if (p.faction === 'shushan') p.bonusATK += Math.floor(p.attack * 0.5);
            else p.bonusATK += Math.floor(p.attack * 0.15);
          }
        } },
    },
  },
  demon_sect: {
    name: '魔教', type: 'faction',
    thresholds: {
      2: { desc: '魔教单位造成伤害的20%转化为治疗',
        apply: (pieces) => {
          for (const p of pieces) { if (p.faction === 'demon_sect') p.bonusHP += Math.floor(p.maxHP * 0.15); }
        } },
      3: { desc: '所有敌人-15 DEF',
        apply: (pieces, counts) => {
          if (counts.factions['demon_sect'] >= 3 && AC.Battle._enemyPieces) {
            for (const e of AC.Battle._enemyPieces) { if (!e.isDead) e.bonusDEF -= 15; }
          }
        } },
    },
  },
  monster_clan: {
    name: '妖族', type: 'faction',
    thresholds: {
      2: { desc: '妖族单位+300 HP',
        apply: (pieces) => {
          for (const p of pieces) { if (p.faction === 'monster_clan') p.bonusHP += 300; }
        } },
      4: { desc: '妖族单位+600 HP，+15 DEF',
        apply: (pieces) => {
          for (const p of pieces) {
            if (p.faction === 'monster_clan') { p.bonusHP += 600; p.bonusDEF += 15; }
          }
        } },
    },
  },
  mortal_kingdom: {
    name: '人间', type: 'faction',
    thresholds: {
      2: { desc: '人间单位+20 DEF',
        apply: (pieces) => {
          for (const p of pieces) { if (p.faction === 'mortal_kingdom') p.bonusDEF += 20; }
        } },
      4: { desc: '人间单位+40 DEF，+20 ATK',
        apply: (pieces) => {
          for (const p of pieces) {
            if (p.faction === 'mortal_kingdom') { p.bonusDEF += 40; p.bonusATK += 20; }
          }
        } },
    },
  },
  celestial: {
    name: '仙庭', type: 'faction',
    thresholds: {
      2: { desc: '仙庭单位技能伤害+30%',
        apply: (pieces) => {
          for (const p of pieces) { if (p.faction === 'celestial') p.bonusATK += Math.floor(p.attack * 0.2); }
        } },
      4: { desc: '全体+25% 技能伤害，仙庭+50%',
        apply: (pieces) => {
          for (const p of pieces) {
            if (p.faction === 'celestial') p.bonusATK += Math.floor(p.attack * 0.5);
            else p.bonusATK += Math.floor(p.attack * 0.25);
          }
        } },
    },
  },
  dragon: {
    name: '龙族', type: 'faction',
    thresholds: {
      2: { desc: '龙族单位+25% HP',
        apply: (pieces) => {
          for (const p of pieces) { if (p.faction === 'dragon') p.bonusHP += Math.floor(p.maxHP * 0.25); }
        } },
      4: { desc: '龙族+50% HP，开场满蓝',
        apply: (pieces) => {
          for (const p of pieces) {
            if (p.faction === 'dragon') {
              p.bonusHP += Math.floor(p.maxHP * 0.5);
              p.mana = p.maxMana;
            }
          }
        } },
    },
  },

  // ---- Class Synergies ----
  warrior: {
    name: '战士', type: 'class',
    thresholds: {
      2: { desc: '战士+200 HP',
        apply: (pieces) => {
          for (const p of pieces) { if (p.className === 'warrior') p.bonusHP += 200; }
        } },
      4: { desc: '战士+500 HP，+15 DEF',
        apply: (pieces) => {
          for (const p of pieces) { if (p.className === 'warrior') { p.bonusHP += 500; p.bonusDEF += 15; } }
        } },
    },
  },
  guardian: {
    name: '护卫', type: 'class',
    thresholds: {
      2: { desc: '护卫+30 DEF',
        apply: (pieces) => {
          for (const p of pieces) { if (p.className === 'guardian') p.bonusDEF += 30; }
        } },
      4: { desc: '护卫+60 DEF，开场获得20%最大生命护盾',
        apply: (pieces) => {
          for (const p of pieces) {
            if (p.className === 'guardian') { p.bonusDEF += 60; p.bonusHP += Math.floor(p.maxHP * 0.2); }
          }
        } },
    },
  },
  assassin: {
    name: '刺客', type: 'class',
    thresholds: {
      2: { desc: '刺客+25% ATK',
        apply: (pieces) => {
          for (const p of pieces) { if (p.className === 'assassin') p.bonusATK += Math.floor(p.attack * 0.25); }
        } },
      4: { desc: '刺客+50% ATK，攻击速度+20%',
        apply: (pieces) => {
          for (const p of pieces) {
            if (p.className === 'assassin') { p.bonusATK += Math.floor(p.attack * 0.5); p.bonusASPD += 0.2; }
          }
        } },
    },
  },
  mage: {
    name: '法师', type: 'class',
    thresholds: {
      2: { desc: '法师+20 法术强度',
        apply: (pieces) => {
          for (const p of pieces) { if (p.className === 'mage') p.bonusATK += 20; }
        } },
      4: { desc: '法师+40 法术强度，开场获得30法力',
        apply: (pieces) => {
          for (const p of pieces) {
            if (p.className === 'mage') { p.bonusATK += 40; p.mana += 30; }
          }
        } },
    },
  },
  ranger: {
    name: '射手', type: 'class',
    thresholds: {
      2: { desc: '射手+20% 攻击速度',
        apply: (pieces) => {
          for (const p of pieces) { if (p.className === 'ranger') p.bonusASPD += 0.2; }
        } },
      4: { desc: '射手+40% 攻击速度，+20 ATK',
        apply: (pieces) => {
          for (const p of pieces) { if (p.className === 'ranger') { p.bonusASPD += 0.4; p.bonusATK += 20; } }
        } },
    },
  },
  warlock: {
    name: '术士', type: 'class',
    thresholds: {
      2: { desc: '术士的治疗和护盾效果+25%',
        apply: (pieces) => {
          for (const p of pieces) { if (p.className === 'warlock') p.bonusHP += Math.floor(p.maxHP * 0.1); }
        } },
      4: { desc: '全体每5秒回复10%最大生命',
        apply: (pieces) => {
          for (const p of pieces) { p.bonusHP += Math.floor(p.maxHP * 0.15); }
        } },
    },
  },
};

// ============================================================
//  ROUND DEFINITIONS (30 rounds)
// ============================================================
AC.ROUNDS = [
  // Tutorial easy rounds
  { round: 1,  enemies: 2,  maxTier: 1, theme: null,             gold: 5  },
  { round: 2,  enemies: 2,  maxTier: 1, theme: null,             gold: 5  },
  { round: 3,  enemies: 3,  maxTier: 1, theme: 'monster_clan',   gold: 6  },
  // Ramping up
  { round: 4,  enemies: 3,  maxTier: 1, theme: null,             gold: 6  },
  { round: 5,  enemies: 4,  maxTier: 2, theme: 'demon_sect',     gold: 7  },
  { round: 6,  enemies: 4,  maxTier: 2, theme: 'mortal_kingdom', gold: 7  },
  { round: 7,  enemies: 5,  maxTier: 2, theme: 'shushan',        gold: 8  },
  { round: 8,  enemies: 5,  maxTier: 2, theme: null,             gold: 8  },
  { round: 9,  enemies: 6,  maxTier: 3, theme: 'dragon',         gold: 9  },
  { round: 10, enemies: 6,  maxTier: 3, theme: null,             gold: 10 },
  // Mid game
  { round: 11, enemies: 6,  maxTier: 3, theme: 'celestial',      gold: 10 },
  { round: 12, enemies: 7,  maxTier: 3, theme: 'demon_sect',     gold: 11 },
  { round: 13, enemies: 7,  maxTier: 3, theme: null,             gold: 11 },
  { round: 14, enemies: 7,  maxTier: 3, theme: 'monster_clan',   gold: 12 },
  { round: 15, enemies: 8,  maxTier: 4, theme: null,             gold: 13 },
  // Late game
  { round: 16, enemies: 8,  maxTier: 4, theme: 'shushan',        gold: 13 },
  { round: 17, enemies: 8,  maxTier: 4, theme: 'dragon',         gold: 14 },
  { round: 18, enemies: 8,  maxTier: 4, theme: null,             gold: 14 },
  { round: 19, enemies: 9,  maxTier: 4, theme: 'mortal_kingdom', gold: 15 },
  { round: 20, enemies: 9,  maxTier: 4, theme: null,             gold: 16 },
  // End game
  { round: 21, enemies: 9,  maxTier: 5, theme: 'celestial',      gold: 16 },
  { round: 22, enemies: 9,  maxTier: 5, theme: 'demon_sect',     gold: 17 },
  { round: 23, enemies: 10, maxTier: 5, theme: null,             gold: 18 },
  { round: 24, enemies: 10, maxTier: 5, theme: 'dragon',         gold: 18 },
  { round: 25, enemies: 10, maxTier: 5, theme: null,             gold: 20 },
  // Final rounds - boss waves
  { round: 26, enemies: 10, maxTier: 5, theme: 'shushan',        gold: 20 },
  { round: 27, enemies: 10, maxTier: 5, theme: 'celestial',      gold: 22 },
  { round: 28, enemies: 10, maxTier: 5, theme: 'demon_sect',     gold: 24 },
  { round: 29, enemies: 10, maxTier: 5, theme: null,             gold: 26 },
  { round: 30, enemies: 10, maxTier: 5, theme: null,             gold: 30 },
];
