import Home from "@/pages/Home";
import { createFileRoute } from "@tanstack/react-router";
import { listProducts } from "../../lib/data/products";
import { getRegionByCountryCode } from "../../lib/util/regions";

export const Route = createFileRoute("/$countryCode/")({
  loader: async ({ params, context }) => {
    const { countryCode } = params;
    const { queryClient } = context;

    // Pre-fetch region data
    const regionPromise = queryClient.ensureQueryData({
      queryKey: ["region", countryCode],
      queryFn: () => getRegionByCountryCode(countryCode),
      staleTime: 1000 * 60 * 60, // 1 hour
    });

    const region = await regionPromise;

    let latestProducts = null;
    // Pre-fetch latest products if we have a region
    if (region?.id) {
      latestProducts = await queryClient.ensureQueryData({
        queryKey: ["latest-products", 4, region.id],
        queryFn: () =>
          listProducts({
            queryParams: {
              limit: 4,
              order: "-created_at",
            },
            regionId: region.id,
          }),
        staleTime: 1000 * 60 * 5, // 5 minutes
      });
    }

    return {
      region,
      countryCode,
      latestProducts,
    };
  },
  head: ({ loaderData }) => {
    const { region, countryCode, latestProducts } = loaderData || {};
    const regionName = region?.name || countryCode?.toUpperCase();
    const productCount = latestProducts?.products?.length || 0;
    const title = `Welcome to Medusa Store - ${regionName}`;
    const description = `Discover our curated collection of products in ${regionName}. Browse our latest ${productCount} featured items and shop with confidence.`;

    return {
      title,
      description,
      'og:title': title,
      'og:description': description,
      'og:type': 'website',
      'twitter:card': 'summary_large_image',
      'twitter:title': title,
      'twitter:description': description,
    };
  },
  component: Home,
});
