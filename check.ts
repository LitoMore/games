import games from "./games.ts";

const checkWebsite = () => {
  const invalidGames: { device: string; name: string; website: string }[] = [];
  games.devices.forEach((device) => {
    device.gameList.forEach((game) => {
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
  games.devices.forEach((device) => {
    device.gameList.sort((a, b) => {
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
    const tsFile = `export default ${JSON.stringify(games, null, 2)};`;
    await Deno.writeTextFile("./games.ts", tsFile);
    const cmd = Deno.run({
      cmd: ["deno", "fmt", "games.ts"],
      stdout: "piped",
    });
    await cmd.output();
    cmd.close();
  }
};

const withFix = Deno.args.includes("--fix");
checkWebsite();
await checkOrder(withFix);
