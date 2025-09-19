import { createFileRoute, notFound } from "@tanstack/react-router";
import { retrieveCategory } from "@/lib/data/categories";
import { listProducts } from "@/lib/data/products";
import { getRegion } from "@/lib/data/regions";
import Category from "@/pages/category";
import { createServerFn } from "@tanstack/react-start";
import { HttpTypes } from "@medusajs/types";

const getCategoryStatic = createServerFn({
  type: "static"
})
.validator((data: { handle: string }) => {
  return data;
})
.handler(async ({ data }) => {
  const { handle } = data;
  try {
    const category = await retrieveCategory(handle);
    return category as any;
  } catch (error) {
    throw notFound()
  }
});

const getCategoryProductsStatic = createServerFn({
  type: "static"
})
.validator((data: { regionId: string, categoryId: string }) => {
  return data;
})
.handler(async ({ data }) => {
  const { regionId, categoryId } = data;
  const { products } = await listProducts({
    queryParams: { 
      limit: 100, 
      category_id: categoryId,
      order: "-created_at"
    },
    regionId,
  });
  return products as any;
});


export const Route = createFileRoute("/$countryCode/categories/$handle")({
  loader: async ({ params, context }) => {
    const { countryCode, handle } = params;
    const { queryClient } = context;

    // Pre-fetch region data
    const region = await queryClient.ensureQueryData({
      queryKey: ["region", countryCode],
      queryFn: () => getRegion(countryCode),
    });

    if (!region || !handle) {
      throw notFound();
    }

    // Fetch category by handle
    const category = await queryClient.ensureQueryData({
      queryKey: ["category", handle],
      queryFn: () => getCategoryStatic({ data: { handle } }),
    });

    const products = await queryClient.ensureQueryData({
      queryKey: ["products", { limit: 1000, category: category.id }, region.id],
      queryFn: () =>
        getCategoryProductsStatic({ data: { 
          regionId: region.id, 
          categoryId: category.id
        }}),
    });

    return {
      countryCode,
      region,
      products: products as HttpTypes.StoreProduct[],
      category: category as HttpTypes.StoreProductCategory,
    };
  },
  head: ({ loaderData }) => {
    const { region, products, countryCode, category } =
      loaderData || {};
    const productCount = products?.length || 0;
    const regionName = region?.name || countryCode?.toUpperCase();
    const categoryName = category?.name || "Category";
    const title = `${categoryName} - ${regionName} | Medusa Store`;
    const description = `Shop our ${categoryName.toLowerCase()} collection with ${productCount} products available in ${regionName}. Free shipping and easy returns.`;

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
  component: Category,
});
