import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const whatsapp = (name) => `WhatsApp Image 2026-10-01 at ${name}.jpeg`;
const imports = [
  ["el-amigo", "boceto", "Leandro Hill.png"],
  ["el-amigo", "frente", whatsapp("2.03.37 PM (1)")],
  ["el-amigo", "espalda", whatsapp("2.03.38 PM")],
  ["los-estribos", "boceto", "Los Estribos De Gieco.png"],
  ["los-estribos", "resultado", whatsapp("2.03.39 PM")],
  ["despensa-la-amistad", "boceto", "Marcelo.png"],
  ["despensa-la-amistad", "frente", whatsapp("2.56.18 PM (1)")],
  ["despensa-la-amistad", "espalda", whatsapp("2.56.18 PM")],
  [
    "mn-motos",
    "boceto",
    whatsapp("2.03.39 PM (2)"),
    { left: 0, top: 480, width: 739, height: 700 },
  ],
  ["mn-motos", "espalda", whatsapp("2.03.39 PM (3)")],
  ["mn-motos", "frente", whatsapp("2.03.39 PM (4)")],
  ["augusto-almada", "espalda", whatsapp("2.03.36 PM")],
  ["augusto-almada", "conjunto", whatsapp("2.03.37 PM")],
  ["mecanica", "espalda", whatsapp("2.03.38 PM (2)")],
  ["mecanica", "frente", whatsapp("2.03.38 PM (3)")],
  ["bian-tech", "gorras", whatsapp("2.03.40 PM (1)")],
  ["bian-tech", "conjunto", whatsapp("2.03.40 PM (2)")],
  [
    "el-ramblon",
    "boceto-original",
    whatsapp("2.03.40 PM"),
    { left: 0, top: 320, width: 739, height: 960 },
  ],
  ["el-ramblon", "resultado-nuevo", whatsapp("2.03.39 PM (1)")],
  [
    "el-amigo",
    "referencia",
    "Leandro Hill.png",
    { left: 3010, top: 1050, width: 1050, height: 1220 },
  ],
  [
    "el-amigo",
    "boceto-espalda",
    "Leandro Hill.png",
    { left: 2460, top: 650, width: 2320, height: 2480 },
  ],
];

const manifest = [];
for (const [project, id, original, crop] of imports) {
  const directory = path.join("public/images/galeria", project);
  await fs.mkdir(directory, { recursive: true });
  let image = sharp(path.join("FOTOS_AD", original)).rotate();
  if (crop) image = image.extract(crop);
  else if (original.endsWith(".png")) image = image.trim();
  const output = path.join(directory, `${id}.webp`);
  const info = await image
    .resize({
      width: 1400,
      height: 1600,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 86 })
    .toFile(output);
  manifest.push({
    project,
    id,
    original: `FOTOS_AD/${original}`,
    src: `/${output.replaceAll("\\", "/").replace("public/", "")}`,
    width: info.width,
    height: info.height,
    ...(crop ? { crop } : {}),
  });
}
await fs.writeFile(
  "src/gallery/imported-photos.json",
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log(
  `Imported ${manifest.length} optimized images. Originals preserved in FOTOS_AD.`,
);
