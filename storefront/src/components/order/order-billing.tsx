import { HttpTypes } from "@medusajs/types";
import { Heading, Text } from "@medusajs/ui";
import Address from "../common/address";
import PaymentMethodInfo from "../common/payment-method-info";
import { isPaidWithGiftCard } from "@/lib/utils/checkout/is-paid-with-gift-card";

type OrderBillingProps = {
  order: HttpTypes.StoreOrder;
}

const OrderBilling = ({ order }: OrderBillingProps) => {
  const paidByGiftcard = isPaidWithGiftCard(order);

  return (
    <div>
      <Heading level="h3" className="mb-4">
        Billing Information
      </Heading>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Text className="txt-medium-plus text-ui-fg-base mb-2">Billing Address</Text>
          <div className="txt-small text-ui-fg-subtle">
            {order.billing_address ? (
              <Address address={order.billing_address} />
            ) : (
              <span>Same as shipping address</span>
            )}
          </div>
        </div>
        <div>
          <Text className="txt-medium-plus text-ui-fg-base mb-2">Payment Method</Text>
          <div className="txt-small text-ui-fg-subtle">
            {order.payment_collections?.[0].payment_sessions?.[0] && (
              <PaymentMethodInfo provider_id={order.payment_collections[0].payment_sessions[0].provider_id} />
            )}
            {paidByGiftcard && <span>Gift Card</span>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderBilling;