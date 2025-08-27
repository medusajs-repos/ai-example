import { QueryClientProvider } from "@tanstack/react-query";
import { RouterClient } from "@tanstack/react-router/ssr/client";
import { hydrateRoot } from "react-dom/client";
import terminal from "virtual:terminal";
import { createRouter } from "./router";

window.addEventListener("unhandledrejection", (event) => {
  terminal.error("Unhandled promise rejection:", event.reason);
});

const originalFetch = window.fetch;

window.fetch = async (...args) => {
  try {
    const response = await originalFetch(...args);
    if (!response.ok) {
      terminal.error("Fetch error:", {
        url: args[0],
        status: response.status,
        statusText: response.statusText,
      });
    }

    return response;
  } catch (error) {
    if (error instanceof Error) {
      terminal.error({
        ...error,
        errorMessage: error.message,
        errorStackTrace: error.stack,
      });
    } else {
      terminal.error(error);
    }

    throw error;
  }
};

const router = createRouter();

hydrateRoot(
  document,
  <QueryClientProvider client={router.options.context.queryClient}>
    <RouterClient router={router} />
  </QueryClientProvider>
);
