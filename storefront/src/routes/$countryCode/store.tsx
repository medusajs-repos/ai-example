import { createFileRoute } from "@tanstack/react-router";
import { listProducts } from "../../lib/data/products";
import { getRegionByCountryCode } from "../../lib/util/regions";
import { listRegions } from "../../lib/data/regions";
import Store from "../../pages/Store";

export const Route = createFileRoute("/$countryCode/store")({
  loader: async ({ params, context }) => {
    const { countryCode } = params;
    const { queryClient } = context;

    // Pre-fetch region data
    const regionPromise = queryClient.ensureQueryData({
      queryKey: ['region', countryCode],
      queryFn: () => getRegionByCountryCode(countryCode),
      staleTime: 1000 * 60 * 60, // 1 hour
    });

    // Pre-fetch regions list
    const regionsPromise = queryClient.ensureQueryData({
      queryKey: ['regions'],
      queryFn: listRegions,
      staleTime: 1000 * 60 * 60, // 1 hour
    });

    const [region, regions] = await Promise.all([regionPromise, regionsPromise]);

    // Use current region or fallback to first available region
    const defaultRegion = region || regions[0];

    let products = null;
    // Pre-fetch products for the store if we have a region
    if (defaultRegion?.id) {
      products = await queryClient.ensureQueryData({
        queryKey: ['products', { limit: 1000 }, defaultRegion.id],
        queryFn: ({ pageParam = 1 }) =>
          listProducts({
            pageParam,
            queryParams: { limit: 1000 },
            regionId: defaultRegion.id,
          }),
        staleTime: 1000 * 60 * 5, // 5 minutes
      });
    }

    return {
      countryCode,
      region: defaultRegion,
      regions,
      products,
    };
  },
  head: ({ loaderData }) => {
    const { region, products, countryCode } = loaderData || {};
    const productCount = products?.products?.length || products?.length || 0;
    const regionName = region?.name || countryCode?.toUpperCase();
    const title = `Shop All Products - ${regionName} | Medusa Store`;
    const description = `Browse our complete collection of ${productCount} products available in ${regionName}. Free shipping and easy returns.`;

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
  component: Store,
});