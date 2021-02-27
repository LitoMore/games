import { Platform } from "./types.ts";

const gamesJson = await Deno.readTextFile("./games.json");
const games = JSON.parse(gamesJson) as { platforms: Platform[] };

const [anchor, name, badge, hostnames] = Deno.args;
if (!(anchor && name && badge && hostnames)) Deno.exit(1);

games.platforms.push({
  name,
  anchor,
  badge,
  hostnames: hostnames.split(" "),
  gameList: [],
});

games.platforms.sort((a, b) => {
  const aName = a.name.toLowerCase();
  const bName = b.name.toLowerCase();
  if (aName < bName) return -1;
  if (aName > bName) return 1;
  return 0;
});

const jsonFile = JSON.stringify(games, null, 2);
await Deno.writeTextFile("./games.json", jsonFile + "\n");
