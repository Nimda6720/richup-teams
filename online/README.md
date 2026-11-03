# Richup with Friends

Create a room at /game/index.html, choose your name, color, map and mode, and send its invite link to friends. The host starts after everyone joins. Free-for-all supports 2–6 people. Team games need six and pair seats 1+4, 2+5, 3+6.

The server generates dice and validates every move, purchase, build and trade. Trades require the recipient's response. D1 stores room state, with compare-and-swap updates and request IDs to prevent concurrent overwrites and duplicate actions. Clients poll every 1.5 seconds. Chat is shared. Seat credentials never appear in responses to other players or in invite URLs.

Reopening the invite in the same browser restores your seat. Clearing browser storage loses it. The host can skip a stalled turn after two minutes; players may forfeit on their turn. Rooms expire after seven days without an update. Expired database records are not yet automatically purged. Online rooms do not have bots.

The hosting platform's audience policy applies first. Friends can join without platform sign-in only after the owner approves public URL access. Rooms use unlisted random invite IDs. Anyone with an invite can join an available seat before the game starts.

## Development

- npm run install:ci installs locked dependencies.
- node scripts/generate-engine.mjs regenerates server/engine.mjs from public/game gameplay and maps.
- node --test server/rooms.test.mjs checks player isolation, turn validation, server dice, replay safety, concurrent joins, teams, variable player counts, trades, chat and host permissions.
- npm run db:generate generates migrations; apply them to local D1 before previewing.
- npm run dev starts preview. npm run build creates the hosted Worker.

public/game/online.js contains the lobby and room client; server/rooms.mjs implements commands; server/engine.mjs is the generated isolated game engine; app/api/rooms/[[...path]]/route.ts exposes the API.

Browser verification used separate localhost and 127.0.0.1 browser origins as independent players against the same local database. Production uses a shared origin from each player's own browser/device.
