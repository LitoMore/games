import logSymbols from "https://raw.githubusercontent.com/sindresorhus/log-symbols/main/browser.js";
import { Game, Platform } from "./types.ts";
import { nameCompare, websiteChecks } from "./utils.ts";

const gamesJson = await Deno.readTextFile("./games.json");
const games = JSON.parse(gamesJson);
const withFix = Deno.args.includes("--fix");

const checkWebsite = () => {
  const invalidGames: { platform: string; name: string; website: string }[] =
    [];
  games.platforms.forEach((platform: Platform) => {
    platform.gameList.forEach((game: Game) => {
      const valid = platform.hostnames.find((hostname) =>
        game.website.includes(hostname)
      );

      if (!valid) {
        invalidGames.push({ platform: platform.name, ...game });
      }

      if (withFix) {
        game.website = websiteChecks(platform.anchor, game.website);
      }
    });
  });

  if (invalidGames.length > 0) {
    console.error(logSymbols.error, "Invalid games:");
    console.error(invalidGames);
    Deno.exit(1);
  }
};

const checkOrder = () => {
  games.platforms.forEach((platform: Platform) => {
    platform.gameList.sort(nameCompare({ withFix }));
  });
};

checkWebsite();
checkOrder();

if (withFix) {
  const jsonFile = JSON.stringify(games, null, 2);
  await Deno.writeTextFile("./games.json", jsonFile + "\n");
}

console.log(logSymbols.success, "Validation passed.");
