import { loadGamesJson } from "./utils.ts";

const games = await loadGamesJson();

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
