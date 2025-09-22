import { createFileRoute, notFound } from "@tanstack/react-router";
import { getRegion } from "@/lib/data/regions";
import Store from "@/pages/store";
import { listProducts } from "../../lib/data/products";
import { createServerFn } from "@tanstack/react-start";
import { HttpTypes } from "@medusajs/types";

const getProductsStatic = createServerFn({
  type: "static"
})
.validator((data: { region_id: string }) => {
  return data;
})
.handler(async ({ data }) => {
  const { region_id } = data;
  const { products } = await listProducts({
    query_params: { 
      limit: 1000,
      order: "-created_at"
    },
    region_id,
  });
  return products as any;
});

export const Route = createFileRoute("/$countryCode/store")({
  loader: async ({ params, context }) => {
    const { countryCode } = params;
    const { queryClient } = context;

    const region = await queryClient.ensureQueryData({
      queryKey: ['region', countryCode],
      queryFn: () => getRegion({ country_code: countryCode }),
    });

    if (!region) {
      throw notFound();
    }

    const products = await queryClient.ensureQueryData({
      queryKey: ['products', { region_id: region.id }],
      queryFn: () => getProductsStatic({ data: { region_id: region.id } }),
    });

    return {
      countryCode,
      region,
      products: products as HttpTypes.StoreProduct[],
    };
  },
  head: ({ loaderData }) => {
    const { region, countryCode } = loaderData || {};
    const regionName = region?.name || countryCode?.toUpperCase();
    const title = `Shop All Products - ${regionName} | Medusa Store`;
    const description = `Browse our complete collection of products available in ${regionName}. Free shipping and easy returns.`;

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
    }
  },
  component: Store,
});