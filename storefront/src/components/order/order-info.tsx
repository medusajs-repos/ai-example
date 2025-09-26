import { HttpTypes } from "@medusajs/types"
import { formatOrderId } from "@/lib/utils/order/format-order-id"

type OrderInfoProps = {
  order: HttpTypes.StoreOrder;
}

const OrderInfo = ({ order }: OrderInfoProps) => {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-medium-plus">Order Details</h3>
      <div className="flex gap-2 items-center">
        <span className="txt-medium-plus text-primary-text">Order ID:</span>
        <span className="txt-small text-secondary-text">{formatOrderId(`${order.display_id || order.id}`)}</span>
      </div>
      <div className="flex gap-2 items-center">
        <span className="txt-medium-plus text-primary-text">Order Date:</span>
        <span className="txt-small text-secondary-text">{new Date(order.created_at!).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}</span>
      </div>
      <div className="flex gap-2 items-center">
        <span className="txt-medium-plus text-primary-text">Order Status:</span>
        <span className="txt-small text-secondary-text">{order.status}</span>
      </div>
      <div className="flex gap-2 items-center">
        <span className="txt-medium-plus text-primary-text">Order Email:</span>
        <span className="txt-small text-secondary-text">{order.customer?.email || order.email}</span>
      </div>
    </div>
  )
}

export default OrderInfo