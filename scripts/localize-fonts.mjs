import fs from "node:fs/promises";

const cssURL =
  "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800;900&family=DM+Sans:wght@400;450;500;550;600;650;700&display=swap";
const response = await fetch(cssURL, {
  headers: { "User-Agent": "Mozilla/5.0 Chrome/131.0.0.0 Safari/537.36" },
});
if (!response.ok) throw new Error("No se pudieron descargar las fuentes.");
let css = await response.text();
await fs.mkdir("public/fonts", { recursive: true });
const urls = [
  ...new Set(
    [...css.matchAll(/url\((https:[^)]+)\)/g)].map((match) => match[1]),
  ),
];
for (const [index, url] of urls.entries()) {
  const extension = new URL(url).pathname.split(".").at(-1);
  const filename = `font-${String(index + 1).padStart(2, "0")}.${extension}`;
  const fontResponse = await fetch(url);
  if (!fontResponse.ok) throw new Error(`No se pudo descargar ${filename}.`);
  await fs.writeFile(
    `public/fonts/${filename}`,
    Buffer.from(await fontResponse.arrayBuffer()),
  );
  css = css.replaceAll(url, `/fonts/${filename}`);
}
await fs.writeFile("src/fonts.css", css);
const licenses = [
  [
    "barlow-condensed",
    "https://raw.githubusercontent.com/google/fonts/main/ofl/barlowcondensed/OFL.txt",
  ],
  [
    "dm-sans",
    "https://raw.githubusercontent.com/google/fonts/main/ofl/dmsans/OFL.txt",
  ],
];
for (const [name, url] of licenses) {
  const license = await fetch(url);
  if (!license.ok)
    throw new Error(`No se pudo descargar la licencia de ${name}.`);
  await fs.writeFile(`public/fonts/LICENSE-${name}.txt`, await license.text());
}
console.log(
  `${urls.length} archivos de fuentes guardados localmente, con sus licencias.`,
);
