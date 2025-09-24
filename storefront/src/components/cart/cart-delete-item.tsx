import { HttpTypes } from "@medusajs/types"
import { useDeleteLineItem } from "@/lib/hooks/dynamic/use-cart"
import { clx, IconButton } from "@medusajs/ui"
import { Trash } from "@medusajs/icons"

type CartDeleteItemProps = {
  item: HttpTypes.StoreCartLineItem;
  type?: "default" | "compact"
  fields?: string
}

const CartDeleteItem = ({ item, type = "default", fields }: CartDeleteItemProps) => {
  const deleteLineItemMutation = useDeleteLineItem({
    fields
  })
  return (
    <IconButton
      onClick={() => deleteLineItemMutation.mutate({ line_id: item.id })}
      disabled={deleteLineItemMutation.isPending}
      className={clx(
        type === "compact" && "text-secondary-text hover:text-secondary-text-hover transition-colors ml-2"
      )}
      variant={type === "compact" ? "transparent" : "primary"}
    >
      <Trash />
    </IconButton>
  )
}

export default CartDeleteItem