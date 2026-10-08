import importedPhotos from "./imported-photos.json" with { type: "json" };

const photo = (project, id, kind, alt) => {
  const asset = importedPhotos.find(
    (item) => item.project === project && item.id === id,
  );
  return {
    id,
    kind,
    src: asset.src,
    width: asset.width,
    height: asset.height,
    alt,
  };
};

// Cada proyecto agrupa sus prototipos y resultados. El mosaico y el visor
// se actualizan al agregar fotos acá, sin tocar los componentes.
export const projects = [
  {
    id: "el-ramblon",
    name: "El Ramblón",
    garment: "Buzos y camperas",
    photos: [
      {
        id: "prototipo",
        kind: "prototype",
        src: "/images/buzos-preview.webp",
        alt: "Prototipo 3D de buzos y camperas en blanco y negro con el logo de El Ramblón",
        width: 1254,
        height: 1254,
        aspect: "4 / 5",
      },
      {
        id: "buzos-terminados",
        kind: "result",
        src: "/images/trabajo-real-01.webp",
        alt: "Buzos y camperas de El Ramblón terminados en blanco y negro, con su logo estampado",
        width: 1400,
        height: 1400,
        aspect: "1 / 1",
      },
      {
        id: "buzo-blanco",
        kind: "result",
        src: "/images/trabajo-real-03.webp",
        alt: "Campera blanca con cierre y logo de El Ramblón estampado en el pecho",
        width: 1400,
        height: 1400,
        aspect: "4 / 5",
      },
      {
        id: "los-dos-colores",
        kind: "result",
        src: "/images/trabajo-real-02.webp",
        alt: "Buzos y camperas en blanco y negro de El Ramblón vistos de frente",
        width: 1400,
        height: 1400,
        aspect: "5 / 4",
      },
      {
        id: "detalle-estampado",
        kind: "result",
        src: "/images/trabajo-real-04.webp",
        alt: "Detalle del logo azul de El Ramblón estampado sobre la campera negra",
        width: 1400,
        height: 1400,
        aspect: "1 / 1",
      },
      photo(
        "el-ramblon",
        "boceto-original",
        "prototype",
        "Boceto original de El Ramblón: buzo con capucha, campera y buzo con cierre, frente y espalda",
      ),
      photo(
        "el-ramblon",
        "resultado-nuevo",
        "result",
        "Buzos y camperas en blanco y negro de El Ramblón con el logo azul estampado en el pecho",
      ),
    ],
  },
  {
    id: "el-amigo",
    name: "El Amigo del Chamamecero",
    garment: "Remeras en blanco y negro",
    photos: [
      photo(
        "el-amigo",
        "boceto",
        "prototype",
        "Boceto de remeras blancas y negras de El Amigo del Chamamecero, frente y espalda",
      ),
      photo(
        "el-amigo",
        "frente",
        "result",
        "Remera negra terminada con el emblema de la peña en el pecho",
      ),
      photo(
        "el-amigo",
        "espalda",
        "result",
        "Remera negra de El Amigo del Chamamecero con el acordeón y el logo estampados en la espalda",
      ),
    ],
  },
  {
    id: "los-estribos",
    name: "Los Estribos de Gieco",
    garment: "Buzo negro con capucha",
    photos: [
      photo(
        "los-estribos",
        "boceto",
        "prototype",
        "Boceto del buzo de Los Estribos de Gieco con texto en el pecho y logo Gulf en la manga",
      ),
      photo(
        "los-estribos",
        "resultado",
        "result",
        "Buzo terminado de Los Estribos de Gieco con el texto y el logo Gulf estampados",
      ),
    ],
  },
  {
    id: "despensa-la-amistad",
    name: "Despensa La Amistad",
    garment: "Buzos con nombres personalizados",
    photos: [
      photo(
        "despensa-la-amistad",
        "boceto",
        "prototype",
        "Boceto de buzos blancos para Despensa La Amistad con nombre al frente y logo en la espalda",
      ),
      photo(
        "despensa-la-amistad",
        "frente",
        "result",
        "Buzos terminados de Despensa La Amistad para Adriana, Marcelo, Andrea y Arnaldo",
      ),
      photo(
        "despensa-la-amistad",
        "espalda",
        "result",
        "Espalda del buzo terminado con el logo de Despensa La Amistad",
      ),
    ],
  },
  {
    id: "mn-motos",
    name: "MN Motos",
    garment: "Buzo con estampado en mangas",
    photos: [
      photo(
        "mn-motos",
        "boceto",
        "prototype",
        "Boceto del buzo negro de MN Motos con gráficos violetas en el pecho, la espalda y las mangas",
      ),
      photo(
        "mn-motos",
        "frente",
        "result",
        "Frente del buzo terminado de MN Motos con logo violeta",
      ),
      photo(
        "mn-motos",
        "espalda",
        "result",
        "Espalda del buzo terminado de MN Motos con motor, banderas y estampas en las mangas",
      ),
    ],
  },
  {
    id: "augusto-almada",
    name: "Augusto Almada",
    garment: "Remeras de electricidad domiciliaria",
    photos: [
      photo(
        "augusto-almada",
        "espalda",
        "result",
        "Espalda de la remera negra de Augusto Almada, electricidad domiciliaria",
      ),
      photo(
        "augusto-almada",
        "conjunto",
        "result",
        "Remeras negras y gris de Augusto Almada con el logo estampado en el pecho",
      ),
    ],
  },
  {
    id: "mecanica",
    name: "Mecánica",
    garment: "Buzo con logos en la espalda",
    photos: [
      photo(
        "mecanica",
        "frente",
        "result",
        "Frente del buzo negro de mecánica con el logo en rojo y blanco",
      ),
      photo(
        "mecanica",
        "espalda",
        "result",
        "Espalda del buzo de mecánica con ilustración de bujía y logos de marcas",
      ),
    ],
  },
  {
    id: "bian-tech",
    name: "BianTech Agro SAS",
    garment: "Remeras y gorras",
    photos: [
      photo(
        "bian-tech",
        "conjunto",
        "result",
        "Remeras blancas y negras y gorra de BianTech Agro SAS con logo verde",
      ),
      photo(
        "bian-tech",
        "gorras",
        "result",
        "Gorras negras de BianTech Agro SAS con el logo verde estampado",
      ),
    ],
  },
];

export const photoKinds = {
  prototype: "Boceto",
  result: "Resultado real",
};
