import { clx } from "@medusajs/ui"
import { useMemo } from "react"
import { convertToLocale } from "@/lib/utils/money"

type PriceProps = {
  price: number | string;
  type?: "default" | "range" | "discount"
  originalPrice?: {
    price: number | string;
    percentage: string;
  }
  className?: string
  currencyCode: string;
  textClassName?: string;
};

export const Price = ({ 
  price, 
  type = "default", 
  originalPrice, 
  className,
  currencyCode,
  textClassName
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
    <div className={clx("flex flex-col text-ui-fg-base", className)}>
      {originalPrice && (
        <p>
          <span className="line-through">
            {formattedSalePrice}
          </span>
        </p>
      )}
      <span
        className={clx(textClassName || "txt-xlarge-semi", {
          "text-ui-fg-interactive": originalPrice,
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