import { StaticRoute } from "./scripts/generate-static-routes";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { existsSync, readFileSync } from "fs";
import path from "path";
import { defineConfig, HmrOptions, loadEnv } from "vite";
import Terminal from "vite-plugin-terminal";
import viteTsConfigPaths from "vite-tsconfig-paths";
import { cachePurgerPlugin } from "./vite-plugins/cache-purger";
import medusaAiTags from "@medusajs-ai/tags";

function getHmrConfig(hmrPort: number, mode: string): HmrOptions {
  const env = loadEnv(mode, process.cwd());

  const options: HmrOptions = {
    port: hmrPort,
    timeout: 60000,
  };

  if (env.VITE_HMR_PROTOCOL) {
    options.protocol = env.VITE_HMR_PROTOCOL;
  }
  if (env.VITE_HMR_HOST) {
    options.host = env.VITE_HMR_HOST;
  }
  if (env.VITE_HMR_CLIENT_PORT) {
    options.clientPort = parseInt(env.VITE_HMR_CLIENT_PORT);
  }

  return options;
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  const port = parseInt(env.VITE_PORT);
  const hmrPort = parseInt(env.VITE_HMR_PORT);
  const hmrConfig = getHmrConfig(hmrPort, mode);
  const deploymentTarget = env.VITE_DEPLOYMENT_TARGET ?? "node-server";

  return {
    plugins: [
      Terminal({ console: "terminal", output: ["terminal"] }),
      viteTsConfigPaths({ projects: ["./tsconfig.json"] }),
      tailwindcss(),
      // Only enable cache purger in development
      ...(mode === "development"
        ? [
            cachePurgerPlugin(),
            medusaAiTags({
              enabled: true,
              includeRuntime: true,
            }),
          ]
        : []),
      tanstackStart({
        customViteReactPlugin: true,
        target: deploymentTarget,
        prerender: {
          enabled: true,
          autoSubfolderIndex: true,
          // Don't crawl links in pages
          crawlLinks: false,
        },
        // Load static routes from generated file if it exists
        pages: (() => {
          const routesFile = path.join(process.cwd(), "static-routes.json");
          if (existsSync(routesFile)) {
            const routes = JSON.parse(readFileSync(routesFile, "utf8"));
            console.log(
              `Loaded ${routes.length} static routes from static-routes.json`,
            );
            return routes.map((route: StaticRoute) => ({
              path: route.path,
              prerender: {
                enabled: true,
                sitemap: {
                  priority: route.priority,
                  lastmod: route.lastModified,
                },
              },
            }));
          }
        })(),
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
      port,
      hmr: hmrConfig,
    },
    preview: {
      port,
    },
  };
});
