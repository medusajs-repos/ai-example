import Layout from "@/components/Layout";
import RegionRedirect from "@/components/RegionRedirect";
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import type { RouterContext } from "../routerContext";
import appCss from "../styles/app.css?url";

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    links: [
      { rel: "icon", href: "/images/medusa.svg" },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
    meta: [
      {
        title: "TanStack Router SSR Basic File Based Streaming",
      },
      {
        charSet: "UTF-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0",
      },
    ],
    scripts: [
      ...(!import.meta.env.PROD
        ? [
            {
              type: "module",
              children: `import RefreshRuntime from "/@react-refresh"
  RefreshRuntime.injectIntoGlobalHook(window)
  window.$RefreshReg$ = () => {}
  window.$RefreshSig$ = () => (type) => type
  window.__vite_plugin_react_preamble_installed__ = true`,
            },
            {
              type: "module",
              src: "/@vite/client",
            },
          ]
        : []),
      {
        type: "module",
        src: import.meta.env.PROD
          ? "/static/entry-client.js"
          : "/src/entry-client.tsx",
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <RegionRedirect>
          <Layout />
        </RegionRedirect>
        <Scripts />
      </body>
    </html>
  );
}
