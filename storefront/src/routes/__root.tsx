import Layout from "@/components/layout";
import NotFound from "@/components/not-found";
import RegionRedirect from "@/components/region-redirect";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import appCss from "@/styles/app.css?url";
import { listRegions } from "@/lib/data/regions";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  loader: async ({ context }) => {
    const { queryClient } = context;
    
    // Pre-populate regions cache
    await queryClient.ensureQueryData({
      queryKey: ["regions"],
      queryFn: listRegions,
    });
    
    return {};
  },
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
