import { GamesJson } from "./types.ts";

const gamesJson = await Deno.readTextFile("./games.json");
const games = JSON.parse(gamesJson) as GamesJson;

const summary = [
  ...games.platforms.map(
    (platform) => ({
      platform: platform.name,
      count: platform.gameList.length,
    }),
  ),
  {
    platform: "--- Total ---",
    count: games.platforms.reduce(
      (previous, current) => (previous + current.gameList.length),
      0,
    ),
  },
];

console.table(summary);
