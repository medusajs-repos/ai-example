import { useDeleteLineItem, useUpdateLineItem } from "@/lib/hooks/dynamic/use-cart";
import { HttpTypes } from "@medusajs/types";
import LineItemPrice from "@/components/cart/line-item-price";
import { IconButton } from "@medusajs/ui";
import { Minus, Plus, Trash } from "@medusajs/icons";
import { Thumbnail } from "@/components/common/thumbnail";

interface CartItemProps {
  item: HttpTypes.StoreCartLineItem;
  cart: HttpTypes.StoreCart;
}

const CartItem = ({ item, cart }: CartItemProps) => {
  const updateLineItemMutation = useUpdateLineItem();
  const deleteLineItemMutation = useDeleteLineItem();

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
    <div className="flex items-center gap-6 py-4">
      <div className="flex-shrink-0">
        <Thumbnail thumbnail={item.thumbnail} alt={item.title} />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="txt-medium-plus text-ui-fg-base">{item.title}</h3>
        {item.variant?.title && item.variant.title !== "Default Variant" && (
          <p className="txt-small text-ui-fg-muted mt-1">{item.variant.title}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center">
          <IconButton
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={updateLineItemMutation.isPending || deleteLineItemMutation.isPending}
          >
            <Minus />
          </IconButton>
          <span className="w-12 text-center txt-small">
            {item.quantity}
          </span>
          <IconButton
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={updateLineItemMutation.isPending}
          >
            <Plus />
          </IconButton>
        </div>

        <div className="text-right">
          <LineItemPrice
            item={item}
            currencyCode={cart.currency_code}
          />
        </div>

        <IconButton
          onClick={() => deleteLineItemMutation.mutate({ line_id: item.id })}
          disabled={deleteLineItemMutation.isPending}
        >
          <Trash />
        </IconButton>
      </div>
    </div>
  );
};

export default CartItem;
