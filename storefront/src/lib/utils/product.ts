import type { VariantPrice } from "@/lib/types/global";
import { HttpTypes } from "@medusajs/types";
import { convertToLocale } from "@/lib/utils/money";

export const getProductPrice = ({
  product,
  variantId,
  region,
}: {
  product: HttpTypes.StoreProduct;
  variantId?: string;
  region: HttpTypes.StoreRegion;
}): VariantPrice | undefined => {
  if (!product?.variants?.length || !region) {
    return undefined;
  }

  const variant = variantId
    ? product.variants.find((v) => v.id === variantId)
    : product.variants[0];

  if (!variant) {
    return undefined;
  }

  const price = variant.calculated_price;

  if (!price) {
    return undefined;
  }

  const calculatedPriceNumber = price.calculated_amount || 0;
  const originalPriceNumber = price.original_amount || calculatedPriceNumber;

  const calculatedPrice = convertToLocale({
    amount: calculatedPriceNumber,
    currency_code: region.currency_code,
  });

  const originalPriceFormatted = convertToLocale({
    amount: originalPriceNumber,
    currency_code: region.currency_code,
  });

  const percentageDiff =
    originalPriceNumber > calculatedPriceNumber
      ? Math.round(
          ((originalPriceNumber - calculatedPriceNumber) /
            originalPriceNumber) *
            100
        )
      : 0;

  return {
    calculated_price_number: calculatedPriceNumber,
    calculated_price: calculatedPrice,
    original_price_number: originalPriceNumber,
    original_price: originalPriceFormatted,
    currency_code: region.currency_code,
    price_type: "default",
    percentage_diff: percentageDiff > 0 ? `${percentageDiff}%` : "",
  };
};

export const getProductHandle = (product: HttpTypes.StoreProduct): string => {
  return product.handle || product.id;
};

export const getProductImageUrl = (
  product: HttpTypes.StoreProduct
): string | undefined => {
  return product.thumbnail || product.images?.[0]?.url;
};

export const isSimpleProduct = (product: HttpTypes.StoreProduct): boolean => {
  return (
    (product.options?.length || 0) <= 1 &&
    (product.options?.[0]?.values?.length || 0) <= 1
  );
};
