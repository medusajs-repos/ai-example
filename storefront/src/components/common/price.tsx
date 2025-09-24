import { clx } from "@medusajs/ui"
import { useMemo } from "react"
import { convertToLocale } from "@/lib/utils/money"

export type PriceProps = {
  price: number | string;
  type?: "default" | "range" | "discount"
  originalPrice?: {
    price: number | string;
    percentage: string;
  }
  className?: string
  currencyCode: string;
  textSize?: "small" | "base" | "large" | "xlarge"
  textWeight?: "regular" | "plus"
};

export const Price = ({ 
  price, 
  type = "default", 
  originalPrice, 
  className,
  currencyCode,
  textSize = "base",
  textWeight = "regular"
}: PriceProps) => {
  const { formattedPrice, formattedSalePrice } = useMemo(() => {
    if (!currencyCode) {
      return {
        formattedPrice: price,
        formattedSalePrice: originalPrice?.price,
      }
    }
    return {
      formattedPrice: typeof price === "string" ? price : convertToLocale(
        { amount: price, currency_code: currencyCode }
      ),
      formattedSalePrice: typeof originalPrice?.price === "string" ? originalPrice?.price : convertToLocale(
        { amount: originalPrice?.price || 0, currency_code: currencyCode }
      ),
    }
  }, [price, originalPrice, currencyCode])
  return (
    <div className={clx("flex flex-col text-primary-text", className)}>
      {originalPrice && (
        <p>
          <span className="line-through text-secondary-text">
            {formattedSalePrice}
          </span>
        </p>
      )}
      <span
        className={clx({
          "txt-small": textSize === "small" && textWeight === "regular",
          "txt-small-plus": textSize === "small" && textWeight === "plus",
          "txt-medium": textSize === "base" && textWeight === "regular",
          "txt-medium-plus": textSize === "base" && textWeight === "plus",
          "txt-large": textSize === "large" && textWeight === "regular",
          "txt-large-plus": textSize === "large" && textWeight === "plus",
          "txt-xlarge": textSize === "xlarge" && textWeight === "regular",
          "txt-xlarge-plus": textSize === "xlarge" && textWeight === "plus",
          "text-accent-text": originalPrice,
        })}
      >
        {type === "range" && "From "}
        <span>
          {type === "discount" && price !== 0 && "- "}{formattedPrice}
        </span>
      </span>
    </div>
  )
}