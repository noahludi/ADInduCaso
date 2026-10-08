# AD Indumentaria

Landing en español rioplatense, hecha con React y Vite. Usa la identidad azul y roja de AD, fotografías reales del pedido de El Ramblón y un boceto 3D generado a partir de esas prendas.

## Publicar en Vercel

1. En [Vercel](https://vercel.com/new), elegí **Add New → Project** e importá `noahludi/ADInduCaso`.
2. Usá la rama `main` y la carpeta raíz del repositorio (`./`).
3. Presioná **Deploy**. No hacen falta variables de entorno.

La configuración está guardada en `vercel.json` y `package.json`:

| Opción | Valor |
| --- | --- |
| Framework | Vite |
| Node.js | 24.x |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

Las fotos, el logo y las tipografías están incluidos en el repositorio. Vite genera dos páginas estáticas: `/` y `/galeria/`. Ambas se pueden abrir directamente o recargar en Vercel, sin reglas de reescritura. Los enlaces a secciones de la landing usan anclas (`/#proceso`, `/#trabajos`, etc.).

Con el repositorio conectado, los próximos cambios que subas a `main` se publican automáticamente. Referencia: [Vite en Vercel](https://vercel.com/docs/frameworks/frontend/vite).

## Ver la página

Requiere Node.js 24 (también indicado en `.nvmrc`).

```sh
npm ci
npm run dev
```

Abrir la dirección que muestra Vite, normalmente http://127.0.0.1:5173.

## Producción

```sh
npm run build
npm run preview
```

La carpeta `dist/` se puede publicar en cualquier hosting de sitios estáticos. La página no necesita backend ni variables de entorno.

## Qué incluye

- Portada con el logo original y el boceto de los buzos y camperas en blanco y negro.
- Recorrido de cinco etapas que avanza y retrocede con el scroll: referencia, boceto, aprobación, estampado y resultado. La escena permanece a la vista y Motion anima la referencia, el boceto y una revelación de la foto real.
- Caso de El Amigo del Chamamecero con el motivo, el boceto original y la remera terminada. Las pestañas y el teclado también permiten recorrer las etapas; el modo de movimiento reducido muestra cada imagen sin transformaciones.
- Comparación entre el boceto y las fotografías reales del trabajo terminado.
- Galería, preguntas frecuentes y contacto por Instagram y WhatsApp.
- Segunda página en `/galeria/`, con 24 imágenes de ocho proyectos, filtros por boceto, resultado o proyecto y visor ampliado con comparación del antes y el después. Cada proyecto tiene un enlace directo, por ejemplo `/galeria/#el-amigo`.
- Animaciones con Motion: entradas al hacer scroll, flotación sutil de los buzos, mensajes escalonados, transiciones del paso a paso y la galería, y acordeón de preguntas.
- Diseño adaptable, navegación de pestañas con teclado, menú móvil, estados de foco y respeto por movimiento reducido.
- Imágenes WebP y fuentes locales con sus licencias; no se necesitan servicios externos para renderizar la landing.

Los botones abren Instagram o el chat de WhatsApp de AD (+54 9 343 469 8263), con una consulta escrita para enviar. El chat ilustrativo y la aprobación de ejemplo no envían pedidos.

## Personalizar

- Contenido y preguntas: `src/main.jsx`. Recorrido por scroll: `src/Process.jsx` y `src/process.css`.
- Instagram, número de WhatsApp y mensaje de consulta: `src/contact.js`.
- Diseño, colores y tamaños: `src/styles.css`.
- Fotos y logo: `public/images/`.
- Proyectos y fotos del mosaico: `src/gallery/projects.js`.
- Procedencia de las imágenes: `docs/asset-sources.json`.
- Prompt y registro del boceto: `docs/image-generation.md`.

Las fotos entregadas en `FOTOS_AD/` se optimizan a WebP sin modificar los originales. `src/gallery/imported-photos.json` registra la procedencia, las dimensiones y los recortes. Para repetir la importación, ejecutar `node scripts/import-ad-photos.mjs`. Las capturas de bocetos se recortaron para quitar los controles del teléfono; las versiones JPEG duplicadas de los PNG no se repiten en la galería.

## Agregar fotos a la galería

La galería incluye El Ramblón, El Amigo del Chamamecero, Los Estribos de Gieco, Despensa La Amistad, MN Motos, Augusto Almada, Mecánica y BianTech Agro SAS. Los primeros cinco tienen bocetos y resultados vinculados; los restantes muestran las fotos finales disponibles.

1. Guardá las imágenes de cada nuevo proyecto en `public/images/galeria/nombre-del-proyecto/`.
2. Agregá un objeto en `src/gallery/projects.js`, con `id`, `name`, `garment` y `photos`.
3. Dentro de `photos`, cada imagen lleva un `id` único dentro del proyecto, `src`, `alt`, `width`, `height` y `kind`: `"prototype"` para el render o `"result"` para una foto real. `aspect` es opcional y define el recorte del mosaico; el visor siempre muestra la imagen completa.

Los prototipos y resultados que pertenecen al mismo proyecto se comparan juntos en el visor. Podés agregar varias fotos de cada tipo. El mosaico, los filtros y los contadores se actualizan automáticamente.

## Verificación

Con el servidor local activo:

```sh
npm run test:e2e
npm run test:gallery
npm run test:process
```

El script usa Playwright con Chromium. Si no está instalado el navegador, ejecutar `npx playwright install chromium`. Prueba las cinco etapas, teclado, aprobación, galería, preguntas, enlaces de contacto y menú móvil. Revisa nueve anchos entre 320 y 1920 px, el número y mensaje de WhatsApp, los textos eliminados, las animaciones con Motion y el modo de movimiento reducido. Guarda capturas en `test-results/`.

Para probar la compilación final puede establecerse `TEST_URL` con la dirección de `npm run preview`.

La prueba de galería verifica apertura directa, filtros por tipo y proyecto, comparación de cada pareja, miniaturas, teclado, cierre y recuperación del foco, navegación entre páginas y siete anchos de pantalla. La prueba del recorrido verifica scroll en ambos sentidos, cinco etapas, imágenes visibles, revelación del estampado, teclado, enlaces directos y geometría en escritorio, tablet, celular y orientación horizontal, con y sin movimiento reducido.
