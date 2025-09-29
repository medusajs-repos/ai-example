import { HttpTypes } from "@medusajs/types"
import { useDeleteLineItem } from "@/lib/hooks/dynamic/use-cart"
import { clx } from "@medusajs/ui"
import { Trash } from "@medusajs/icons"
import { Button } from "@/components/common/button"

/**
 * AI AGENT USAGE GUIDE:
 * 
 * WHEN TO USE:
 * - Use for deleting cart items in the storefront
 * - Cart pages: remove items from shopping cart
 * - Cart dropdowns: quick item removal
 * - Mobile commerce: mobile-optimized item deletion
 * - Cart management: item removal and cleanup
 * - User experience: easy item removal
 * 
 * ECOMMERCE CONTEXT:
 * - Critical for cart management and user experience
 * - Essential for cart item removal and cleanup
 * - Important for user control and flexibility
 * - Required for cart state management
 * - Used in cart abandonment prevention
 * - Important for mobile commerce experience
 * 
 * DELETE FEATURES:
 * - Cart item deletion and removal
 * - Visual delete button with trash icon
 * - Loading states during deletion
 * - Error handling and feedback
 * - Responsive design for mobile/desktop
 * - Professional delete presentation
 * 
 * DELETE FUNCTIONALITY:
 * - Remove item from cart
 * - Update cart totals and counts
 * - Handle deletion errors gracefully
 * - Provide user feedback
 * - Maintain cart state consistency
 * 
 * COMMON PATTERNS:
 * - Cart item deletion
 * - Mobile cart deletion
 * - Cart dropdown deletion
 * - Cart management deletion
 * - Item removal functionality
 * 
 * EXAMPLES:
 * - <CartDeleteItem item={cartItem} />
 * - Cart page item deletion
 * - Mobile cart deletion
 * - Cart dropdown deletion
 */

type CartDeleteItemProps = {
  item: HttpTypes.StoreCartLineItem;
  fields?: string
}

const CartDeleteItem = ({ item, fields }: CartDeleteItemProps) => {
  const deleteLineItemMutation = useDeleteLineItem({
    fields
  })
  return (
    <Button
      onClick={() => deleteLineItemMutation.mutate({ line_id: item.id })}
      disabled={deleteLineItemMutation.isPending}
      className={clx(
        "text-secondary-text hover:text-secondary-text-hover transition-colors ml-2",
      )}
      variant="transparent"
      size="fit"
    >
      <Trash />
    </Button>
  )
}

export default CartDeleteItem