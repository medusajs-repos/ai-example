import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, HmrOptions, loadEnv } from "vite";
import Terminal from "vite-plugin-terminal";
import viteTsConfigPaths from "vite-tsconfig-paths";

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
    options.host = env.HMR_HOST;
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
  const deploymentTarget = env.VITE_DEPLOYMENT_TARGET ?? "vercel";

  console.log("hmrConfig", hmrConfig);
  console.log("env", env);

  return {
    plugins: [
      Terminal({ console: "terminal", output: ["terminal"] }),
      viteTsConfigPaths({ projects: ["./tsconfig.json"] }),
      tailwindcss(),
      tanstackStart({ customViteReactPlugin: true, target: deploymentTarget }),
      viteReact(),
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
      warmup: {
        clientFiles: ["src/pages/Home.tsx"],
      },
      port,
      allowedHosts: true as const,
      hmr: hmrConfig,
    },
  };
});
