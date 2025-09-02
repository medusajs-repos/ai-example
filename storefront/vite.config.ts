import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig, HmrOptions } from "vite";
import Terminal from "vite-plugin-terminal";
import viteTsConfigPaths from "vite-tsconfig-paths";

function getHmrConfig(hmrPort: number): HmrOptions {
  const options: HmrOptions = {
    port: hmrPort,
    timeout: 60000,
  };

  if (process.env.VITE_HMR_PROTOCOL) {
    options.protocol = process.env.VITE_HMR_PROTOCOL;
  }
  if (process.env.VITE_HMR_HOST) {
    options.host = process.env.HMR_HOST;
  }
  if (process.env.VITE_HMR_CLIENT_PORT) {
    options.clientPort = parseInt(process.env.VITE_HMR_CLIENT_PORT);
  }

  return options;
}

export default defineConfig(() => {
  const port = parseInt(process.env.VITE_PORT ?? "5173");
  const hmrPort = parseInt(process.env.VITE_HMR_PORT ?? "24677");
  const hmrConfig = getHmrConfig(hmrPort);
  const deploymentTarget = process.env.VITE_DEPLOYMENT_TARGET ?? "vercel";

  return {
    plugins: [
      Terminal({ console: "terminal", output: ["terminal"] }),
      viteTsConfigPaths({ projects: ["./tsconfig.json"] }),
      tailwindcss(),
      tanstackStart({ target: deploymentTarget, customViteReactPlugin: true }),
    ],
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
      allowedHosts: true as const,
      hmr: hmrConfig,
    },
  };
});
