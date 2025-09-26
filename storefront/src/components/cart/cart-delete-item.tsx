import { HttpTypes } from "@medusajs/types"
import { useDeleteLineItem } from "@/lib/hooks/dynamic/use-cart"
import { clx } from "@medusajs/ui"
import { Trash } from "@medusajs/icons"
import { Button } from "@/components/common/button"

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