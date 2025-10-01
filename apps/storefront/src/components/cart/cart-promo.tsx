import { HttpTypes } from "@medusajs/types"
import { toast } from "@medusajs/ui"
import { Button } from "@/components/common/button"
import { useState } from "react"
import { useApplyPromoCode, useRemovePromoCode } from "@/lib/hooks/dynamic/use-cart"
import { XMark } from "@medusajs/icons"
import { Input } from "@/components/common/input"

/**
 * AI AGENT USAGE GUIDE:
 * 
 * WHEN TO USE:
 * - Use for promotional code management in the storefront
 * - Cart pages: apply and manage promotional codes
 * - Checkout pages: promotional code application
 * - Mobile commerce: mobile-optimized promo code handling
 * - Cart management: promotional code control
 * - User experience: easy promo code application
 * 
 * ECOMMERCE CONTEXT:
 * - Critical for promotional campaigns and marketing
 * - Essential for discount application and management
 * - Important for customer engagement and retention
 * - Required for promotional code validation
 * - Used in marketing campaigns and promotions
 * - Important for mobile commerce experience
 * 
 * PROMO CODE FEATURES:
 * - Promotional code application and validation
 * - Applied promo code display and management
 * - Promo code removal and cleanup
 * - Success/error feedback and notifications
 * - Responsive design for mobile/desktop
 * - Professional promo code presentation
 * 
 * PROMO CODE FUNCTIONALITY:
 * - Apply promotional codes to cart
 * - Display applied promo codes
 * - Remove applied promo codes
 * - Validate promo code eligibility
 * - Handle promo code errors gracefully
 * - Update cart totals with discounts
 * 
 * COMMON PATTERNS:
 * - Cart promo code application
 * - Mobile promo code handling
 * - Checkout promo code application
 * - Promotional campaign integration
 * - Discount code management
 * 
 * EXAMPLES:
 * - <CartPromo cart={cart} />
 * - Cart page promo code application
 * - Mobile promo code handling
 * - Checkout promo code application
 */

type CartPromoProps = {
  cart: HttpTypes.StoreCart
}

const CartPromo = ({ cart }: CartPromoProps) => {
  const [showInput, setShowInput] = useState(false)
  const [promoCode, setPromoCode] = useState("")
  const applyPromoCodeMutation = useApplyPromoCode()
  const removePromoCodeMutation = useRemovePromoCode()

  const handleRemove = (code: string) => {
    removePromoCodeMutation.mutate({ code }, {
      onSuccess: () => {
        toast.success("Promo code removed successfully")
      },
      onError: () => {
        toast.error("Failed to remove promo code")
      },
    })
  }
  
  const handleApply = () => {
    applyPromoCodeMutation.mutate({ code: promoCode }, {
      onSuccess: () => {
        toast.success("Promo code applied successfully")
        setShowInput(false)
        setPromoCode("")
      },
      onError: () => {
        toast.error("Failed to apply promo code")
      },
    })
  }

  return (
    <div className="flex flex-wrap gap-2">
      {cart.promotions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {cart.promotions.map((promotion) => (
            <Button key={promotion.code} variant="secondary" size="fit">
              {promotion.code}
              <XMark 
                onClick={() => handleRemove(promotion.code || "")} 
                className="ml-2 text-secondary-text hover:text-secondary-text-hover cursor-pointer"
              />
            </Button>
          ))}
        </div>
      )}
      {!showInput && (
        <Button 
          onClick={() => setShowInput(true)} 
          variant="transparent" 
          className="text-secondary-text p-0 underline hover:bg-transparent hover:text-secondary-text-hover"
          size="fit"
        >
          Add promo code
        </Button>
      )}

      {showInput && (
        <div className="flex gap-2">
          <Input
            placeholder="Enter promo code"
            name="promoCode"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />
          <Button onClick={handleApply} variant="primary" size="fit">
            Apply
          </Button>
          <Button
            onClick={() => setShowInput(false)}
            variant="secondary"
            size="fit"
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  )
}

export default CartPromo