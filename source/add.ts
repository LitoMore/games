#!/usr/bin/env node
import process from 'node:process';
import {bold, cyan, green} from 'yoctocolors';
import logSymbols from 'log-symbols';
import input from '@inquirer/input';
import {
	isValidGame,
	loadGamesJson,
	nameCompare,
	websiteChecks,
	writeGamesJson,
} from './utils.ts';

const games = await loadGamesJson();
const anchor = process.env.anchor ?? await input({message: 'anchor:'});
const name = process.env.name ?? await input({message: 'name:'});
let website = process.env.website ?? await input({message: 'website:'});

const missingFields = Object.entries({anchor, name, website})
	.filter(([, value]) => value.length === 0)
	.map(([key]) => cyan(bold(key)));

if (missingFields.length > 0) {
	console.error(
		`${missingFields.join(', ')} required.`,
	);
	process.exit(1);
}

const foundPlatformExact = games.platforms.find(platform =>
	platform.anchor.toLocaleLowerCase() === anchor,
);

const foundPlatformFuzzy = games.platforms.find(platform =>
	platform.anchor.includes(anchor),
);

const foundPlatform = foundPlatformExact ?? foundPlatformFuzzy;

if (!foundPlatform) {
	console.error(
		logSymbols.error,
		`Anchor ${cyan(bold(anchor))} does not exist.`,
	);
	process.exit(1);
}

website = websiteChecks(foundPlatform.anchor, website);

if (!isValidGame(foundPlatform, {name, website})) {
	console.error(logSymbols.error, 'Invalid game info');
	process.exit(1);
}

if (
	foundPlatform.gameList.some(g => {
		const allowDuplication = foundPlatform.duplication === true
			|| foundPlatform.duplication?.website?.some?.(x => x.includes(website));
		const isDuplicated = g.name === name || g.website === website;

		return !allowDuplication && isDuplicated;
	})
) {
	console.error(logSymbols.error, 'Duplicate game.');
	process.exit(1);
}

const game = {
	name,
	website,
};

foundPlatform.gameList.push(game);
foundPlatform.gameList.sort(nameCompare());

await writeGamesJson(games);
console.log(
	logSymbols.success,
	`${green(bold(name))} added to ${cyan(bold(foundPlatform.name))}.`,
);
console.table(game);
