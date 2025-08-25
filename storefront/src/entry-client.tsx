import { QueryClientProvider } from "@tanstack/react-query";
import { hydrateRoot } from "react-dom/client";
import { RouterClient } from '@tanstack/react-router/ssr/client'
import { createRouter } from "./router";

const router = createRouter();

hydrateRoot(
  document,
  <QueryClientProvider client={router.options.context.queryClient}>
    <RouterClient router={router} />
  </QueryClientProvider>
);
