import { HttpTypes } from "@medusajs/types"
import { Price } from "@/components/common/price"
import Loading from "@/components/common/loading"

interface CartSummaryProps {
  cart: HttpTypes.StoreCart
}

const CartSummary = ({ cart }: CartSummaryProps) => {
  if ("isOptimistic" in cart && cart.isOptimistic) {
    return <Loading />
  }
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between txt-small">
          <span className="text-secondary-text">Subtotal</span>
          <Price
            price={cart.subtotal}
            currencyCode={cart.currency_code}
          />
        </div>
        
        <div className="flex justify-between txt-small">
          <span className="text-secondary-text">Shipping</span>
          <Price
            price={cart.shipping_total}
            currencyCode={cart.currency_code}
          />
        </div>

        <div className="flex justify-between txt-small">
          <span className="text-secondary-text">Discount</span>
          <Price
            price={cart.discount_total}
            currencyCode={cart.currency_code}
            type="discount"
          />
        </div>
        
        <div className="flex justify-between txt-small">
          <span className="text-secondary-text">Tax</span>
          <Price
            price={cart.tax_total}
            currencyCode={cart.currency_code}
          />
        </div>
      </div>
      
      <hr className="bg-primary-border" />
      
      <div className="flex justify-between">
        <span className="text-primary-text">Total</span>
        <Price
          price={cart.total}
          currencyCode={cart.currency_code}
        />
      </div>
    </div>
  )
}

export default CartSummary