import Home from "@/pages/home";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { listProducts } from "@/lib/data/products";
import { getRegion } from "@/lib/data/regions";
import { createServerFn } from "@tanstack/react-start";
import { HttpTypes } from "@medusajs/types";

const getLatestProductsStatic = createServerFn({
  type: "static"
})
.validator((data: { regionId: string }) => {
  return data;
})
.handler(async ({ data }) => {
  const { regionId } = data;
  const { products } = await listProducts({
    queryParams: { 
      limit: 4, 
      order: "-created_at"
    },
    regionId,
  });
  return products as any;
});

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

    const latestProducts = await queryClient.ensureQueryData({
      queryKey: ["latest-products", 4, region.id],
      queryFn: () => getLatestProductsStatic({ data: { regionId: region.id } }),
    });

    return {
      region,
      countryCode,
      latestProducts: latestProducts as HttpTypes.StoreProduct[],
    };
  },
  head: ({ loaderData }) => {
    const { region, countryCode, latestProducts } = loaderData || {};
    const regionName = region?.name || countryCode?.toUpperCase();
    const productCount = latestProducts?.length || 0;
    const title = `Welcome to Medusa Store - ${regionName}`;
    const description = `Discover our curated collection of products in ${regionName}. Browse our latest ${productCount} featured items and shop with confidence.`;

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
