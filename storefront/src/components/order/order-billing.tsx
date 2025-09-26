import { HttpTypes } from "@medusajs/types"
import Address from "@/components/common/address"
import PaymentMethodInfo from "@/components/common/payment-method-info"
import { isPaidWithGiftCard } from "@/lib/utils/checkout/is-paid-with-gift-card"

type OrderBillingProps = {
  order: HttpTypes.StoreOrder;
}

const OrderBilling = ({ order }: OrderBillingProps) => {
  const paidByGiftcard = isPaidWithGiftCard(order)

  return (
    <div>
      <h3 className="mb-4">
        Billing Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <span className="txt-medium-plus text-primary-text mb-2">Billing Address</span>
          <div className="txt-small text-secondary-text">
            {order.billing_address ? (
              <Address address={order.billing_address} />
            ) : (
              <span>Same as shipping address</span>
            )}
          </div>
        </div>
        <div>
          <span className="txt-medium-plus text-primary-text mb-2">Payment Method</span>
          <div className="txt-small text-secondary-text">
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

export default OrderBilling