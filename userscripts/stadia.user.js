// ==UserScript==
// @name        Redeem Stadia
// @homepage    https://github.com/LitoMore/games
// @version     0.0.1
// @description Copy Free Games to Clipboard
// @author      LitoMore
// @match       https://stadia.google.com/*
// @downloadURL https://raw.githubusercontent.com/LitoMore/games/main/userscripts/stadia.user.js
// @updateURL   https://raw.githubusercontent.com/LitoMore/games/main/userscripts/stadia.user.js
// ==/UserScript==

// let href = window.location.href;

// window.addEventListener("popstate", () => {
//   console.log(window.location);
// });

// const observer = new MutationObserver((mutations) => {
//   mutations.forEach(function (mutation) {
//     if (
//       href !== document.location.href &&
//       document.location.href.startsWith("https://stadia.google.com/game/")
//     ) {
//       href = document.location.href;
//       console.log("href", href);
//     }
//   });
// });

// observer.observe(document.querySelector("body"), {
//   childList: true,
//   subtree: true,
// });

window.getStadia = () => {
  const freeItems = [
    ...document.querySelectorAll("streamable[data-page-index]"),
  ].filter((el) =>
    [...el.querySelectorAll("div")].filter((labelEl) =>
      labelEl.textContent === "Claimed"
    ).length === 0
  ).map((el) => el.querySelector("div[tabindex]")).map((el) => ({
    name: el.getAttribute("aria-label").replace(/^View /, ""),
    website: "",
  }));

  copy(
    freeItems.map(({ name, website }) =>
      `make add anchor=stadia name="${name}" website="${website}"`
    ).join("\n"),
  );
};
