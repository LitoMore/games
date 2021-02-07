import games from "./games.ts";

const titleSection = `<h1 align="center">GAMES</h1>
`;

const badgesSection = `
<p align="center">
${
  games.devices.map((device) =>
    `  <a href="${device.anchor}">
    <img src="${
      device.badge.replace("{{count}}", String(device.gameList.length))
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
    <img src="https://github.com/LitoMore/games/workflows/Games%20Count/badge.svg"/>
  </a>
</p>

`;

const gamesSection = games.devices.map((device) =>
  `## ${device.name}\n\n${
    device.gameList.sort((a, b) => {
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
- [LEGO® Bricks](https://github.com/LitoMore/lego-bricks) - My LEGO® Bricks`;

const markdownContnet = titleSection + badgesSection + descptionSection +
  ciSection + gamesSection + relatedSection;

console.log(markdownContnet);
