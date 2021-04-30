import { Platform } from "./types.ts";
import { websiteChecks } from "./utils.ts";

const gamesJson = await Deno.readTextFile("./games.json");
const games = JSON.parse(gamesJson);

let [anchor, name, website] = Deno.args;
if (!(anchor && name && website)) Deno.exit(1);

const foundPlatform: Platform = games.platforms.find((platform: Platform) =>
  platform.anchor.includes(anchor)
);

if (!foundPlatform) {
  console.log("Invalid anchor");
  Deno.exit(1);
}

website = websiteChecks(foundPlatform.anchor, website);

if (
  foundPlatform.gameList.find((g) => g.name === name || g.website === website)
) {
  console.log("Duplicate game");
  Deno.exit(1);
}

const game = {
  name,
  website,
};

foundPlatform.gameList.push(game);

foundPlatform.gameList.sort((a, b) => {
  const aName = a.name.toLowerCase();
  const bName = b.name.toLowerCase();
  if (aName < bName) return -1;
  if (aName > bName) return 1;
  return 0;
});

const jsonFile = JSON.stringify(games, null, 2);
await Deno.writeTextFile("./games.json", jsonFile + "\n");
console.log(`${name} added to ${foundPlatform.name}`);
console.log(game);
