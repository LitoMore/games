import { bold, cyan } from "@std/fmt/colors";
import logSymbols from "npm:log-symbols";
import { GamesJson } from "./types.ts";
import { nameCompare } from "./utils.ts";

const gamesJson = await Deno.readTextFile("./games.json");
const games = JSON.parse(gamesJson) as GamesJson;

const [anchor, name, badge, hostnames] = Deno.args;

if (!(anchor && name && badge && hostnames)) {
  console.error(
    logSymbols.error,
    `${
      [
        anchor ? "" : "anchor",
        name ? "" : "name",
        badge ? "" : "badge",
        hostnames ? "" : "hostnames",
      ].filter(Boolean).map((x) => cyan(bold(x))).join(", ")
    } required.`,
  );

  Deno.exit(1);
}

const platform = {
  name,
  anchor: `#${anchor}`,
  badge,
  hostnames: hostnames.split(" "),
  gameList: [],
};

games.platforms.push(platform);

games.platforms.sort(nameCompare());

const jsonFile = JSON.stringify(games, null, 2);
await Deno.writeTextFile("./games.json", jsonFile + "\n");
console.log(logSymbols.success, `${name} added.`);
console.log(platform);
