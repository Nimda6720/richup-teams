# Richup Teams

A lightweight property trading game with a dark Richup-inspired board, animated dice, and property purchase effects.

Choose **three teams of two** (shared $3,000 vaults) or **free for all** (six independent players, $1,500 each). Features include buying, rent, balanced building, hotels, trading, doubles, jail, bankruptcy, saved progress, and optional computer opponents. In free for all, each player owns their properties and the last solvent player wins.

Use **New game** to select a mode and map. Lucky Wheel and Death Valley have 40 spaces; Mr. Worldwide has 48. City order and purchase prices follow the supplied reference screenshots. Original Classic remains available, and older saved games automatically retain that board. Starting a new game replaces the current save, while preserving names and bot/sound preferences.

The new maps use 10% cash Earnings Tax, $75 Premium Tax, and $50 Tax Refund where shown. Airports use station rent rules. Utilities charge 4× the dice total, or 10× if the owner has at least two. Treasure and Surprise use this game's existing card deck. These are local game rules, not a claim of exact Richup.io rule parity.

## Play

Play on one device with six people, or enable computer opponents in Game settings. Progress is saved in this browser. Table chat is local to this device. Networked multiplayer is not included.

## Hosting

A static website: no framework, build step, backend, or sign-in required. GitHub Pages serves the main branch root. All assets and fonts are self-hosted; fonts are provided under the licenses in assets/fonts.

For local development: `python -m http.server 3000`.

Run gameplay regression checks with `node game.test.cjs`. No dependencies or build step are needed. Vector flags and treasure art are inline, and reduced-motion preferences disable animation.
