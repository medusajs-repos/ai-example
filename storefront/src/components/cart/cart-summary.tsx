import { HttpTypes } from "@medusajs/types"
import { Price } from "@/components/common/price"

interface CartSummaryProps {
  cart: HttpTypes.StoreCart
}

const CartSummary = ({ cart }: CartSummaryProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between txt-small">
          <span className="text-ui-fg-muted">Subtotal</span>
          <Price
            price={cart.subtotal}
            currencyCode={cart.currency_code}
          />
        </div>
        
        <div className="flex justify-between txt-small">
          <span className="text-ui-fg-muted">Shipping</span>
          <Price
            price={cart.shipping_total}
            currencyCode={cart.currency_code}
          />
        </div>

        <div className="flex justify-between txt-small">
          <span className="text-ui-fg-muted">Discount</span>
          <Price
            price={cart.discount_total}
            currencyCode={cart.currency_code}
            type="discount"
          />
        </div>
        
        <div className="flex justify-between txt-small">
          <span className="text-ui-fg-muted">Tax</span>
          <Price
            price={cart.tax_total}
            currencyCode={cart.currency_code}
          />
        </div>
      </div>
      
      <hr className="border-ui-border-base" />
      
      <div className="flex justify-between">
        <span className="text-ui-fg-base">Total</span>
        <Price
          price={cart.total}
          currencyCode={cart.currency_code}
        />
      </div>
    </div>
  )
}

export default CartSummary