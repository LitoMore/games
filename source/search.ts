import input from '@inquirer/input';
import { Searcher } from 'fast-fuzzy';
import { loadGamesJson } from './utils.ts';

const games = await loadGamesJson();
const anchor = Deno.env.get('anchor') ?? await input({ message: 'anchor:' });
const name = Deno.env.get('name') ?? await input({ message: 'name:' });

let matchedGames: Array<{ platform: string; name: string }> = [];

const platformSearcher = new Searcher(games.platforms, {
	keySelector: ((p) => [p.name, p.anchor]),
});

const filteredPlatforms = anchor
	? platformSearcher.search('anchor')
	: games.platforms;

for (const p of filteredPlatforms) {
	const gamesSearcher = new Searcher(p.gameList, {
		keySelector: ((g) => g.name),
	});

	const filteredGames = gamesSearcher.search(name);
	matchedGames = [
		...matchedGames,
		...filteredGames.map((g) => ({ platform: p.name, name: g.name })),
	];
}

console.table(matchedGames);
Deno.exit(0);
