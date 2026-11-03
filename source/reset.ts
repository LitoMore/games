import logSymbols from 'log-symbols';
import {loadGamesJson, writeGamesJson} from './utils.ts';

const games = await loadGamesJson();

for (const platform of games.platforms) {
	platform.hostnames = [];
	platform.gameList = [];
}

games.related = [];

await writeGamesJson(games);
console.log(logSymbols.success, 'Reset to default done.');
