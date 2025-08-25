import { createFileRoute } from "@tanstack/react-router";
import { retrieveProduct } from "../../../lib/data/products";
import { listRegions } from "../../../lib/data/regions";
import { getRegionByCountryCode } from "../../../lib/util/regions";
import ProductDetails from "../../../pages/ProductDetails";

// Temporary minimal test component
const TestComponent = () => {
  console.log("🎯 TEST COMPONENT IS RENDERING!");
  return (
    <div
      style={{ padding: "40px", background: "yellow", border: "5px solid red" }}
    >
      <h1>🚀 TEST COMPONENT WORKS!</h1>
      <p>
        If you see this, the route is working but there's an issue with
        ProductDetails
      </p>
    </div>
  );
};

export const Route = createFileRoute("/$countryCode/products/$handle")({
  loader: async ({ params, context }) => {
    const { countryCode, handle } = params;
    const { queryClient } = context;

    console.log("🚀 Route loader running for:", { countryCode, handle });

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
        queryFn: () => retrieveProduct(handle, defaultRegion.id),
        staleTime: 1000 * 60 * 5, // 5 minutes
      });
    }

    const loaderResult = {
      countryCode,
      handle,
      region: defaultRegion,
      regions,
      product,
    };

    console.log("✅ Route loader completed with data:", {
      hasProduct: !!product,
      hasRegion: !!defaultRegion,
      productTitle: product?.title,
    });

    return loaderResult;
  },
  head: ({ loaderData }) => {
    const { product, region } = loaderData;

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
      image: product.images?.map((img) => img.url).filter(Boolean) || [],
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
