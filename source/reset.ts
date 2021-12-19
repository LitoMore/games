import logSymbols from "https://raw.githubusercontent.com/sindresorhus/log-symbols/main/browser.js";
import { GamesJson } from "./types.ts";

const gamesJson = await Deno.readTextFile("./games.json");
const games = JSON.parse(gamesJson) as GamesJson;

games.platforms.forEach((platform) => {
  platform.hostnames = [];
  platform.gameList = [];
});

games.related = [];

const jsonFile = JSON.stringify(games, null, 2);
await Deno.writeTextFile("./games.json", jsonFile + "\n");
console.log(logSymbols.success, "Reset to default done.");
