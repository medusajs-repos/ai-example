import { retrieveProduct } from "@/lib/data/products";
import { getRegion } from "@/lib/data/regions";
import ProductDetails from "@/pages/product";
import { HttpTypes } from "@medusajs/types";
import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/$countryCode/products/$handle")({
  loader: async ({ params, context }) => {
    const { countryCode, handle } = params;
    const { queryClient } = context;

    const region = await queryClient.ensureQueryData({
      queryKey: ["region", countryCode],
      queryFn: () => getRegion({ country_code: countryCode }),
    });

    if (!region || !handle) {
      throw notFound();
    }

    const [product] = await Promise.all([
      queryClient.ensureQueryData({
        queryKey: ["product", handle, region.id],
        queryFn: async () => {
          try {
            return await retrieveProduct({
              handle,
              region_id: region.id,
              fields:
                "*variants, *images, *options, *options.values, *collection, *tags",
            });
          } catch {
            throw notFound();
          }
        },
      }),
      queryClient.ensureQueryData({
        queryKey: ["product-dynamic", handle, region.id],
        queryFn: async () => {
          try {
            return await retrieveProduct({
              handle,
              region_id: region.id,
              fields:
                "*variants, variants.inventory_quantity, variants.manage_inventory, variants.allow_backorder, *options, *options.values",
            });
          } catch {
            throw notFound();
          }
        },
      }),
    ]);

    return {
      countryCode,
      region,
      product: product as HttpTypes.StoreProduct,
    };
  },
  head: ({ loaderData }) => {
    const { product, region } = loaderData || {};

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
