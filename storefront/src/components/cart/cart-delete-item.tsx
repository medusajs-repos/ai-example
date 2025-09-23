import { HttpTypes } from "@medusajs/types";
import { useDeleteLineItem } from "../../lib/hooks/dynamic/use-cart";
import { clx, IconButton } from "@medusajs/ui";
import { Trash } from "@medusajs/icons";

type CartDeleteItemProps = {
  item: HttpTypes.StoreCartLineItem;
  type?: "default" | "compact"
}

const CartDeleteItem = ({ item, type = "default" }: CartDeleteItemProps) => {
  const deleteLineItemMutation = useDeleteLineItem();
  return (
    <IconButton
      onClick={() => deleteLineItemMutation.mutate({ line_id: item.id })}
      disabled={deleteLineItemMutation.isPending}
      className={clx(
        type === "compact" && "text-ui-fg-subtle hover:text-ui-fg-base transition-colors ml-2"
      )}
      variant={type === "compact" ? "transparent" : "primary"}
    >
      <Trash />
    </IconButton>
  )
}

export default CartDeleteItem