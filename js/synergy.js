// Auto Chess - Synergy System
window.AC = window.AC || {};

AC.Synergy = {

  // Count pieces by faction and class
  countSynergies(pieces) {
    const factions = {};
    const classes = {};

    for (const p of pieces) {
      if (!p || p.isDead) continue;
      const f = p.faction;
      const c = p.className;
      if (f) factions[f] = (factions[f] || 0) + 1;
      if (c) classes[c] = (classes[c] || 0) + 1;
    }

    return { factions, classes };
  },

  // Get list of active synergy bonuses
  getActiveSynergies() {
    const pieces = AC.Player.getAllActivePieces();
    const counts = this.countSynergies(pieces);
    const active = [];

    // Check faction synergies
    for (const key in AC.SYNERGY_DATA) {
      const syn = AC.SYNERGY_DATA[key];
      const count = syn.type === 'faction'
        ? counts.factions[key] || 0
        : counts.classes[key] || 0;

      // Find highest threshold met
      let bestThreshold = 0;
      let bestEffect = '';
      for (const thresh in syn.thresholds) {
        const t = parseInt(thresh);
        if (count >= t && t > bestThreshold) {
          bestThreshold = t;
          bestEffect = syn.thresholds[t].desc;
        }
      }

      if (bestThreshold > 0) {
        active.push({
          key,
          name: syn.name,
          type: syn.type,
          count,
          threshold: bestThreshold,
          effect: bestEffect,
        });
      }
    }

    return active;
  },

  // Apply synergy bonuses to pieces at battle start
  applySynergies(playerPieces) {
    const counts = this.countSynergies(playerPieces);

    for (const piece of playerPieces) {
      piece.bonusHP = 0;
      piece.bonusATK = 0;
      piece.bonusDEF = 0;
      piece.bonusASPD = 0;
    }

    // Apply faction synergies
    for (const key in AC.SYNERGY_DATA) {
      const syn = AC.SYNERGY_DATA[key];
      const count = syn.type === 'faction'
        ? (counts.factions[key] || 0)
        : (counts.classes[key] || 0);

      // Apply all thresholds up to count
      for (const thresh in syn.thresholds) {
        const t = parseInt(thresh);
        if (count >= t && syn.thresholds[t].apply) {
          syn.thresholds[t].apply(playerPieces, counts);
        }
      }
    }
  },
};
