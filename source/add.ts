import { Platform } from "./types.ts";
import { unifyEpicGamesWebsite, unifySteamWebsite } from "./utils.ts";

const gamesJson = await Deno.readTextFile("./games.json");
const games = JSON.parse(gamesJson);

let [anchor, name, website] = Deno.args;
if (!(anchor && name && website)) Deno.exit(1);

games.platforms.forEach((platform: Platform) => {
  if (platform.anchor.includes(anchor)) {
    switch (platform.anchor) {
      case "#epic-games":
        website = unifyEpicGamesWebsite(website);
      case "#steam":
        website = unifySteamWebsite(website);
      default:
        break;
    }

    if (
      platform.gameList.find((g) => g.name === name || g.website === website)
    ) {
      console.log("Duplicate game");
      Deno.exit(1);
    }

    platform.gameList.push({
      name,
      website,
    });

    platform.gameList.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      if (aName < bName) return -1;
      if (aName > bName) return 1;
      return 0;
    });
  }
});

const jsonFile = JSON.stringify(games, null, 2);
await Deno.writeTextFile("./games.json", jsonFile + "\n");
console.log(`${name} added.`);
