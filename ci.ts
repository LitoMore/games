export {};

const parseTitle = (title: string): string => {
  return title.replace(/(## |&|\.|™|®)/g, "").replace(/ /g, "-").toLowerCase();
};

const decoder = new TextDecoder("utf-8");
const dataRead = await Deno.readFile("./README.md");
const file = decoder.decode(dataRead);
const lines = file.split("\n");
const titles = lines.filter((l) => l.startsWith("##"));
const counts = titles.map((t, i) => {
  const title = parseTitle(t);
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

const newFile = lines.join("\n");
const encoder = new TextEncoder();
const dataWrite = encoder.encode(newFile);
await Deno.writeFile("README.md", dataWrite);

if (file !== newFile) {
  console.log("Count not matched");
  Deno.exit(1);
}
