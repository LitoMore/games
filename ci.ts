export {};

let exitCode = 0;

const decoder = new TextDecoder("utf-8");
const dataRead = await Deno.readFile("./README.md");
const file = decoder.decode(dataRead);
const lines = file.slice().split("\n");

const validateGamesCount = (): string[] => {
  const titles = lines.filter((l) => l.startsWith("##"));
  const counts = titles.map((t, i) => {
    const title = t.replace(/(## |&|\.|™|®)/g, "").replace(/ /g, "-")
      .toLowerCase();
    const badgeLine = lines.findIndex((l) => l.includes(title)) + 1;
    return (i < titles.length - 1)
      ? {
        title: [title],
        count: lines.indexOf(titles[i + 1]) - lines.indexOf(t) - 3,
        line: badgeLine,
      }
      : { title: "", count: -1, line: -1 };
  }).slice(0, -1);

  counts.forEach((c) => {
    lines[c.line] = lines[c.line].replace(/(\d+)-ddd/, `${c.count}-ddd`);
  });

  if (file !== lines.join("\n")) {
    console.log("Count not matched");
    exitCode = 1;
  }

  return lines;
};

const validateAlphabeticalOrder = () => {
  const tl = lines.filter((l) => l.startsWith("##")).map((t) =>
    lines.indexOf(t)
  );

  const sortGames = (a: string, b: string): number => {
    const gamePattern = /- \[(?<name>.+)\]\(.+\)/;
    const aName = (a.match(gamePattern)?.groups?.name || "").toLowerCase();
    const bName = (b.match(gamePattern)?.groups?.name || "").toLowerCase();
    if (aName < bName) return -1;
    if (aName > bName) return 1;
    return 0;
  };

  const sortedGames = tl.map((l, i) => {
    if (i < tl.length - 1) {
      const from = l + 2;
      const to = tl[i + 1] - 2;
      return {
        fromTo: [from, to],
        list: lines.slice(from, to + 1).sort(sortGames),
      };
    }

    return {
      fromTo: [-1, -1],
      list: [],
    };
  }).slice(0, -1);

  sortedGames.forEach((item) => {
    const [from, to] = item.fromTo;
    lines.splice(from, to - from + 1, ...item.list);
  });

  if (file !== lines.join("\n")) {
    console.log("Alphabetical order not matched");
    exitCode = 1;
  }
};

validateGamesCount();
validateAlphabeticalOrder();

const encoder = new TextEncoder();
const dataWrite = encoder.encode(lines.join("\n"));
await Deno.writeFile("README.md", dataWrite);
console.log("README.md updated.");

Deno.exit(exitCode);
