import { HttpTypes } from "@medusajs/types";
import { Heading, Text } from "@medusajs/ui";

type OrderInfoProps = {
  order: HttpTypes.StoreOrder;
}

const OrderInfo = ({ order }: OrderInfoProps) => {
  return (
    <div className="flex flex-col gap-4">
      <Heading level="h3">Order Details</Heading>
      <div className="flex gap-2 items-center justify-between">
        <Text className="txt-medium-plus text-ui-fg-base">Order ID</Text>
        <Text className="txt-small text-ui-fg-subtle">{order.display_id || order.id}</Text>
      </div>
      <div className="flex gap-2 items-center justify-between">
        <Text className="txt-medium-plus text-ui-fg-base">Order Date</Text>
        <Text className="txt-small text-ui-fg-subtle">{new Date(order.created_at!).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}</Text>
      </div>
      <div className="flex gap-2 items-center justify-between">
        <Text className="txt-medium-plus text-ui-fg-base">Order Status</Text>
        <Text className="txt-small text-ui-fg-subtle">{order.status}</Text>
      </div>
      <div className="flex gap-2 items-center justify-between">
        <Text className="txt-medium-plus text-ui-fg-base">Order Email</Text>
        <Text className="txt-small text-ui-fg-subtle">{order.customer?.email || order.email}</Text>
      </div>
    </div>
  )
};

export default OrderInfo;