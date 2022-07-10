// ==UserScript==
// @name        Redeem Epic Games
// @homepage    https://github.com/LitoMore/games
// @version     0.0.1
// @description Copy Free Games to Clipboard
// @author      LitoMore
// @match       https://*.epicgames.com/*
// @downloadURL https://raw.githubusercontent.com/LitoMore/games/main/userscripts/epic-games.user.js
// @updateURL   https://raw.githubusercontent.com/LitoMore/games/main/userscripts/epic-games.user.js
// ==/UserScript==

window.getEpicGames = () => {
  const freeItems = [...document.querySelectorAll('a[role="link"]')].filter(
    (el) =>
      el.getAttribute("aria-label")?.startsWith("Free Games") &&
      [...el.querySelectorAll("span")].filter((span) =>
          span.textContent === "Free Now"
        ).length > 0,
  ).map((freeGameEl) => ({
    name:
      freeGameEl.querySelector('div[data-testid="direction-auto"]').textContent,
    website: window.location.origin + freeGameEl.getAttribute("href"),
  }));

  copy(
    freeItems.map(({ name, website }) =>
      `make add anchor=epic-games name="${name}" website="${website}"`
    ).join("\n"),
  );
};
