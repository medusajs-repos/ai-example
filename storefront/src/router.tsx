import { QueryClient } from "@tanstack/react-query"
import { createRouter as createTanStackRouter } from "@tanstack/react-router"
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query"
import { lazy } from "react"
import { routeTree } from "@/routeTree.gen"

const NotFound = lazy(() => import("@/components/common/not-found"))

export function createRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Optimize for SSG - longer stale time for static data
        staleTime: 1000 * 60 * 5, // 5 minutes
        // Don't refetch on window focus for SSG
        refetchOnWindowFocus: false,
        // Don't refetch on reconnect for SSG
        refetchOnReconnect: false,
      },
    },
  })

  const router = createTanStackRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: "intent", // Good for SSG - preloads on hover/focus
    defaultNotFoundComponent: NotFound,
    scrollRestoration: true,
  })
  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  })

  return router
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
