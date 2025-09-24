import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"

type OrderInfoProps = {
  order: HttpTypes.StoreOrder;
}

const OrderInfo = ({ order }: OrderInfoProps) => {
  return (
    <div className="flex flex-col gap-4">
      <Heading level="h3">Order Details</Heading>
      <div className="flex gap-2 items-center justify-between">
        <Text className="txt-medium-plus text-primary-text">Order ID</Text>
        <Text className="txt-small text-secondary-text">{order.display_id || order.id}</Text>
      </div>
      <div className="flex gap-2 items-center justify-between">
        <Text className="txt-medium-plus text-primary-text">Order Date</Text>
        <Text className="txt-small text-secondary-text">{new Date(order.created_at!).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}</Text>
      </div>
      <div className="flex gap-2 items-center justify-between">
        <Text className="txt-medium-plus text-primary-text">Order Status</Text>
        <Text className="txt-small text-secondary-text">{order.status}</Text>
      </div>
      <div className="flex gap-2 items-center justify-between">
        <Text className="txt-medium-plus text-primary-text">Order Email</Text>
        <Text className="txt-small text-secondary-text">{order.customer?.email || order.email}</Text>
      </div>
    </div>
  )
}

export default OrderInfo