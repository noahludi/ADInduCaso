import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: fileURLToPath(new URL("./index.html", import.meta.url)),
        gallery: fileURLToPath(
          new URL("./galeria/index.html", import.meta.url),
        ),
      },
      onwarn(warning, warn) {
        // This is a browser-only app; Motion's React Server Component markers do not apply.
        if (
          warning.code === "MODULE_LEVEL_DIRECTIVE" &&
          warning.message.includes('"use client"') &&
          warning.id
            ?.replaceAll("\\", "/")
            .includes("/node_modules/framer-motion/")
        )
          return;
        warn(warning);
      },
    },
  },
});
