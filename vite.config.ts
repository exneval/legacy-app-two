import { defineConfig } from "vite";
import path from "path";
import fs from "fs";
import react from "@vitejs/plugin-react";
import visualizer from "rollup-plugin-visualizer";

// In codesandbox, we won't have the packages folder
// We ignore errors in this case
let aliases = [];
try {
  const packages = fs.readdirSync(path.resolve(__dirname, "../../packages"));
  aliases = packages.reduce((acc, dirName) => {
    const packageJson = require(path.resolve(
      __dirname,
      "../../packages",
      dirName,
      "package.json"
    ));
    acc[packageJson.name] = path.resolve(
      __dirname,
      `${path.resolve("../..")}/packages/${packageJson.name}/src`
    );
    return acc;
  }, {});
} catch {}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: process.env.NODE_ENV !== "CI",
      filename: "./dist/stats.html",
    }),
  ],
  define: {
    "process.env": process.env,
  },
  preview: {
    host: true,
    strictPort: true,
  },
  base: "./",
  esbuild: {
    keepNames: true,
  },
  build: {
    sourcemap: true,
  },
  resolve: {
    preserveSymlinks: true,
    alias: [
      // allow profiling in production
      { find: "react-dom", replacement: "react-dom/profiling" },
      {
        find: "scheduler/tracing",
        replacement: "scheduler/tracing-profiling",
      },
      // we need to manually follow the symlinks for local packages to allow deep HMR
      ...Object.keys(aliases).map((packageName) => ({
        find: packageName,
        replacement: aliases[packageName],
      })),
    ],
  },
});
