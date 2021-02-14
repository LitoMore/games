import { Device, Game } from "./types.ts";

const gamesJson = await Deno.readTextFile("./games.json");
const games = JSON.parse(gamesJson);

const checkWebsite = () => {
  const invalidGames: { device: string; name: string; website: string }[] = [];
  games.devices.forEach((device: Device) => {
    device.gameList.forEach((game: Game) => {
      const valid = device.hostnames.find((hostname) =>
        game.website.includes(hostname)
      );
      if (!valid) invalidGames.push({ device: device.name, ...game });
    });
  });

  if (invalidGames.length > 0) {
    console.log("Invalid games:");
    console.log(invalidGames);
    Deno.exit(1);
  }
};

const checkOrder = async (withFix: boolean) => {
  games.devices.forEach((device: Device) => {
    device.gameList.sort((a: Game, b: Game) => {
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

  if (withFix) {
    const tsFile = JSON.stringify(games, null, 2);
    await Deno.writeTextFile("./games.json", tsFile + "\n");
  }
};

const withFix = Deno.args.includes("--fix");
checkWebsite();
await checkOrder(withFix);
