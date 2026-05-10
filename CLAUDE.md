# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pixel-art auto-chess game "蜀山幻世" — an Eastern+Western fantasy auto-battler inspired by 蜀山传 (Legend of Zu). Pure HTML5 Canvas + vanilla JS, zero dependencies, zero build tools.

## Running the Game

Open `index.html` directly in a browser (works from `file://`). No build step or dev server required.

## Architecture

### File Load Order (critical)

Scripts in `index.html` must load in this order — each depends on prior files:
`config.js` → `utils.js` → `sprite.js` → `piece.js` → `board.js` → `player.js` → `shop.js` → `synergy.js` → `battle.js` → `enemy.js` → `renderer.js` → `input.js` → `state.js` → `main.js`

All modules attach to the global `window.AC` namespace.

### Key Data Files

- **`js/config.js`**: All game constants, color palette, `PIECE_DATA` (36 pieces), `SYNERGY_DATA` (6 factions × 6 classes), `ROUNDS` (30 rounds). This is the single source of truth for balance and content.
- **`js/sprite.js`**: Pixel art sprite definitions as 14×16 color-index arrays. Each pixel maps to a palette index (0=transparent). Rendered at 3× scale.

### Core Systems

- **Game States**: `MENU → PREPARATION → BATTLE → ROUND_RESULT → PREPARATION (loop) → GAME_OVER`
- **Board**: 8×8 grid, flat `Array(64)`. Rows 0-2 enemy zone, 3-4 midfield, 5-7 player zone.
- **Battle**: Fixed timestep (100ms/tick, 10 ticks/sec). Manhattan-distance targeting. Damage formula: `ATK * 100 / (100 + DEF)`, min 1.
- **Economy**: 5 shop slots, buy=sell=tier cost, reroll=2g, interest=+1 per 10g saved (cap 5). Income: 5 base + interest + streak bonuses.
- **Upgrades**: 3 identical pieces (same id + star level) auto-combine into 1 higher-star piece (max 3★).
- **Synergies**: 6 factions (蜀山/魔教/妖族/人间/仙庭/龙族) and 6 classes (战士/护卫/刺客/法师/射手/术士), each with 2 thresholds. Counted from board + bench during prep, board only during battle.

### Canvas Layout

Logical resolution 960×640. Board at (256, 96), cells 56×56px. Shop on the left, bench on the right, synergy panel bottom-left, top bar with HP/gold/level/XP/round.

### Piece Data Structure

Each piece in `PIECE_DATA` has: `{ id, name, nameCN, faction, class, tier (1-5), hp/attack/defense (arrays [1★,2★,3★]), attackSpeed, range, mana [start, max], ability { name, desc, onCast(self, target) }, spriteKey }`.
