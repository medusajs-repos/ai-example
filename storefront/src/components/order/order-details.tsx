import { HttpTypes } from "@medusajs/types";
import { Heading } from "@medusajs/ui";
import OrderLineItem from "./order-line-item";
import OrderShipping from "./order-shipping";
import OrderBilling from "./order-billing";
import OrderSummary from "./order-summary";
import OrderInfo from "./order-info";

interface OrderDetailsProps {
  order: HttpTypes.StoreOrder;
}

const OrderDetails = ({ order }: OrderDetailsProps) => {

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex flex-col gap-8">
        <OrderInfo order={order} />

        <hr className="border-ui-border-base" />
      
        <div className="flex flex-col gap-4">
          <Heading level="h3" className="mb-4">Items</Heading>
          {order.items?.map((item) => (
            <OrderLineItem key={item.id} item={item} order={order} />
          ))}
        </div>

        <hr className="border-ui-border-base" />

        <OrderShipping order={order} />

        <hr className="border-ui-border-base" />

        <OrderBilling order={order} />

        <hr className="border-ui-border-base" />

        <OrderSummary order={order} />
      </div>
    </div>
  );
};

export default OrderDetails;
