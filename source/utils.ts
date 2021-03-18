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
    case "#epic-games":
      return unifyEpicGamesWebsite(website);
    case "#steam":
      return unifySteamWebsite(website);
    default:
      return website;
  }
};