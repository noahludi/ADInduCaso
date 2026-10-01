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

- Portada con el logo original y el boceto de los buzos blanco y negro.
- Recorrido interactivo de cinco etapas: idea, boceto, aprobación, estampado y entrega.
- Chat ilustrativo con el pedido del cliente y la confirmación del diseño.
- Comparación entre el boceto y las fotografías reales del trabajo terminado.
- Galería, preguntas frecuentes y contacto por Instagram y WhatsApp.
- Segunda página en `/galeria/`, con mosaico, filtros por prototipo 3D o resultado real y visor ampliado para comparar las fotos de cada proyecto.
- Animaciones con Motion: entradas al hacer scroll, flotación sutil de los buzos, mensajes escalonados, transiciones del paso a paso y la galería, y acordeón de preguntas.
- Diseño adaptable, navegación de pestañas con teclado, menú móvil, estados de foco y respeto por movimiento reducido.
- Imágenes WebP y fuentes locales con sus licencias; no se necesitan servicios externos para renderizar la landing.

Los botones abren Instagram o el chat de WhatsApp de AD (+54 9 343 469 8263), con una consulta escrita para enviar. El chat ilustrativo y la aprobación de ejemplo no envían pedidos.

## Personalizar

- Contenido, etapas y preguntas: `src/main.jsx`.
- Instagram, número de WhatsApp y mensaje de consulta: `src/contact.js`.
- Diseño, colores y tamaños: `src/styles.css`.
- Fotos y logo: `public/images/`.
- Proyectos y fotos del mosaico: `src/gallery/projects.js`.
- Procedencia de las imágenes: `docs/asset-sources.json`.
- Prompt y registro del boceto: `docs/image-generation.md`.

El pequeño logo de El Ramblón en el chat es una aproximación ilustrativa hecha con texto y CSS. Puede reemplazarse por el archivo original del logo cuando esté disponible.

## Agregar fotos a la galería

La galería incluye por ahora el proyecto El Ramblón, con un prototipo 3D y cuatro fotografías reales. No hay proyectos ni fotos de relleno.

1. Guardá las imágenes de cada nuevo proyecto en `public/images/galeria/nombre-del-proyecto/`.
2. Agregá un objeto en `src/gallery/projects.js`, con `id`, `name`, `garment` y `photos`.
3. Dentro de `photos`, cada imagen lleva un `id` único dentro del proyecto, `src`, `alt`, `width`, `height` y `kind`: `"prototype"` para el render o `"result"` para una foto real. `aspect` es opcional y define el recorte del mosaico; el visor siempre muestra la imagen completa.

Los prototipos y resultados que pertenecen al mismo proyecto se comparan juntos en el visor. Podés agregar varias fotos de cada tipo. El mosaico, los filtros y los contadores se actualizan automáticamente.

## Verificación

Con el servidor local activo:

```sh
npm run test:e2e
npm run test:gallery
```

El script usa Playwright con Chromium. Si no está instalado el navegador, ejecutar `npx playwright install chromium`. Prueba las cinco etapas, teclado, aprobación, galería, preguntas, enlaces de contacto y menú móvil. Revisa nueve anchos entre 320 y 1920 px, el número y mensaje de WhatsApp, los textos eliminados, las animaciones con Motion y el modo de movimiento reducido. Guarda capturas en `test-results/`.

Para probar la compilación final puede establecerse `TEST_URL` con la dirección de `npm run preview`.

La prueba de galería verifica apertura directa, filtros, comparación, miniaturas, teclado, cierre y recuperación del foco, navegación entre páginas y siete anchos de pantalla.
