import { bold, cyan, green } from "https://deno.land/std/fmt/colors.ts";
import logSymbols from "https://raw.githubusercontent.com/sindresorhus/log-symbols/main/browser.js";
import { GamesJson } from "./types.ts";
import { nameCompare, websiteChecks } from "./utils.ts";

const gamesJson = await Deno.readTextFile("./games.json");
const games = JSON.parse(gamesJson) as GamesJson;

let [anchor, name, website] = Deno.args;

if (!(anchor && name && website)) {
  console.error(
    `${
      [
        anchor ? "" : "anchor",
        name ? "" : "name",
        website ? "" : "website",
      ].filter(Boolean).map((x) => cyan(bold(x)))
    } required.`,
  );
  Deno.exit(1);
}

const foundPlatformExact = games.platforms.find((platform) =>
  platform.anchor.toLocaleLowerCase() === anchor
);

const foundPlatformFuzzy = games.platforms.find((platform) =>
  platform.anchor.includes(anchor)
);

const foundPlatform = foundPlatformExact || foundPlatformFuzzy;

if (!foundPlatform) {
  console.error(
    logSymbols.error,
    `Anchor ${cyan(bold(anchor))} does not exist.`,
  );
  Deno.exit(1);
}

website = websiteChecks(foundPlatform.anchor, website);

if (
  foundPlatform.gameList.find((g) => {
    const allowDuplication = foundPlatform.duplication === true ||
      foundPlatform.duplication?.website?.some?.((x) => x.includes(website));
    const duplicated = g.name === name || g.website === website;

    return !allowDuplication && duplicated;
  })
) {
  console.error(logSymbols.error, "Duplicate game.");
  Deno.exit(1);
}

const game = {
  name,
  website,
};

foundPlatform.gameList.push(game);

foundPlatform.gameList.sort(nameCompare());

const jsonFile = JSON.stringify(games, null, 2);
await Deno.writeTextFile("./games.json", jsonFile + "\n");
console.log(
  logSymbols.success,
  `${green(bold(name))} added to ${cyan(bold(foundPlatform.name))}.`,
);
console.table(game);
