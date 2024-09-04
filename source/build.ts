import logSymbols from 'npm:log-symbols';
import { loadGamesJson, nameCompare, writeReadme } from './utils.ts';

const games = await loadGamesJson();

const titleSection = `<h1 align="center">GAMES</h1>
`;

const badgesSection = games.platforms.map((p) => p.gameList.length).reduce((
		a: number,
		b: number,
	) => a + b
	) > 0
	? `
<p align="center">
${
		games.platforms.map((platform) =>
			platform.gameList.length > 0
				? `  <a href="${platform.anchor}">
    <img src="${
					platform.badge.replace('{{count}}', String(platform.gameList.length))
				}"/>
  </a>\n`
				: ''
		).join('')
	}</p>
`
	: '';

const descriptionSection = `
<p align="center">
  List of video games I already own
</p>
`;

const ciSection = `
<p align="center">
  <a href="https://github.com/LitoMore/games/actions">
    <img src="https://img.shields.io/github/actions/workflow/status/LitoMore/games/deno.yml?branch=main&logo=deno&logoColor=000&label=Deno&labelColor=fff"/>
  </a>
  <a href="https://github.com/LitoMore/games/blame/main/README.md">
    <img src="https://img.shields.io/badge/Games_Total-${
	games.platforms.map((p) => p.gameList.length).reduce((
		a: number,
		b: number,
	) => a + b)
}-ddd?style=social&logo=github-sponsors"/>
  </a>
</p>
`;

const gamesSection = games.platforms.map((platform) =>
	platform.gameList.length > 0
		? `
## ${platform.name}\n\n${
			platform.gameList.sort(nameCompare()).map((game) =>
				`- [${game.name}](${game.website})\n`
			).join(
				'',
			)
		}`
		: ''
).join('');

const relatedSection = games.related.length > 0
	? `
## Related

- [Transformers](https://github.com/LitoMore/transformers) - My Transformers toys
- [LEGO® Bricks](https://github.com/LitoMore/lego-bricks) - My LEGO® Bricks
- [Tamiya Toys](https://github.com/LitoMore/tamiya-toys) - My Tamiya toys
`
	: '';

const markdownContent = titleSection + badgesSection + descriptionSection +
	ciSection + gamesSection + relatedSection;

await writeReadme(markdownContent);
console.log(logSymbols.success, 'Compiled successfully.');
Deno.exit(0);
