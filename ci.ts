import games from "./games.ts";

const checkOrder = async (withFix: boolean) => {
  games.devices.map((device) => {
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
    const writePermission = { name: "write", path: "./" } as const;
    const runPermission = { name: "run", path: "./" } as const;
    await Deno.permissions.request(writePermission);
    await Deno.permissions.request(runPermission);
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
await checkOrder(withFix);