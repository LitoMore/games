import { bold, cyan, green } from '@std/fmt/colors';
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
const anchor = Deno.env.get('anchor') ?? await input({ message: 'anchor:' });
const name = Deno.env.get('name') ?? await input({ message: 'name:' });
let website = Deno.env.get('website') ?? await input({ message: 'website:' });

if (!(anchor && name && website)) {
	console.error(
		`${
			[
				anchor ? '' : 'anchor',
				name ? '' : 'name',
				website ? '' : 'website',
			].filter(Boolean).map((x) => cyan(bold(x)))
		} required.`,
	);
	Deno.exit(1);
}

const foundPlatformExact = games.platforms.find((platform) =>
	platform.anchor.toLocaleLowerCase() === anchor
);

const foundPlatformFuzzy = games.platforms.find((platform) =>
	platform.anchor.includes(anchor)
);

const foundPlatform = foundPlatformExact || foundPlatformFuzzy;

if (!foundPlatform) {
	console.error(
		logSymbols.error,
		`Anchor ${cyan(bold(anchor))} does not exist.`,
	);
	Deno.exit(1);
}

website = websiteChecks(foundPlatform.anchor, website);

if (!isValidGame(foundPlatform, { name, website })) {
	console.error(logSymbols.error, 'Invalid game info');
	Deno.exit(1);
}

if (
	foundPlatform.gameList.find((g) => {
		const allowDuplication = foundPlatform.duplication === true ||
			foundPlatform.duplication?.website?.some?.((x) => x.includes(website));
		const duplicated = g.name === name || g.website === website;

		return !allowDuplication && duplicated;
	})
) {
	console.error(logSymbols.error, 'Duplicate game.');
	Deno.exit(1);
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
Deno.exit(0);
