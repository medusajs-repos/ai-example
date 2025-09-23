import { getPercentageDiff } from "@/lib/utils/get-precentage-diff";
import { HttpTypes } from "@medusajs/types";
import { Price } from "@/components/common/price";

type LineItemPriceProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem;
  currencyCode: string;
  className?: string;
};

const LineItemPrice = ({
  item,
  currencyCode,
  className,
}: LineItemPriceProps) => {
  const { total, original_total } = item;
  const originalPrice = original_total;
  const currentPrice = total;
  const hasReducedPrice = currentPrice < originalPrice;

  return (
    <Price
      price={currentPrice}
      currencyCode={currencyCode}
      originalPrice={hasReducedPrice ? {
        price: originalPrice,
        percentage: getPercentageDiff(originalPrice, currentPrice || 0),
      } : undefined}
      className={className}
    />
  )
};

export default LineItemPrice;
