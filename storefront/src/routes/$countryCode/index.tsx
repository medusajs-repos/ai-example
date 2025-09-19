import Home from "@/pages/home";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { getRegion } from "@/lib/data/regions";

export const Route = createFileRoute("/$countryCode/")({
  loader: async ({ params, context }) => {
    const { countryCode } = params;
    const { queryClient } = context;

    // Pre-fetch region data
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
    };
  },
  head: ({ loaderData }) => {
    const { region, countryCode } = loaderData || {};
    const regionName = region?.name || countryCode?.toUpperCase();
    const title = `Welcome to Medusa Store - ${regionName}`;
    const description = `Discover our curated collection of products in ${regionName}. Browse our latest featured items and shop with confidence.`;

    return {
      meta: [
        {
          title,
        },
        {
          name: "description",
          content: description,
        },
        {
          property: "og:title",
          content: title,
        },
        {
          property: "og:description",
          content: description,
        },
        {
          property: "og:type",
          content: "website",
        },
        {
          property: "twitter:card",
          content: "summary_large_image",
        },
        {
          property: "twitter:title",
          content: title,
        },
        {
          property: "twitter:description",
          content: description,
        },
      ]
    };
  },
  component: Home,
});
