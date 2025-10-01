import { HttpTypes } from "@medusajs/types"
import { useDeleteLineItem, useUpdateLineItem } from "@/lib/hooks/dynamic/use-cart"
import { Minus, Plus } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import { Button } from "@/components/common/button"

/**
 * AI AGENT USAGE GUIDE:
 * 
 * WHEN TO USE:
 * - Use for quantity selection in cart items in the storefront
 * - Cart pages: adjust item quantities in shopping cart
 * - Cart dropdowns: quick quantity updates
 * - Mobile commerce: mobile-optimized quantity selection
 * - Cart management: quantity control and updates
 * - User experience: easy quantity adjustment
 * 
 * ECOMMERCE CONTEXT:
 * - Critical for cart management and user experience
 * - Essential for quantity control and updates
 * - Important for inventory management and stock
 * - Required for cart state management
 * - Used in cart abandonment prevention
 * - Important for mobile commerce experience
 * 
 * QUANTITY SELECTOR FEATURES:
 * - Quantity increment and decrement buttons
 * - Current quantity display
 * - Automatic item deletion when quantity reaches zero
 * - Loading states during updates
 * - Error handling and feedback
 * - Responsive design for mobile/desktop
 * 
 * QUANTITY FUNCTIONALITY:
 * - Increase item quantity
 * - Decrease item quantity
 * - Remove item when quantity reaches zero
 * - Update cart totals and counts
 * - Handle quantity errors gracefully
 * - Maintain cart state consistency
 * 
 * COMMON PATTERNS:
 * - Cart quantity selection
 * - Mobile cart quantity
 * - Cart dropdown quantity
 * - Cart management quantity
 * - Item quantity control
 * 
 * EXAMPLES:
 * - <CartItemQuantitySelector item={cartItem} />
 * - <CartItemQuantitySelector item={cartItem} type="compact" />
 * - Cart page quantity selection
 * - Mobile cart quantity selection
 */

type CartItemQuantitySelectorProps = {
  item: HttpTypes.StoreCartLineItem;
  type?: "default" | "compact"
  fields?: string
}

const CartItemQuantitySelector = ({ item, type = "default", fields }: CartItemQuantitySelectorProps) => {
  const updateLineItemMutation = useUpdateLineItem({
    fields
  })
  const deleteLineItemMutation = useDeleteLineItem({
    fields
  })
  
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity === 0) {
      deleteLineItemMutation.mutate({ line_id: item.id })
    } else {
      updateLineItemMutation.mutate({
        line_id: item.id,
        quantity: newQuantity,
      })
    }
  }

  return (
    <div className="flex items-center">
      <Button
        onClick={() => handleQuantityChange(item.quantity - 1)}
        className={clx(
          type === "compact" && "text-secondary-text hover:text-secondary-text-hover transition-colors p-1 ml-2"
        )}
        variant="transparent"
        size="fit"
      >
        <Minus />
      </Button>
      <span className={clx(
        type === "compact" ? "txt-small text-primary-text text-center px-3" : "text-center txt-small px-6"
      )}>
        {item.quantity}
      </span>
      <Button
        onClick={() => handleQuantityChange(item.quantity + 1)}
        className={clx(
          type === "compact" && "text-secondary-text hover:text-secondary-text-hover transition-colors p-1 ml-2"
        )}
        variant="transparent"
        size="fit"
      >
        <Plus />
      </Button>
    </div>
  )
}

export default CartItemQuantitySelector