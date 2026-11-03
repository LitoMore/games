#!/usr/bin/env node
import process from 'node:process';
import logSymbols from 'log-symbols';
import {
	isValidGame,
	loadGamesJson,
	nameChecks,
	nameCompare,
	websiteChecks,
	writeGamesJson,
} from './utils.ts';

const games = await loadGamesJson();
const isWithFix = process.argv.slice(2).includes('--fix');

const checkWebsite = () => {
	const invalidGames: Array<{platform: string; name: string; website: string}> = [];
	for (const platform of games.platforms) {
		for (const game of platform.gameList) {
			if (isWithFix) {
				game.name = nameChecks(game.name);
				game.website = websiteChecks(platform.anchor, game.website);
			}

			if (!isValidGame(platform, game)) {
				invalidGames.push({platform: platform.name, ...game});
			}
		}
	}

	if (invalidGames.length === 0) {
		return;
	}

	console.error(logSymbols.error, 'Invalid games:');
	console.error(invalidGames);
	process.exit(1);
};

const checkPlatformOrder = () => {
	games.platforms.sort(nameCompare({showErrors: !isWithFix}));
};

const checkGamesOrder = () => {
	for (const platform of games.platforms) {
		platform.gameList.sort(nameCompare({showErrors: !isWithFix}));
	}
};

checkWebsite();
checkPlatformOrder();
checkGamesOrder();

if (isWithFix) {
	await writeGamesJson(games);
}

console.log(logSymbols.success, 'Validation passed.');
