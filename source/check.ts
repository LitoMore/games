import { Game, Platform } from "./types.ts";

const gamesJson = await Deno.readTextFile("./games.json");
const games = JSON.parse(gamesJson);
const withFix = Deno.args.includes("--fix");

const unifyEpicGamesWebsite = (website: string): string => {
  const websitePattern =
    /^https:\/\/www\.epicgames\.com\/store\/(?<languageCode>[a-z]{2}-[A-Z]{2})\/product\/(?<name>.+$)/;

  if (websitePattern.test(website)) {
    return website.replace(
      websitePattern,
      "https://www.epicgames.com/store/en-US/p/$2",
    );
  }

  return website;
};

const unifySteamWebsite = (website: string): string => {
  const websitePattern =
    /^https:\/\/store\.steampowered\.com\/app\/(?<id>\d+)\/.*$/;

  if (websitePattern.test(website)) {
    return website.replace(
      websitePattern,
      "https://steamcommunity.com/app/$1",
    );
  }

  return website;
};

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
        switch (platform.anchor) {
          case "#epic-games":
            game.website = unifyEpicGamesWebsite(game.website);
            break;
          case "#steam":
            game.website = unifySteamWebsite(game.website);
            break;
          default:
            break;
        }
      }
    });
  });

  if (invalidGames.length > 0) {
    console.log("Invalid games:");
    console.log(invalidGames);
    Deno.exit(1);
  }
};

const checkOrder = () => {
  games.platforms.forEach((platform: Platform) => {
    platform.gameList.sort((a: Game, b: Game) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();

      if (withFix) {
        if (aName < bName) return -1;
        if (aName > bName) return 1;
      } else if (aName <= bName) {
        console.log("Check order failed.");
        console.log("Expect after:", aName);
        console.log("Expect before:", bName);
        Deno.exit(1);
      }

      return 0;
    });
  });
};

checkWebsite();
checkOrder();

if (withFix) {
  const jsonFile = JSON.stringify(games, null, 2);
  await Deno.writeTextFile("./games.json", jsonFile + "\n");
}

console.log("Validation passed.");
