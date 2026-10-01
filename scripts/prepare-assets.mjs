import fs from "node:fs/promises";
import sharp from "sharp";

const postResponse = await fetch("https://www.instagram.com/p/Db8693eiQmk/embed/");
if (!postResponse.ok)
  throw new Error("No se pudo acceder a la publicación de Instagram.");
const html = await postResponse.text();
const contextMatch = html.match(/"contextJSON":("(?:\\.|[^"\\])*")/);
if (!contextMatch)
  throw new Error("No se encontraron las imágenes de la publicación.");
const context = JSON.parse(JSON.parse(contextMatch[1]));
const media = context.gql_data.shortcode_media;
const images = media.edge_sidecar_to_children.edges.map(
  (edge) => edge.node.display_url,
);
const orderedImages = [images[0], images[1], images[3], images[2]];
for (let index = 0; index < orderedImages.length; index++) {
  const response = await fetch(orderedImages[index]);
  if (!response.ok)
    throw new Error(
      `Falló la descarga de la foto ${index + 1}: ${response.status}`,
    );
  const buffer = Buffer.from(await response.arrayBuffer());
  await sharp(buffer)
    .rotate()
    .resize({ width: 1400, withoutEnlargement: true })
    .webp({ quality: 87 })
    .toFile(`public/images/trabajo-real-0${index + 1}.webp`);
}
await sharp("docs/asset-originals/buzos-preview.png")
  .resize({ width: 1254, withoutEnlargement: true })
  .webp({ quality: 88 })
  .toFile("public/images/buzos-preview.webp");
await fs.writeFile(
  "docs/asset-sources.json",
  JSON.stringify(
    {
      logo: "https://api.instazoomer.com/media/profiles/17065689302/profile.jpg",
      originalWork: "https://www.instagram.com/p/Db8693eiQmk/",
      photos: [
        "trabajo-real-01.webp",
        "trabajo-real-02.webp",
        "trabajo-real-03.webp",
        "trabajo-real-04.webp",
      ],
      preview: {
        file: "buzos-preview.webp",
        type: "AI-generated 3D visualization based on user-provided photographs",
        tool: "built-in image_gen",
      },
      notes:
        "The chat is an illustrative example, not a real testimonial. The logo in the illustrative attachment is a code-native approximation. Product photos belong to the referenced AD Indumentaria post.",
    },
    null,
    2,
  ),
);
console.log("4 fotos reales y boceto 3D optimizados.");
