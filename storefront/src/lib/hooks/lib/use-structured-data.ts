import { HttpTypes } from "@medusajs/types";
import { useEffect } from "react";

export function useProductStructuredData(
  product: HttpTypes.StoreProduct | null,
  region: HttpTypes.StoreRegion | null
) {
  useEffect(() => {
    if (!product || !region) return;

    // Create product structured data for SEO
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
        priceCurrency: region.currency_code?.toUpperCase(),
        price: product.variants?.[0]?.calculated_price?.calculated_amount
          ? product.variants[0].calculated_price.calculated_amount.toFixed(2)
          : undefined,
      },
    };

    // Remove existing structured data
    const existingScript = document.querySelector(
      'script[type="application/ld+json"][data-product]'
    );
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-product", "true");
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      const scriptToRemove = document.querySelector(
        'script[type="application/ld+json"][data-product]'
      );
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [product, region]);
}
