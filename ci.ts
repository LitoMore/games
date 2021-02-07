import games from "./games.ts";

const checkOrder = () => {
  games.devices.map((device) => {
    device.gameList.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      if (a.name.toLowerCase() <= b.name.toLowerCase()) {
        console.log("Check order failed.");
        console.log("Expect after:", aName);
        console.log("Expect before:", bName);
        Deno.exit(1);
      }
      return 0;
    });
  });
};

checkOrder();

Deno.exit(0);
