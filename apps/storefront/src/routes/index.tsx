import { createFileRoute, redirect } from "@tanstack/react-router";
import { getStoredCountryCode } from "@/lib/data/country-code";

export const Route = createFileRoute("/")({
  loader: async () => {
    const { countryCode } = await getStoredCountryCode();

    throw redirect({
      to: "/$countryCode",
      params: { countryCode },
    });
  },
});
