import process from 'node:process';
import ky from 'ky';
import type {Game} from './types.ts';
import {loadGamesJson, nameCompare, writeGamesJson} from './utils.ts';

const steamOwnGamesUrl =
	'https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/';

type SteamOwnedGame = {
	appid: number;
	name: string;
};

type SteamOwnedGamesResponse = {
	response: {
		game_count?: number;
		games?: SteamOwnedGame[];
	};
};

export const fetchGames = async (
	apiKey: string,
	steamId: string,
): Promise<Game[]> => {
	apiKey = apiKey.trim();
	steamId = steamId.trim();

	if (apiKey.length === 0) {
		throw new TypeError('Steam Web API key is required.');
	}

	if (steamId.length === 0) {
		throw new TypeError('Steam ID is required.');
	}

	const {response} = await ky.get(steamOwnGamesUrl, {
		headers: {
			'x-webapi-key': apiKey,
		},
		/* eslint-disable @typescript-eslint/naming-convention -- Steam API parameter names. */
		searchParams: {
			input_json: JSON.stringify({
				steamid: steamId,
				include_appinfo: true,
				include_played_free_games: true,
			}),
		},
		/* eslint-enable @typescript-eslint/naming-convention */
	}).json<SteamOwnedGamesResponse>();

	// GetOwnedGames returns games only; Steam does not list DLC as games here.
	return (response.games ?? []).map(({appid, name}) => ({
		name,
		website: `https://steamcommunity.com/app/${appid}`,
	})).sort(nameCompare());
};

if (import.meta.main) {
	const games = await loadGamesJson();
	const steamPlatform = games.platforms.find(({anchor}) => anchor === '#steam');

	if (!steamPlatform) {
		throw new Error('Steam platform not found in games.json.');
	}

	steamPlatform.gameList = await fetchGames(
		process.env.STEAM_WEB_API_KEY ?? '',
		'76561198109970924',
	);

	console.log(steamPlatform.gameList.length, 'Steam games fetched.');

	await writeGamesJson(games);
}
