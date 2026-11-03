#!/usr/bin/env node
import process from 'node:process';
import {bold, cyan} from 'yoctocolors';
import logSymbols from 'log-symbols';
import input from '@inquirer/input';
import {loadGamesJson, nameCompare, writeGamesJson} from './utils.ts';

const games = await loadGamesJson();
const anchor = process.env.anchor ?? await input({message: 'anchor:'});
const name = process.env.name ?? await input({message: 'name:'});
const badge = process.env.badge ?? await input({message: 'badge:'});
const hostnames = process.env.hostnames
	?? await input({message: 'hostnames:'});

const missingFields = Object.entries({
	anchor, name, badge, hostnames,
})
	.filter(([, value]) => value.length === 0)
	.map(([key]) => cyan(bold(key)));

if (missingFields.length > 0) {
	console.error(
		logSymbols.error,
		`${missingFields.join(', ')} required.`,
	);

	process.exit(1);
}

const platform = {
	name,
	anchor: `#${anchor}`,
	badge,
	hostnames: hostnames.split(' '),
	gameList: [],
};

games.platforms.push(platform);
games.platforms.sort(nameCompare());

await writeGamesJson(games);
console.log(logSymbols.success, `${name} added.`);
console.log(platform);
