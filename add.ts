import games from "./games.ts";

const [command] = Deno.args;
if (!command) Deno.exit(1);

const [anchor, name, website] = command.split("\n");
if (!(anchor && name && website)) Deno.exit(1);

games.devices.forEach((device) => {
  if (device.anchor.includes(anchor)) {
    device.gameList.push({
      name,
      website,
    });
    device.gameList.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      if (aName < bName) return -1;
      if (aName > bName) return 1;
      return 0;
    });
  }
});

const tsFile = `export default ${JSON.stringify(games, null, 2)}`;
await Deno.writeTextFile("./games.ts", tsFile);
const cmd = Deno.run({
  cmd: ["deno", "fmt", "games.ts"],
  stdout: "piped",
});
await cmd.output();
cmd.close();
