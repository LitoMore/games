import { Game, Platform } from "./types.ts";

const gamesJson = await Deno.readTextFile("./games.json");
const games = JSON.parse(gamesJson);

const titleSection = `<h1 align="center">GAMES</h1>
`;

const badgesSection = `
<p align="center">
${
  games.platforms.map((platform: Platform) =>
    `  <a href="${platform.anchor}">
    <img src="${
      platform.badge.replace("{{count}}", String(platform.gameList.length))
    }"/>
  </a>\n`
  ).join("")
}</p>
`;

const descptionSection = `
<p align="center">
  List of video games I already own
</p>
`;

const ciSection = `
<p align="center">
  <a href="https://github.com/LitoMore/games/actions">
    <img src="https://img.shields.io/github/workflow/status/LitoMore/games/Deno?logo=deno&logoColor=000&label=Deno&labelColor=fff"/>
  </a>
  <img src="https://img.shields.io/badge/Games_Total-${
  games.platforms.map((p: Platform) => p.gameList.length).reduce((
    a: number,
    b: number,
  ) => a + b)
}-ddd?style=social&logo=github-sponsors"/>
</p>

`;

const gamesSection = games.platforms.map((platform: Platform) =>
  `## ${platform.name}\n\n${
    platform.gameList.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      if (aName < bName) return -1;
      if (aName > bName) return 1;
      return 0;
    }).map((game) => `- [${game.name}](${game.website})\n`).join(
      "",
    )
  }
`
).join("");

const relatedSection = `## Related

- [Transformers](https://github.com/LitoMore/transformers) - My Transformers toys
- [LEGO® Bricks](https://github.com/LitoMore/lego-bricks) - My LEGO® Bricks
`;

const markdownContnet = titleSection + badgesSection + descptionSection +
  ciSection + gamesSection + relatedSection;

await Deno.writeTextFile("../README.md", markdownContnet);
