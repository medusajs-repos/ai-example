import { createRouter as createReactRouter } from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query'
import { routeTree } from './routeTree.gen'

export function createRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 30, // 30 minutes
      },
    },
  })

  return createReactRouter({
    routeTree,
    context: {
      head: '',
      queryClient,
    },
    defaultPreload: 'intent',
    scrollRestoration: true,
    isServer: typeof window === 'undefined',
  })
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
