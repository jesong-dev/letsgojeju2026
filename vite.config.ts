import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, ".", "");

  return {
    // Set VITE_BASE_PATH=/repository-name/ for a GitHub Pages project site.
    base: command === "build" ? env.VITE_BASE_PATH || "/" : "/",
    build: {
      rollupOptions: {
        input: {
          main: "index.html",
          archive: "archive/index.html",
          "v0.4": "v0.4/index.html"
        }
      }
    }
  };
});
