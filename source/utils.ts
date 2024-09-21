import { join } from '@std/path/join';
import logSymbols from 'log-symbols';
import { Game, GamesJson, Platform } from './types.ts';

const gamesJsonPath = join(import.meta.dirname ?? '.', 'games.json');
const readmePath = join(import.meta.dirname ?? '.', '..', 'README.md');

export const loadGamesJson = async () => {
	const file = await Deno.readTextFile(gamesJsonPath);
	const games = JSON.parse(file) as GamesJson;
	return games;
};

export const writeGamesJson = (games: GamesJson) =>
	Deno.writeTextFile(gamesJsonPath, JSON.stringify(games, null, '\t') + '\n');

export const writeReadme = (content: string) =>
	Deno.writeTextFile(readmePath, content);

const normalizeName = (name: string) =>
	name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export const nameCompare =
	(options?: { showErrors?: boolean }) =>
	(a: Platform | Game, b: Platform | Game) => {
		const aName = normalizeName(a.name).toLowerCase();
		const bName = normalizeName(b.name).toLowerCase();
		const compareResult = aName.localeCompare(bName);

		if (!options?.showErrors) {
			return compareResult;
		} else if (compareResult < 0) {
			console.error(logSymbols.error, 'Check order failed.');
			console.error('Expect before:', b.name);
			console.error('Expect after:', a.name);
			Deno.exit(1);
		}

		return 0;
	};

const unifyAppStoreWebsite = (website: string): string => {
	const websitePattern =
		/^https?:\/\/apps\.apple\.com\/(?<languageCode>[a-z]{2})\/app\/(?<name>.+)\/(?<id>id\d+)$/;

	if (websitePattern.test(website)) {
		return website.replace(websitePattern, 'https://apps.apple.com/$1/app/$3');
	}

	return website;
};

const unifyEpicGamesWebsite = (website: string): string => {
	const websitePattern =
		/^https:\/\/(www|store)\.epicgames\.com\/store\/(?<languageCode>[a-z]{2}-[A-Z]{2})\/(p|product)\/(?<name>.+$)/;

	if (websitePattern.test(website)) {
		return website.replace(
			websitePattern,
			'https://store.epicgames.com/store/en-US/p/$4',
		);
	}

	return website;
};

const unifySteamWebsite = (website: string): string => {
	const websitePattern =
		/^https:\/\/(store\.)*steampowered\.com\/app\/(?<id>\d+)\/*.*$/;

	if (websitePattern.test(website)) {
		return website.replace(
			websitePattern,
			'https://steamcommunity.com/app/$2',
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

export const nameChecks = (name: string): string => name.replaceAll('’', "'");

export const websiteChecks = (anchor: string, website: string): string => {
	switch (anchor) {
		case '#app-store':
		case '#apple-arcade':
		case '#netflix-games':
			return unifyAppStoreWebsite(website);
		case '#epic-games':
			return unifyEpicGamesWebsite(website);
		case '#steam':
			return unifySteamWebsite(website);
		case '#amazon-games':
			return unifyAmazonGamesWebsite(website);
		default:
			return website;
	}
};

export const fuzzyMatched = (name: string, searchString?: string) => {
	if (!searchString) return true;

	if (searchString.startsWith('@')) {
		return normalizeName(name).toLowerCase().replace(
			/[^a-z0-9]/g,
			'',
		)
			.includes(
				normalizeName(searchString.slice(1)).toLowerCase().replace(
					/[^a-z0-9]/g,
					'',
				),
			);
	}

	const searchPattern = new RegExp(
		normalizeName(searchString).split('').join('.*'),
		'i',
	);

	return searchPattern.exec(
		normalizeName(name),
	);
};
