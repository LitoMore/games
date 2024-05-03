import { bold, cyan } from "@std/fmt/colors";
import logSymbols from "npm:log-symbols";
import input from "npm:@inquirer/input";
import { loadGamesJson, nameCompare, writeGamesJson } from "./utils.ts";

const games = await loadGamesJson();
const anchor = await input({ message: "anchor:" });
const name = await input({ message: "name:" });
const badge = await input({ message: "badge:" });
const hostnames = await input({ message: "hostnames:" });

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

await writeGamesJson(games);
console.log(logSymbols.success, `${name} added.`);
console.log(platform);
