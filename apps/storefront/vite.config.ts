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
      // Only enable cache purger in development
      ...(mode === "development"
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
        ssr: isDev ? false : true,
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
  };
});
