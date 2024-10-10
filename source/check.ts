import logSymbols from 'log-symbols';
import { Game, Platform } from './types.ts';
import {
	isValidGame,
	loadGamesJson,
	nameChecks,
	nameCompare,
	websiteChecks,
	writeGamesJson,
} from './utils.ts';

const games = await loadGamesJson();
const withFix = Deno.args.includes('--fix');

const checkWebsite = () => {
	const invalidGames: { platform: string; name: string; website: string }[] =
		[];
	games.platforms.forEach((platform: Platform) => {
		platform.gameList.forEach((game: Game) => {
			if (withFix) {
				game.name = nameChecks(game.name);
				game.website = websiteChecks(platform.anchor, game.website);
			}

			if (!isValidGame(platform, game)) {
				invalidGames.push({ platform: platform.name, ...game });
			}
		});
	});

	if (invalidGames.length > 0) {
		console.error(logSymbols.error, 'Invalid games:');
		console.error(invalidGames);
		Deno.exit(1);
	}
};

const checkPlatformOrder = () => {
	games.platforms.sort(nameCompare({ showErrors: !withFix }));
};

const checkGamesOrder = () => {
	games.platforms.forEach((platform: Platform) => {
		platform.gameList.sort(nameCompare({ showErrors: !withFix }));
	});
};

checkWebsite();
checkPlatformOrder();
checkGamesOrder();

if (withFix) {
	await writeGamesJson(games);
}

console.log(logSymbols.success, 'Validation passed.');
Deno.exit(0);
