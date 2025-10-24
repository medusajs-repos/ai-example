import medusaAiTags from "@medusajs-ai/tags";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import Terminal from "vite-plugin-terminal";
import viteTsConfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  return {
    plugins: [
      Terminal({ console: "terminal", output: ["terminal"] }),
      viteTsConfigPaths({ projects: ["./tsconfig.json"] }),
      tailwindcss(),
      // Only enable AI tags in development
      ...(isDev
        ? [
            medusaAiTags({
              enabled: true,
              includeRuntime: true,
            }),
          ]
        : []),
      tanstackStart({
        customViteReactPlugin: true,
        target: "netlify",
      }),
      viteReact(),
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // MedusaJS vendor chunk (only non-external modules)
            "medusa-vendor": [
              "@medusajs/js-sdk",
              "@medusajs/ui",
              "@medusajs/types",
              "@medusajs/ui-preset",
            ],
          },
        },
      },
      // Optimize build performance
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
    ssr: {
      noExternal: [
        "@medusajs/js-sdk",
        "@medusajs/types",
        "@medusajs/ui",
        "@medusajs/ui-preset",
      ],
      optimizeDeps: {
        include: ["@medusajs/js-sdk"],
      },
    },
    server: {
      // Enable compression for remote development
      cors: true,
      // Pre-transform known modules on server start
      warmup: {
        clientFiles: [
          "./src/routes/**/*.tsx",
          "./src/components/**/*.tsx",
          "./src/lib/**/*.{ts,tsx}",
        ],
      },
      hmr: {
        overlay: false,
      },
    },
    // Critical: Pre-bundle dependencies to reduce module count
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/react-router",
        "@medusajs/js-sdk",
        "@medusajs/ui",
        "@medusajs/icons",
        "lodash-es",
      ],
      exclude: ["@medusajs-ai/tags"],
      entries: ["./src/app.tsx"],
    },
    cacheDir: ".vite",
  };
});
