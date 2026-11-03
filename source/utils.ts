import {readFile, writeFile} from 'node:fs/promises';
import logSymbols from 'log-symbols';
import type {Game, GamesJson, Platform} from './types.ts';

const gamesJsonPath = new URL('games.json', import.meta.url);
const readmePath = new URL('../README.md', import.meta.url);

export const loadGamesJson = async () => {
	const file = await readFile(gamesJsonPath, 'utf8');
	const games = JSON.parse(file) as GamesJson;
	return games;
};

export const writeGamesJson = async (games: GamesJson) =>
	writeFile(gamesJsonPath, JSON.stringify(games, null, '\t') + '\n');

export const writeReadme = async (content: string) =>
	writeFile(readmePath, content);

const normalizeName = (name: string) =>
	name.normalize('NFD').replaceAll(/[\u{300}-\u{36F}]/gv, '');

export const titleToAnchor = (title: string) =>
	title.replaceAll(' ', '-').toLowerCase().replaceAll(/[&.:®™]/gv, '');

export const nameCompare =
	(options?: {showErrors?: boolean}) =>
		(a: Platform | Game, b: Platform | Game) => {
			const aName = normalizeName(a.name).toLowerCase();
			const bName = normalizeName(b.name).toLowerCase();
			const compareResult = aName.localeCompare(bName);

			if (!options?.showErrors) {
				return compareResult;
			}

			if (compareResult < 0) {
				console.error(logSymbols.error, 'Check order failed.');
				console.error('Expect before:', b.name);
				console.error('Expect after:', a.name);
				throw new Error('Check order failed.');
			}

			return 0;
		};

const unifyAppStoreWebsite = (website: string): string => {
	const websitePattern =
		/^https?:\/\/apps\.apple\.com\/(?<languageCode>[a-z]{2})\/app\/.+\/(?=id\d+$)/v;

	return websitePattern.test(website) ? website.replace(websitePattern, 'https://apps.apple.com/$<languageCode>/app/') : website;
};

const unifyEpicGamesWebsite = (website: string): string => {
	const websitePattern =
		/^https:\/\/(?:www|store)\.epicgames\.com\/store\/[a-z]{2}-[A-Z]{2}\/(?:p|product)\/(?=.+$)/v;

	if (websitePattern.test(website)) {
		return website.replace(
			websitePattern,
			'https://store.epicgames.com/store/en-US/p/',
		);
	}

	return website;
};

const unifySteamWebsite = (website: string): string => {
	const websitePattern =
		/^https:\/\/(?:store\.)?steampowered\.com\/app\/(?<id>\d+)(?:[#\/?].*)?$/v;

	if (websitePattern.test(website)) {
		return website.replace(
			websitePattern,
			'https://steamcommunity.com/app/$<id>',
		);
	}

	return website;
};

const unifyAmazonGamesWebsite = (website: string): string => {
	if (website.includes('https://gaming.amazon.com')) {
		const url = new URL(website);
		return url.origin + url.pathname;
	}

	return website;
};

export const nameChecks = (name: string): string => name.replaceAll('’', '\'');

export const websiteChecks = (anchor: string, website: string): string => {
	switch (anchor) {
		case '#app-store':
		case '#apple-arcade':
		case '#netflix-games': {
			return unifyAppStoreWebsite(website);
		}

		case '#epic-games': {
			return unifyEpicGamesWebsite(website);
		}

		case '#steam': {
			return unifySteamWebsite(website);
		}

		case '#amazon-games': {
			return unifyAmazonGamesWebsite(website);
		}

		default: {
			return website;
		}
	}
};

export const isValidGame = (platform: Platform, game: Game) => platform.hostnames.some(hostname =>
	!game.name.includes('’')
	&& game.website.includes(hostname),
);
