// ==UserScript==
// @name        Redeem Stadia
// @homepage    https://github.com/LitoMore/games
// @version     0.0.1
// @description Copy Free Games to Clipboard
// @author      LitoMore
// @match       https://stadia.google.com/*
// @require     https://cdn.jsdelivr.net/npm/@testing-library/dom/dist/@testing-library/dom.umd.js
// @downloadURL https://raw.githubusercontent.com/LitoMore/games/main/userscripts/stadia.user.js
// @updateURL   https://raw.githubusercontent.com/LitoMore/games/main/userscripts/stadia.user.js
// ==/UserScript==

const { configure, fireEvent, screen, waitFor, within } =
  window.TestingLibraryDom;

configure({ asyncUtilTimeout: 1000 * 30 });

const redeemEntrance = document.createElement("button");
redeemEntrance.setAttribute(
  "style",
  "position: fixed; background-color: white; padding: 2px; right: 5px; bottom: 5px; border: none; font-size: 12px; line-height: 1.1",
);
redeemEntrance.textContent = "RedeeM";
redeemEntrance.addEventListener("click", redeemAll);
redeemEntrance.addEventListener("mouseenter", () => {
  if (redeemEntrance.textContent === "DonE") {
    redeemEntrance.textContent = "RedeeM";
  }
});
document.body.appendChild(redeemEntrance);

function goToStore() {
  const storeTab = within(screen.getByLabelText("Main navigation")).getByText(
    "Store",
  );
  fireEvent.click(storeTab);
}

async function watiForStadiaProGames() {
  window.scrollTo(0, document.body.scrollHeight);
  await waitFor(() => {
    const stadiaProGamesTitle = screen.getAllByText(
      "Stadia Pro games",
    )[1];
    const seeAll = within(stadiaProGamesTitle.parentNode).getByText("See all");
    fireEvent.click(seeAll);
  });
}

async function redeemAll() {
  goToStore();
  await watiForStadiaProGames();
}
