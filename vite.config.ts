import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, ".", "");

  return {
    plugins: [react(), tailwindcss()],
    // Set VITE_BASE_PATH=/repository-name/ for a GitHub Pages project site.
    base: command === "build" ? env.VITE_BASE_PATH || "/" : "/",
    build: {
      rollupOptions: {
        input: {
          main: "index.html",
          archive: "archive/index.html",
          "v0.1": "v0.1/index.html",
          "v0.2": "v0.2/index.html",
          "v0.3": "v0.3/index.html",
          "v0.4": "v0.4/index.html",
          "v0.5": "v0.5/index.html",
          "v0.6": "v0.6/index.html",
          "v0.7": "v0.7/index.html"
        }
      }
    }
  };
});
