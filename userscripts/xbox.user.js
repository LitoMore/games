// ==UserScript==
// @name        Redeem Xbox
// @homepage    https://github.com/LitoMore/games
// @version     0.0.1
// @description Copy Free Games to Clipboard
// @author      LitoMore
// @match       https://www.xbox.com/*
// @downloadURL https://raw.githubusercontent.com/LitoMore/games/main/userscripts/xbox.user.js
// @updateURL   https://raw.githubusercontent.com/LitoMore/games/main/userscripts/xbox.user.js
// ==/UserScript==

window.getXbox = () => {
  const freeItems = [...document.querySelectorAll(
    ".free-games .m-content-placement-item",
  )].map((el) => ({
    name: el.querySelector("div a span").textContent,
    website: el.querySelector("div a").getAttribute("href"),
  }));

  copy(
    freeItems.map(({ name, website }) =>
      `make add anchor=xbox name="${name}" website="${website}"`
    ).join("\n"),
  );
};
