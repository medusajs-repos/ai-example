import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import url from "node:url";
import type { BuildEnvironmentOptions } from "vite";
import { defineConfig } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SSR configuration
const ssrBuildConfig: BuildEnvironmentOptions = {
  ssr: true,
  outDir: "dist/server",
  ssrEmitAssets: true,
  copyPublicDir: false,
  emptyOutDir: true,
  rollupOptions: {
    input: path.resolve(__dirname, "src/entry-server.tsx"),
    output: {
      entryFileNames: "[name].js",
      chunkFileNames: "assets/[name]-[hash].js",
      assetFileNames: "assets/[name]-[hash][extname]",
    },
  },
};

// Client-specific configuration
const clientBuildConfig: BuildEnvironmentOptions = {
  outDir: "dist/client",
  emitAssets: true,
  copyPublicDir: true,
  emptyOutDir: true,
  rollupOptions: {
    input: path.resolve(__dirname, "src/entry-client.tsx"),
    output: {
      entryFileNames: "static/[name].js",
      chunkFileNames: "static/assets/[name]-[hash].js",
      assetFileNames: "static/assets/[name]-[hash][extname]",
    },
  },
};

// https://vitejs.dev/config/
export default defineConfig((configEnv) => {
  return {
    plugins: [
      viteTsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
      tailwindcss(),
      tanstackRouter({ target: "react", autoCodeSplitting: true }),
      react(),
    ],
    ssr: {
      noExternal: ["@medusajs/js-sdk", "@medusajs/types", "@medusajs/ui"],
    },
    server: {
      allowedHosts: true,
      hmr: {
        timeout: 60000,
      },
    },
    build: {
      ...(configEnv.isSsrBuild ? ssrBuildConfig : clientBuildConfig),
      sourcemap: false,
    },
  };
});
