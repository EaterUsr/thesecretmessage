import { defineConfig } from "vite";
import { comlink } from "vite-plugin-comlink";

export default defineConfig({
  base: "./",
  plugins: [comlink()],
  worker: {
    plugins: [comlink()],
  },
});
