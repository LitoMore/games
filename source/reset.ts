import logSymbols from 'npm:log-symbols';
import { loadGamesJson, writeGamesJson } from './utils.ts';

const games = await loadGamesJson();

games.platforms.forEach((platform) => {
	platform.hostnames = [];
	platform.gameList = [];
});

games.related = [];

await writeGamesJson(games);
console.log(logSymbols.success, 'Reset to default done.');
Deno.exit(0);
