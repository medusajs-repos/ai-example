import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import Address from "@/components/common/address"
import { Price } from "@/components/common/price"

type OrderShippingProps = {
  order: HttpTypes.StoreOrder;
}

const OrderShipping = ({ order }: OrderShippingProps) => {
  return (
    <div>
      <Heading level="h3" className="mb-4">
        Delivery Information
      </Heading>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Text className="txt-medium-plus text-ui-fg-base mb-2">Shipping Address</Text>
          {order.shipping_address && <Address address={order.shipping_address} />}
        </div>
        
        {order.shipping_methods?.[0] && (
          <div>
            <Text className="txt-medium-plus text-ui-fg-base mb-2">Shipping Method</Text>
            <div className="txt-small text-ui-fg-subtle flex items-center justify-between">
              <div>{order.shipping_methods[0].name}</div>
              <Price
                price={order.shipping_methods[0].amount}
                currencyCode={order.currency_code}
                textClassName="txt-medium-plus text-ui-fg-subtle"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderShipping