import { createFileRoute, notFound } from "@tanstack/react-router";
import Checkout from "@/pages/checkout";
import { getRegion } from "../../lib/data/regions";

export const Route = createFileRoute("/$countryCode/checkout")({
  loader: async ({ params, context }) => {
    const { countryCode } = params;
    const { queryClient } = context;

    const region = await queryClient.ensureQueryData({
      queryKey: ["region", countryCode],
      queryFn: () => getRegion(countryCode),
    });

    if (!region) {
      throw notFound();
    }

    return {
      region,
      countryCode,
    }
  },
  component: Checkout,
});