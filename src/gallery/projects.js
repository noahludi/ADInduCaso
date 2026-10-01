// Cada proyecto agrupa sus prototipos y resultados. El mosaico y el visor
// se actualizan al agregar fotos acá, sin tocar los componentes.
export const projects = [
  {
    id: "el-ramblon",
    name: "El Ramblón",
    garment: "Buzos con cierre",
    photos: [
      {
        id: "prototipo",
        kind: "prototype",
        src: "/images/buzos-preview.webp",
        alt: "Prototipo 3D de buzos blanco y negro con el logo de El Ramblón",
        width: 1254,
        height: 1254,
        aspect: "4 / 5",
      },
      {
        id: "buzos-terminados",
        kind: "result",
        src: "/images/trabajo-real-01.webp",
        alt: "Buzos blanco y negro de El Ramblón terminados, con su logo estampado",
        width: 1400,
        height: 1400,
        aspect: "1 / 1",
      },
      {
        id: "buzo-blanco",
        kind: "result",
        src: "/images/trabajo-real-03.webp",
        alt: "Buzo blanco con cierre y logo de El Ramblón estampado en el pecho",
        width: 1400,
        height: 1400,
        aspect: "4 / 5",
      },
      {
        id: "los-dos-colores",
        kind: "result",
        src: "/images/trabajo-real-02.webp",
        alt: "Los buzos blanco y negro de El Ramblón vistos de frente",
        width: 1400,
        height: 1400,
        aspect: "5 / 4",
      },
      {
        id: "detalle-estampado",
        kind: "result",
        src: "/images/trabajo-real-04.webp",
        alt: "Detalle del logo azul de El Ramblón estampado sobre el buzo negro",
        width: 1400,
        height: 1400,
        aspect: "1 / 1",
      },
    ],
  },
];

export const photoKinds = {
  prototype: "Prototipo 3D",
  result: "Resultado real",
};
