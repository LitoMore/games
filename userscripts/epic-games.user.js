// ==UserScript==
// @name        Redeem Epic Games
// @homepage    https://github.com/LitoMore/games
// @version     0.0.3
// @description Copy Free Games to Clipboard
// @author      LitoMore
// @match       https://*.epicgames.com/*
// @require     https://cdn.jsdelivr.net/npm/@testing-library/dom/dist/@testing-library/dom.umd.js
// @downloadURL https://raw.githubusercontent.com/LitoMore/games/main/userscripts/epic-games.user.js
// @updateURL   https://raw.githubusercontent.com/LitoMore/games/main/userscripts/epic-games.user.js
//
// ==/UserScript==

const { configure, fireEvent, screen, waitFor } = window.TestingLibraryDom;

configure({ asyncUtilTimeout: 1000 * 30 });

const redeemEntrance = document.createElement("button");
redeemEntrance.setAttribute(
  "style",
  "position: fixed; background-color: white; padding: 2px; right: 5px; bottom: 5px;",
);
redeemEntrance.textContent = "RedeeM";
redeemEntrance.addEventListener("click", redeemAll);
redeemEntrance.addEventListener("mouseenter", () => {
  if (redeemEntrance.textContent === "DonE") {
    redeemEntrance.textContent = "RedeeM";
  }
});
document.body.appendChild(redeemEntrance);

function checkLoginState() {
  return document.querySelector(".sign-text").textContent !== "Sign In";
}

function getFreeGames() {
  const freeGamesNodes = screen.getAllByLabelText(
    /^Free Games, \d+ of \d+, Free Now/,
  );
  const freeGames = freeGamesNodes.map((el) => ({
    el,
    name:
      el.querySelector('[data-testid="offer-title-info-title"]').textContent,
    url: window.location.origin + el.getAttribute("href"),
  }));

  return freeGames;
}

async function redeem(game) {
  fireEvent.click(game.el);

  const redeemButton = await waitFor(
    () => screen.getByTestId("purchase-cta-button"),
  );

  if (redeemButton.textContent === "Get") {
    fireEvent.click(redeemButton);
    fireEvent.click(
      await waitFor(() => screen.getByText("Place Order")),
    );
    await waitFor(() => screen.getByText("Thank you for buying"));
    fireEvent.click(await waitFor(() => screen.getByLabelText("Close modal")));
  }
  fireEvent.click(document.querySelector('.shieldLogo[role="button"]'));
  await waitFor(getFreeGames);
  return;
}

async function redeemAll() {
  if (!checkLoginState()) {
    window.alert("Requires sign-in for redeeming games.");
    return;
  }

  if (redeemEntrance.textContent !== "RedeeM") return;

  redeemEntrance.textContent = "RedeeM in Progress";
  const freeGames = await waitFor(getFreeGames);
  for (const game of freeGames) {
    await redeem(game);
  }
  redeemEntrance.textContent = "DonE";
}
