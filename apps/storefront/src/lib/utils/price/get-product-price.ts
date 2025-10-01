import { getPricePercentageDiff } from "@/lib/utils/price/get-price-precentage-diff"
import { formatPrice } from "@/lib/utils/price/format-price"
import { HttpTypes } from "@medusajs/types"

/**
 * Extracts and formats price information from a product variant.
 * Returns both calculated and original prices with formatting and percentage differences.
 * 
 * @param variant - The product variant object containing price information
 * @returns Formatted price object or null if variant has no calculated price
 * 
 * @example
 * ```typescript
 * const priceInfo = getPricesForVariant(variant);
 * if (priceInfo) {
 *   console.log(`Price: ${priceInfo.calculated_price}`);
 *   console.log(`Discount: ${priceInfo.percentage_diff}%`);
 * }
 * ```
 */
export const getPricesForVariant = (variant: any): {
  calculated_price_number: number;
  calculated_price: string;
  original_price_number: number;
  original_price: string;
  currency_code: string;
  price_type: string;
  percentage_diff: string;
} | null => {
  if (!variant?.calculated_price?.calculated_amount) {
    return null
  }

  return {
    calculated_price_number: variant.calculated_price.calculated_amount,
    calculated_price: formatPrice({
      amount: variant.calculated_price.calculated_amount,
      currency_code: variant.calculated_price.currency_code,
    }),
    original_price_number: variant.calculated_price.original_amount,
    original_price: formatPrice({
      amount: variant.calculated_price.original_amount,
      currency_code: variant.calculated_price.currency_code,
    }),
    currency_code: variant.calculated_price.currency_code,
    price_type: variant.calculated_price.calculated_price.price_list_type,
    percentage_diff: getPricePercentageDiff(
      variant.calculated_price.original_amount,
      variant.calculated_price.calculated_amount
    ),
  }
}

/**
 * Gets price information for a product, including cheapest variant price and specific variant price.
 * 
 * @param params - Parameters object
 * @param params.product - The product object containing variants
 * @param params.variant_id - Optional specific variant ID or SKU to get price for
 * @returns Object containing product, cheapest price info, and variant price info
 * @throws Error if no product is provided
 * 
 * @example
 * ```typescript
 * // Get cheapest price for a product
 * const priceInfo = getProductPrice({ product });
 * console.log(`From: ${priceInfo.cheapestPrice?.original_price}`);
 * console.log(`To: ${priceInfo.cheapestPrice?.calculated_price}`);
 * 
 * // Get price for specific variant
 * const variantPrice = getProductPrice({ 
 *   product, 
 *   variant_id: "variant_123" 
 * });
 * console.log(`Variant price: ${variantPrice.variantPrice?.calculated_price}`);
 * ```
 */
export function getProductPrice({
  product,
  variant_id,
}: {
  product: HttpTypes.StoreProduct
  variant_id?: string
}): {
  product: HttpTypes.StoreProduct;
  cheapestPrice: {
    calculated_price_number: number;
    calculated_price: string;
    original_price_number: number;
    original_price: string;
    currency_code: string;
    price_type: string;
    percentage_diff: string;
  } | null;
  variantPrice: {
    calculated_price_number: number;
    calculated_price: string;
    original_price_number: number;
    original_price: string;
    currency_code: string;
    price_type: string;
    percentage_diff: string;
  } | null;
} {
  if (!product || !product.id) {
    throw new Error("No product provided")
  }

  const cheapestPrice = () => {
    if (!product || !product.variants?.length) {
      return null
    }

    const cheapestVariant: any = product.variants
      .filter((v: any) => !!v.calculated_price)
      .sort((a: any, b: any) => {
        return (
          a.calculated_price.calculated_amount -
          b.calculated_price.calculated_amount
        )
      })[0]

    return getPricesForVariant(cheapestVariant)
  }

  const variantPrice = () => {
    if (!product || !variant_id) {
      return null
    }

    const variant: any = product.variants?.find(
      (v) => v.id === variant_id || v.sku === variant_id
    )

    if (!variant) {
      return null
    }

    return getPricesForVariant(variant)
  }

  return {
    product,
    cheapestPrice: cheapestPrice(),
    variantPrice: variantPrice(),
  }
}