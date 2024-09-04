import input from 'npm:@inquirer/input';
import { fuzzyMatched, loadGamesJson } from './utils.ts';

const games = await loadGamesJson();
const anchor = Deno.env.get('anchor') ?? await input({ message: 'anchor:' });
const name = Deno.env.get('name') ?? await input({ message: 'name:' });

const matchedGames = [];

for (const p of games.platforms) {
	if (fuzzyMatched(p.anchor, anchor)) {
		for (const g of p.gameList) {
			if (fuzzyMatched(g.name, name)) {
				matchedGames.push({ platform: p.name, name: g.name });
			}
		}
	}
}

console.table(matchedGames);
Deno.exit(0);
