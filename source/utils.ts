import logSymbols from "https://raw.githubusercontent.com/sindresorhus/log-symbols/main/browser.js";
import { Game, Platform } from "./types.ts";

const normalizeName = (name: string) =>
  name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export const nameCompare = (options?: { showErrors?: boolean }) =>
  (a: Platform | Game, b: Platform | Game) => {
    const aName = normalizeName(a.name).toLowerCase();
    const bName = normalizeName(b.name).toLowerCase();
    const compareResult = aName.localeCompare(bName);

    if (!options?.showErrors) {
      return compareResult;
    } else if (compareResult < 0) {
      console.error(logSymbols.error, "Check order failed.");
      console.error("Expect before:", b.name);
      console.error("Expect after:", a.name);
      Deno.exit(1);
    }

    return 0;
  };

const unifyAppStoreWebsite = (website: string): string => {
  const websitePattern =
    /^https?:\/\/apps\.apple\.com\/(?<languageCode>[a-z]{2})\/app\/(?<name>.+)\/(?<id>id\d+)$/;

  if (websitePattern.test(website)) {
    return website.replace(websitePattern, "https://apps.apple.com/$1/app/$3");
  }

  return website;
};

const unifyEpicGamesWebsite = (website: string): string => {
  const websitePattern =
    /^https:\/\/www\.epicgames\.com\/store\/(?<languageCode>[a-z]{2}-[A-Z]{2})\/product\/(?<name>.+$)/;

  if (websitePattern.test(website)) {
    return website.replace(
      websitePattern,
      "https://www.epicgames.com/store/en-US/p/$2",
    );
  }

  return website;
};

const unifySteamWebsite = (website: string): string => {
  const websitePattern =
    /^https:\/\/store\.steampowered\.com\/app\/(?<id>\d+)\/.*$/;

  if (websitePattern.test(website)) {
    return website.replace(
      websitePattern,
      "https://steamcommunity.com/app/$1",
    );
  }

  return website;
};

export const websiteChecks = (anchor: string, website: string): string => {
  switch (anchor) {
    case "#app-store":
    case "#apple-arcade":
    case "#netflix-games":
      return unifyAppStoreWebsite(website);
    case "#epic-games":
      return unifyEpicGamesWebsite(website);
    case "#steam":
      return unifySteamWebsite(website);
    default:
      return website;
  }
};

export const fuzzyMatched = (name: string, searchString?: string) =>
  searchString
    ? normalizeName(name).toLowerCase().includes(
      normalizeName(searchString.toLowerCase()),
    )
    : true;
