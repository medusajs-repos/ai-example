import { HttpTypes } from "@medusajs/types";
import { useDeleteLineItem, useUpdateLineItem } from "@/lib/hooks/dynamic/use-cart";
import { Minus, Plus } from "@medusajs/icons";
import { clx, IconButton } from "@medusajs/ui";

type CartItemQuantitySelectorProps = {
  item: HttpTypes.StoreCartLineItem;
  type?: "default" | "compact"
  fields?: string
}

const CartItemQuantitySelector = ({ item, type = "default", fields }: CartItemQuantitySelectorProps) => {
  const updateLineItemMutation = useUpdateLineItem({
    fields
  });
  const deleteLineItemMutation = useDeleteLineItem({
    fields
  });
  
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity === 0) {
      deleteLineItemMutation.mutate({ line_id: item.id });
    } else {
      updateLineItemMutation.mutate({
        line_id: item.id,
        quantity: newQuantity,
      });
    }
  };

  return (
    <div className="flex items-center">
      <IconButton
        onClick={() => handleQuantityChange(item.quantity - 1)}
        className={clx(
          type === "compact" && "text-ui-fg-subtle hover:text-ui-fg-base transition-colors p-1 ml-2"
        )}
        variant={type === "compact" ? "transparent" : "primary"}
      >
        <Minus />
      </IconButton>
      <span className={clx(
        type === "compact" ? "txt-small text-ui-fg-base text-center px-3" : "text-center txt-small px-6"
      )}>
        {item.quantity}
      </span>
      <IconButton
        onClick={() => handleQuantityChange(item.quantity + 1)}
        className={clx(
          type === "compact" && "text-ui-fg-subtle hover:text-ui-fg-base transition-colors p-1 ml-2"
        )}
        variant={type === "compact" ? "transparent" : "primary"}
      >
        <Plus />
      </IconButton>
    </div>
  )
}

export default CartItemQuantitySelector