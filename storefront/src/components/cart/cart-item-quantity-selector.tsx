import { HttpTypes } from "@medusajs/types"
import { useDeleteLineItem, useUpdateLineItem } from "@/lib/hooks/dynamic/use-cart"
import { Minus, Plus } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import { Button } from "@/components/common/button"

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