import { createFileRoute, notFound } from "@tanstack/react-router";
import { retrieveProduct } from "@/lib/data/products";
import { listRegions } from "@/lib/data/regions";
import { getRegion } from "@/lib/data/regions";
import ProductDetails from "@/pages/product-details";
import { createServerFn } from "@tanstack/react-start";
import { HttpTypes } from "@medusajs/types";

const getProductStatic = createServerFn({
  type: "static"
})
.validator((data: { handle: string; regionId: string }) => {
  return data;
})
.handler(async ({ data }) => {
  const { handle, regionId } = data;
  try {
    const product = await retrieveProduct({ 
      handle, 
      regionId,
      fields: "*variants, *images, *options, *options.values, *collection, *tags"
    });
    // Use type assertion to bypass strict typing
    return product as any;
  } catch (error) {
    throw notFound()
  }
});

export const Route = createFileRoute("/$countryCode/products/$handle")({
  loader: async ({ params, context }) => {
    const { countryCode, handle } = params;
    const { queryClient } = context;

    // Pre-fetch region data
    const regionPromise = queryClient.ensureQueryData({
      queryKey: ["region", countryCode],
      queryFn: () => getRegion(countryCode),
    });

    // Pre-fetch regions list
    const regionsPromise = queryClient.ensureQueryData({
      queryKey: ["regions"],
      queryFn: listRegions,
    });

    const [region, regions] = await Promise.all([
      regionPromise,
      regionsPromise,
    ]);

    // Use current region or fallback to first available region
    const defaultRegion = region || regions[0];

    let product = null;
    // Pre-fetch product data if we have a region
    if (defaultRegion?.id && handle) {
      product = await queryClient.ensureQueryData({
        queryKey: ["product", handle, defaultRegion.id],
        queryFn: () => getProductStatic({
          data: {
            handle,
            regionId: defaultRegion.id
          }
        }),
      });
    }

    return {
      countryCode,
      handle,
      region: defaultRegion,
      regions,
      product: product as HttpTypes.StoreProduct,
    };
  },
  head: ({ loaderData }) => {
    const { product, region } = loaderData || {}

    if (!product) {
      return {
        meta: [
          {
            title: "Product Not Found | Medusa Store",
          },
        ],
      };
    }

    // Create structured data for SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.title,
      description: product.description,
      image: product.images?.map((img: any) => img.url).filter(Boolean) || [],
      brand: {
        "@type": "Brand",
        name: "Medusa Store",
      },
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/InStock",
        priceCurrency: region?.currency_code?.toUpperCase(),
        price: product.variants?.[0]?.calculated_price?.calculated_amount
          ? product.variants[0].calculated_price.calculated_amount.toFixed(2)
          : undefined,
      },
    };

    return {
      meta: [
        {
          title: `${product.title} | Medusa Store`,
        },
        {
          name: "description",
          content: product.description || "Product details",
        },
        {
          property: "og:title",
          content: `${product.title} | Medusa Store`,
        },
        {
          property: "og:description",
          content:
            product.description || "Check out this product on Medusa Store",
        },
        {
          property: "og:image",
          content: product.thumbnail || "",
        },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(structuredData),
        },
      ],
    };
  },
  component: ProductDetails,
});
