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
      sale={hasReducedPrice ? {
        price: originalPrice,
        percentage: getPercentageDiff(originalPrice, currentPrice || 0),
      } : undefined}
      className={className}
    />
  )

  // return (
  //   <div className="flex flex-col gap-x-2 text-ui-fg-muted items-end">
  //     <div className="text-left">
  //       {hasReducedPrice && (
  //         <>
  //           <p>
  //             {style === "default" && (
  //               <span className="text-ui-fg-muted">Original: </span>
  //             )}
  //             <span
  //               className="line-through text-ui-fg-muted"
  //               data-testid="product-original-price"
  //             >
  //               {convertToLocale({
  //                 amount: originalPrice,
  //                 currency_code: currencyCode,
  //               })}
  //             </span>
  //           </p>
  //           {style === "default" && (
  //             <span className="text-ui-fg-interactive">
  //               -{getPercentageDiff(originalPrice, currentPrice || 0)}%
  //             </span>
  //           )}
  //         </>
  //       )}
  //       <span
  //         className={clx("txt-small font-medium", {
  //           "text-ui-fg-interactive": hasReducedPrice,
  //           "text-ui-fg-base": !hasReducedPrice,
  //         })}
  //         data-testid="product-price"
  //       >
  //         {convertToLocale({
  //           amount: currentPrice || 0,
  //           currency_code: currencyCode,
  //         })}
  //       </span>
  //     </div>
  //   </div>
  // );
};

export default LineItemPrice;
