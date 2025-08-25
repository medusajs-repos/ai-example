import { createFileRoute } from "@tanstack/react-router";
import { retrieveCategory } from "../../../lib/data/categories";
import { listProducts } from "../../../lib/data/products";
import { listRegions } from "../../../lib/data/regions";
import { getRegionByCountryCode } from "../../../lib/util/regions";
import Category from "../../../pages/Category";

export const Route = createFileRoute("/$countryCode/categories/$handle")({
  loader: async ({ params, context }) => {
    const { countryCode, handle } = params;
    const { queryClient } = context;

    // Pre-fetch region data
    const regionPromise = queryClient.ensureQueryData({
      queryKey: ["region", countryCode],
      queryFn: () => getRegionByCountryCode(countryCode),
      staleTime: 1000 * 60 * 60, // 1 hour
    });

    // Pre-fetch regions list
    const regionsPromise = queryClient.ensureQueryData({
      queryKey: ["regions"],
      queryFn: listRegions,
      staleTime: 1000 * 60 * 60, // 1 hour
    });

    // Fetch category by handle
    const categoryPromise = queryClient.ensureQueryData({
      queryKey: ["category", handle],
      queryFn: () => retrieveCategory(handle),
      staleTime: 1000 * 60 * 60, // 1 hour
    });

    const [region, regions, category] = await Promise.all([
      regionPromise,
      regionsPromise,
      categoryPromise,
    ]);

    // Use current region or fallback to first available region
    const defaultRegion = region || regions[0];

    let products = null;
    // Pre-fetch products filtered by category if we have both region and category
    if (defaultRegion?.id && category?.id) {
      products = await queryClient.ensureQueryData({
        queryKey: [
          "products",
          { limit: 1000, category: category.id },
          defaultRegion.id,
        ],
        queryFn: ({ pageParam = 1 }) =>
          listProducts({
            pageParam,
            queryParams: {
              limit: 1000,
              category_id: [category.id], // Filter by category ID
            },
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
      category,
      categoryId: category?.id,
      categoryHandle: handle,
    };
  },
  head: ({ loaderData }) => {
    const { region, products, countryCode, category, categoryHandle } =
      loaderData || {};
    const productCount = products?.products?.length || products?.length || 0;
    const regionName = region?.name || countryCode?.toUpperCase();
    const categoryName =
      category?.name ||
      categoryHandle?.charAt(0).toUpperCase() + categoryHandle?.slice(1) ||
      "Category";
    const title = `${categoryName} - ${regionName} | Medusa Store`;
    const description = `Shop our ${categoryName.toLowerCase()} collection with ${productCount} products available in ${regionName}. Free shipping and easy returns.`;

    return {
      title,
      description,
      "og:title": title,
      "og:description": description,
      "og:type": "website",
      "twitter:card": "summary_large_image",
      "twitter:title": title,
      "twitter:description": description,
    };
  },
  component: Category,
});
