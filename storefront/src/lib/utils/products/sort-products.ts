import { HttpTypes } from "@medusajs/types";

export type ProductSortOptions =
  | "price_asc"
  | "price_desc"
  | "created_at";

export default function sortProducts ({
  products,
  sortBy,
}: {
  products: HttpTypes.StoreProduct[];
  sortBy: ProductSortOptions;
}) {
  const sorted = [...products];

  switch (sortBy) {
    case "price_asc":
      return sorted.sort((a, b) => {
        const aPrice =
          a.variants?.[0]?.calculated_price?.calculated_amount ||
          0;
        const bPrice =
          b.variants?.[0]?.calculated_price?.calculated_amount ||
          0;
        return aPrice - bPrice;
      });
    case "price_desc":
      return sorted.sort((a, b) => {
        const aPrice =
          a.variants?.[0]?.calculated_price?.calculated_amount ||
          0;
        const bPrice =
          b.variants?.[0]?.calculated_price?.calculated_amount ||
          0;
        return bPrice - aPrice;
      });
    case "created_at":
    default:
      // They're sorted by created_at in the server
      return sorted;
  }
}