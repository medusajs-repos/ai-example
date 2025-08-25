import { HttpTypes } from "@medusajs/types";
import { useEffect, useState } from "react";

type ProductActionsClientProps = {
  product: HttpTypes.StoreProduct;
  region: HttpTypes.StoreRegion;
  disabled?: boolean;
};

// Client-only wrapper for ProductActions
export default function ProductActionsClient(props: ProductActionsClientProps) {
  const [ProductActions, setProductActions] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Dynamically import ProductActions only on client
    import('./ProductActions').then((module) => {
      setProductActions(() => module.default);
    });
  }, []);

  // Show loading placeholder during SSR and while loading
  if (!isClient || !ProductActions) {
    return (
      <div className="flex flex-col gap-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
        <div className="text-xs text-gray-500 text-center">Loading...</div>
      </div>
    );
  }

  // Render the actual ProductActions component
  return <ProductActions {...props} />;
}