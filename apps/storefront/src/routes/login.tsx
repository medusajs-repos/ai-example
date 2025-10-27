import { getStoredCountryCode } from "@/lib/utils/region/stored-country-code";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  loader: async () => {
    const { countryCode } = await getStoredCountryCode();

    throw redirect({
      to: "/$countryCode/login",
      params: { countryCode },
    });
  },
});
