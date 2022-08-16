// ==UserScript==
// @name        Redeem Xbox
// @homepage    https://github.com/LitoMore/games
// @version     0.0.2
// @description Copy Free Games to Clipboard
// @author      LitoMore
// @match       https://www.xbox.com/*
// @require     https://cdn.jsdelivr.net/npm/@testing-library/dom/dist/@testing-library/dom.umd.js
// @downloadURL https://raw.githubusercontent.com/LitoMore/games/main/userscripts/xbox.user.js
// @updateURL   https://raw.githubusercontent.com/LitoMore/games/main/userscripts/xbox.user.js
// @grant       GM_openInTab
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
  if (
    redeemEntrance.textContent === "DonE" &&
    localStorage.getItem("xbox-redeem") !== "in-progress"
  ) {
    redeemEntrance.textContent = "RedeeM";
  }
});
document.body.appendChild(redeemEntrance);

async function processes() {
  if (/^\/[a-z]{2}-[a-z]{2}\/$/i.exec(window.location.pathname)) {
    localStorage.removeItem("xbox-redeem");
  }

  if (window.location.pathname.includes("/live/gold")) {
    fireEvent.click(document.querySelector('a[href="#gameswithgold"]'));
    const freeGames = (await screen.findAllByLabelText(/Free with gold/)).map(
      (
        el,
      ) => ({
        el,
        key: `xbox-redeem:${(new URL(el.getAttribute("href"))).pathname}`,
        name: el.querySelector("h3").textContent,
        url: el.getAttribute("href"),
      }),
    );

    await Promise.all(freeGames.map((game) => redeem(game)));
    redeemEntrance.textContent = "DonE";
  }

  if (window.location.pathname.includes("/games/store/")) {
    const storageKey = `xbox-redeem:${window.location.pathname}`;
    try {
      await Promise.any([checkIfOwned(), checkIfAvailable()]);
    } catch (error) {
      localStorage.setItem(storageKey, "fail");
      console.warn(error);
    }
    close();
  }
}

async function checkIfOwned(storageKey) {
  await screen.findByText("INSTALL TO");
  localStorage.setItem(storageKey, "owned");
}

async function checkIfAvailable() {
  const redeemButton = await screen.findByLabelText(
    /free with Xbox Live Gold/,
  );
  fireEvent.click(redeemButton);
  await waitFor(() => {
    const redeemDialog = document.querySelector("#store-cart-root");
    fireEvent.clock(within(redeemDialog).getByText("Get"));
  });
  await screen.findByText("Success!");
  localStorage.setItem(storeKey, "success");
}

function redeem(game) {
  localStorage.setItem(game.key, "in-progress");
  return new Promise((resolve) => {
    const tab = GM_openInTab(game.url, { active: false });
    tab.onclose = () => {
      resolve();
    };
  });
}

function redeemAll() {
  if (redeemEntrance.textContent !== "RedeeM") return;

  localStorage.setItem("xbox-redeem", "in-progress");
  const gamePassLiveGoldButton = within(
    screen.getByLabelText("Contextual menu"),
  )
    .getByText(/^Xbox Live Gold/);
  fireEvent.click(gamePassLiveGoldButton);
}

switch (localStorage.getItem("xbox-redeem")) {
  case "in-progress":
    redeemEntrance.textContent = "RedeeM in Progress";
    processes();
    break;
  default:
    break;
}
