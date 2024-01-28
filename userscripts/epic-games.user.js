// ==UserScript==
// @name        Claim Epic Games
// @homepage    https://github.com/LitoMore/games
// @version     0.0.7
// @description Automation script for claiming Epic Games weekly items
// @author      LitoMore
// @match       https://*.epicgames.com/*
// @require     https://cdn.jsdelivr.net/npm/@testing-library/dom/dist/@testing-library/dom.umd.js
// @downloadURL https://raw.githubusercontent.com/LitoMore/games/main/userscripts/epic-games.user.js
// @updateURL   https://raw.githubusercontent.com/LitoMore/games/main/userscripts/epic-games.user.js
// @grant       GM_setClipboard
// ==/UserScript==

const uesrConfig = {
  saveCommandsToClipboard: false, // Save `make add` commands to clipboard once redeem process is done.
  developmentMode: false, // Use development mode, games won't actually claim.
};

const { configure, fireEvent, screen, waitFor } = globalThis.TestingLibraryDom;

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

if (globalThis.location.pathname.includes("/purchase")) {
  redeemEntrance.style.display = "none";
  try {
    await waitForPlaceOrder();
  } catch (error) {
    alert(error.name + error.message);
  }
}

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
    url: globalThis.location.origin + el.getAttribute("href"),
  }));

  return freeGames;
}

async function waitForAgeConfirm() {
  const ageConfirmText = await waitFor(() =>
    screen.getByText(
      /This game contains mature content recommended only for ages/,
    ), {
    timeout: 1000,
    onTimeout: () => null,
  });

  if (ageConfirmText) {
    fireEvent.click(screen.getByText("Continue"));
  }
}

async function waitForNotCompatibleText() {
  const ageConfirmText = await waitFor(() =>
    screen.getByText(
      /This product is not compatible with your current device/,
    ), {
    timeout: 1000,
    onTimeout: () => null,
  });

  if (ageConfirmText) {
    fireEvent.click(screen.getByText("Continue"));
  }
}

async function waitForPlaceOrder() {
  const placeOrderButton = await screen.findByText("Place Order");
  fireEvent.click(placeOrderButton);
}

function saveCommandsToClipboard() {
  const quoted = (str) => `$'${str.replace(/'/g, "\\'")}'`;
  GM_setClipboard?.(
    freeGames.map((game) =>
      `make add anchor=epic-games name=${
        quoted(game.name)
      } website='${game.url}'`
    ).join("\n"),
  );
}

async function redeem(game) {
  fireEvent.click(
    document.querySelector(`[href="${game.el.getAttribute("href")}"]`),
  );

  const redeemButton = await screen.findByTestId("purchase-cta-button");

  await waitForAgeConfirm();

  if (!uesrConfig.developmentMode && redeemButton.textContent === "Get") {
    fireEvent.click(redeemButton);
    await waitForNotCompatibleText();
    await screen.findByText("Thank you for buying");
    fireEvent.click(await screen.findByLabelText("Close modal"));
  }
  fireEvent.click(document.querySelector('.shieldLogo[role="button"]'));
  await waitFor(getFreeGames);
  return;
}

async function redeemAll() {
  if (!checkLoginState()) {
    globalThis.alert("Requires sign-in for redeeming games.");
    return;
  }

  if (redeemEntrance.textContent !== "RedeeM") return;

  redeemEntrance.textContent = "RedeeM in Progress";
  const freeGames = await waitFor(getFreeGames);
  for (const game of freeGames) {
    await redeem(game);
  }
  redeemEntrance.textContent = "DonE";

  if (uesrConfig.saveCommandsToClipboard) {
    saveCommandsToClipboard();
  }
}
