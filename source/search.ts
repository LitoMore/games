import { GamesJson } from "./types.ts";
import { fuzzyMatched } from "./utils.ts";

const gamesJson = await Deno.readTextFile("./games.json");
const games = JSON.parse(gamesJson) as GamesJson;

const [anchor, name] = Deno.args;

const matchedGames = [];

for (const p of games.platforms) {
  if (fuzzyMatched(p.anchor, anchor)) {
    for (const g of p.gameList) {
      if (fuzzyMatched(g.name, name)) {
        matchedGames.push({ platform: p.name, name: g.name });
      }
    }
  }
}

console.table(matchedGames);
