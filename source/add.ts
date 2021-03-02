import { Platform } from "./types.ts";

const gamesJson = await Deno.readTextFile("./games.json");
const games = JSON.parse(gamesJson);

const [anchor, name, website] = Deno.args;
if (!(anchor && name && website)) Deno.exit(1);

games.platforms.forEach((platform: Platform) => {
  if (platform.anchor.includes(anchor)) {
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
  } else {
    console.log("Anchor does not exist.");
    Deno.exit(1);
  }
});

const tsFile = JSON.stringify(games, null, 2);
await Deno.writeTextFile("./games.json", tsFile + "\n");
