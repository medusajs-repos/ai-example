import { HttpTypes } from "@medusajs/types"
import { Heading } from "@medusajs/ui"
import OrderLineItem from "@/components/order/order-line-item"
import OrderShipping from "@/components/order/order-shipping"
import OrderBilling from "@/components/order/order-billing"
import OrderSummary from "@/components/order/order-summary"
import OrderInfo from "@/components/order/order-info"

interface OrderDetailsProps {
  order: HttpTypes.StoreOrder;
}

const OrderDetails = ({ order }: OrderDetailsProps) => {

  return (
    <div>
      <div className="flex flex-col gap-8">
        <OrderInfo order={order} />

        <hr className="bg-primary-border" />
      
        <div className="flex flex-col gap-4">
          <Heading level="h3" className="mb-4">Items</Heading>
          {order.items?.map((item) => (
            <OrderLineItem key={item.id} item={item} order={order} />
          ))}
        </div>

        <hr className="bg-primary-border" />

        <OrderShipping order={order} />

        <hr className="bg-primary-border" />

        <OrderBilling order={order} />

        <hr className="bg-primary-border" />

        <OrderSummary order={order} />
      </div>
    </div>
  )
}

export default OrderDetails
