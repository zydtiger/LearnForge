import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import electron from "vite-plugin-electron";

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [
    react(),
    electron({
      entry: "src-electron/main.ts",
      vite: {
        build: {
          outDir: "src-electron/dist",
        },
      },
    }),
  ],
  resolve: {
    alias: {
      "@": "/src/",
    },
  },
}));
