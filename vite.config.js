import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
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
