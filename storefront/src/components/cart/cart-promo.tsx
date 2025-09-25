import { HttpTypes } from "@medusajs/types"
import { Badge, Input, toast } from "@medusajs/ui"
import { Button } from "@/components/common/button"
import { useState } from "react"
import { useApplyPromoCode, useRemovePromoCode } from "@/lib/hooks/dynamic/use-cart"
import { XMark } from "@medusajs/icons"

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
            <Badge key={promotion.code} color="grey" size="small">
              {promotion.code}
              <XMark 
                onClick={() => handleRemove(promotion.code || "")} 
                className="ml-2 text-secondary-text hover:text-secondary-text-hover cursor-pointer"
              />
            </Badge>
          ))}
        </div>
      )}
      {!showInput && (
        <Button 
          onClick={() => setShowInput(true)} 
          variant="transparent" 
          className="text-secondary-text p-0 underline hover:bg-transparent hover:text-secondary-text-hover"
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
          <Button onClick={handleApply} variant="primary">
            Apply
          </Button>
          <Button
            onClick={() => setShowInput(false)}
            variant="secondary"
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  )
}

export default CartPromo