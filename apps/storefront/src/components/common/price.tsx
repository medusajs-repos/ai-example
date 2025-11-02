import { formatPrice } from "@/lib/utils/price/format-price";
import { clsx } from "clsx";
import { useMemo } from "react";

/**
 * AI AGENT USAGE GUIDE:
 *
 * WHEN TO USE:
 * - Use for displaying product prices throughout the storefront
 * - Product cards: show current price with optional original price
 * - Product detail pages: display pricing with discounts
 * - Cart items: show individual item prices
 * - Checkout summary: display totals, taxes, shipping costs
 * - Order confirmations: show final pricing breakdown
 * - Search results: display price ranges for filtered products
 *
 * ECOMMERCE CONTEXT:
 * - Essential for product pricing display and comparison
 * - Shows discounts and promotional pricing
 * - Displays price ranges for product variants
 * - Critical for checkout flow (totals, taxes, shipping)
 * - Used in order management and history
 * - Important for price-based filtering and sorting
 *
 * PRICING TYPES:
 * - "default": Standard product pricing
 * - "range": "From $X" pricing for variants
 * - "discount": Shows discount percentage and savings
 *
 * SIZE GUIDELINES:
 * - "small": Product cards, cart items, order line items
 * - "base": Product detail pages, checkout summary
 * - "large": Hero sections, featured products
 * - "xlarge": Promotional banners, sale announcements
 *
 * EXAMPLES:
 * - <Price price={29.99} currencyCode="USD" />
 * - <Price price={19.99} originalPrice={{price: 29.99, percentage: "33%"}} />
 * - <Price price={29.99} type="range" textSize="large" />
 */

export type PriceProps = {
  price: number | string;
  type?: "default" | "range" | "discount";
  originalPrice?: {
    price: number | string;
    percentage: string;
  };
  className?: string;
  currencyCode: string;
  textSize?: "small" | "base" | "large" | "xlarge";
  textWeight?: "regular" | "plus";
};

export const Price = ({
  price,
  type = "default",
  originalPrice,
  className,
  currencyCode,
  textSize = "base",
  textWeight = "regular",
}: PriceProps) => {
  const { formattedPrice, formattedSalePrice } = useMemo(() => {
    if (!currencyCode) {
      return {
        formattedPrice: price,
        formattedSalePrice: originalPrice?.price,
      };
    }
    return {
      formattedPrice:
        typeof price === "string"
          ? price
          : formatPrice({ amount: price, currency_code: currencyCode }),
      formattedSalePrice:
        typeof originalPrice?.price === "string"
          ? originalPrice?.price
          : formatPrice({
              amount: originalPrice?.price || 0,
              currency_code: currencyCode,
            }),
    };
  }, [price, originalPrice, currencyCode]);
  return (
    <div className={clsx("flex flex-col text-primary-text", className)}>
      {originalPrice && (
        <p>
          <span className="line-through text-secondary-text">
            {formattedSalePrice}
          </span>
        </p>
      )}
      <span
        className={clsx({
          "text-sm": textSize === "small" && textWeight === "regular",
          "text-sm font-medium": textSize === "small" && textWeight === "plus",
          "text-base font-medium":
            textSize === "base" && textWeight === "regular",
          "text-base font-medium-plus":
            textSize === "base" && textWeight === "plus",
          "text-large": textSize === "large" && textWeight === "regular",
          "text-large-plus font-bold":
            textSize === "large" && textWeight === "plus",
          "text-xlarge": textSize === "xlarge" && textWeight === "regular",
          "text-xlarge font-bold":
            textSize === "xlarge" && textWeight === "plus",
          "text-accent-text": originalPrice,
        })}
      >
        {type === "range" && "From "}
        <span>
          {type === "discount" && price !== 0 && "- "}
          {formattedPrice}
        </span>
      </span>
    </div>
  );
};
