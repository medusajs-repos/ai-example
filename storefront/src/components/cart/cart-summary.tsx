import { HttpTypes } from "@medusajs/types"
import { Link } from "@tanstack/react-router"
import { Price } from "@/components/common/price"
import { Button } from "@medusajs/ui"

interface CartSummaryProps {
  cart: HttpTypes.StoreCart
  countryCode: string
}

const CartSummary = ({ cart, countryCode }: CartSummaryProps) => {
  return (
    <div className="max-w-sm ml-auto">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between txt-small">
            <span className="text-ui-fg-muted">Subtotal</span>
            <Price
              price={cart.subtotal}
              currencyCode={cart.currency_code}
            />
          </div>
          
          {(cart.shipping_total || 0) > 0 && (
            <div className="flex justify-between txt-small">
              <span className="text-ui-fg-muted">Shipping</span>
              <Price
                price={cart.shipping_total}
                currencyCode={cart.currency_code}
              />
            </div>
          )}
          
          {(cart.tax_total || 0) > 0 && (
            <div className="flex justify-between txt-small">
              <span className="text-ui-fg-muted">Tax</span>
              <Price
                price={cart.tax_total}
                currencyCode={cart.currency_code}
              />
            </div>
          )}
        </div>
        
        <hr className="border-ui-border-base" />
        
        <div className="flex justify-between">
          <span className="text-ui-fg-base">Total</span>
          <Price
            price={cart.total}
            currencyCode={cart.currency_code}
          />
        </div>

        <Button asChild className="w-full">
          <Link to={`/${countryCode}/checkout` as any}>
            Checkout
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default CartSummary