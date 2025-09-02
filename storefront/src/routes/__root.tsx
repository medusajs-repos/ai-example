import Layout from "@/components/Layout";
import NotFound from "@/components/NotFound";
import RegionRedirect from "@/components/RegionRedirect";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import appCss from "../styles/app.css?url";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    links: [
      { rel: "icon", href: "/images/medusa.svg" },
      { rel: "stylesheet", href: appCss },
    ],
    meta: [
      { title: "Medusa Storefront" },
      { charSet: "UTF-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0",
      },
    ],
    scripts: [],
  }),
  notFoundComponent: NotFound,
  component: RootComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <RegionRedirect>
            <Layout />
          </RegionRedirect>
        </QueryClientProvider>

        <Scripts />
      </body>
    </html>
  );
}
