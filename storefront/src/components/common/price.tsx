import { clx } from "@medusajs/ui";
import { useMemo } from "react";
import { convertToLocale } from "@/lib/utils/money";

type PriceProps = {
  price: number | string;
  type?: "default" | "range" | "discount"
  sale?: {
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
  sale, 
  className,
  currencyCode,
  textClassName
}: PriceProps) => {
  const { formattedPrice, formattedSalePrice } = useMemo(() => {
    if (!currencyCode) {
      return {
        formattedPrice: price,
        formattedSalePrice: sale?.price,
      }
    }
    return {
      formattedPrice: typeof price === "string" ? price : convertToLocale(
        { amount: price, currency_code: currencyCode }
      ),
      formattedSalePrice: typeof sale?.price === "string" ? sale?.price : convertToLocale(
        { amount: sale?.price || 0, currency_code: currencyCode }
      ),
    }
  }, [price, sale, currencyCode])
  return (
    <div className={clx("flex flex-col text-ui-fg-base", className)}>
      <span
        className={clx(textClassName || "txt-xlarge-semi", {
          "text-ui-fg-interactive": sale,
        })}
      >
        {type === "range" && "From "}
        <span>
          {type === "discount" && "-"}{formattedPrice}
        </span>
      </span>
      {sale && (
        <>
          <p>
            <span className="text-ui-fg-subtle">Original: </span>
            <span className="line-through">
              {formattedSalePrice}
            </span>
          </p>
          <span className="text-ui-fg-interactive">
            -{sale.percentage}%
          </span>
        </>
      )}
    </div>
  )
};