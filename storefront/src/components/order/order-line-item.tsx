import { HttpTypes } from "@medusajs/types"
import { Thumbnail } from "@/components/common/thumbnail"
import { Text } from "@medusajs/ui"
import { Price } from "@/components/common/price"

type OrderLineItemProps = {
  item: HttpTypes.StoreOrderLineItem;
  order: HttpTypes.StoreOrder;
}

const OrderLineItem = ({ item, order }: OrderLineItemProps) => {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-primary-border last:border-b-0">
      <Thumbnail thumbnail={item.thumbnail} alt={item.product_title || item.title} className="w-16 h-16" />
      <div className="flex-1">
        <Text className="txt-medium-plus text-primary-text">{item.product_title}</Text>
        {item.variant_title && item.variant_title !== "Default Variant" && (
          <Text className="txt-small text-secondary-text">
            {item.variant_title}
          </Text>
        )}
        <Text className="txt-small text-secondary-text">
          Quantity: {item.quantity}
        </Text>
      </div>
      <div className="text-right">
        <Price
          price={item.total}
          currencyCode={order.currency_code}
          textWeight="plus"
          className="text-secondary-text"
        />
      </div>
    </div>
  )
}

export default OrderLineItem