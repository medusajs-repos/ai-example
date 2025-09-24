import { HttpTypes } from "@medusajs/types"
import { Price } from "@/components/common/price"
import { Heading } from "@medusajs/ui"

type OrderSummaryProps = {
  order: HttpTypes.StoreOrder;
}

const OrderSummary = ({ order }: OrderSummaryProps) => {
  return (
    <div className="space-y-4">
      <Heading level="h3" className="mb-4">
        Summary
      </Heading>
      <div className="space-y-2">
        <div className="flex justify-between txt-small">
          <span className="text-secondary-text">Subtotal</span>
          <Price
            price={order.subtotal}
            currencyCode={order.currency_code}
          />
        </div>
        
        <div className="flex justify-between txt-small">
          <span className="text-secondary-text">Shipping</span>
          <Price
            price={order.shipping_total}
            currencyCode={order.currency_code}
          />
        </div>

        <div className="flex justify-between txt-small">
          <span className="text-secondary-text">Discount</span>
          <Price
            price={order.discount_total}
            currencyCode={order.currency_code}
            type="discount"
          />
        </div>
        
        <div className="flex justify-between txt-small">
          <span className="text-secondary-text">Tax</span>
          <Price
            price={order.tax_total}
            currencyCode={order.currency_code}
          />
        </div>
      </div>
      
      <hr className="bg-primary-border" />
      
      <div className="flex justify-between">
        <span className="text-primary-text">Total</span>
        <Price
          price={order.total}
          currencyCode={order.currency_code}
        />
      </div>
    </div>
  )
}

export default OrderSummary