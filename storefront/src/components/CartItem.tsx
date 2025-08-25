import { useDeleteLineItem, useUpdateLineItem } from "@lib/hooks/useCart";
import { HttpTypes } from "@medusajs/types";
import LineItemPrice from "./LineItemPrice";

interface CartItemProps {
  item: HttpTypes.StoreCartLineItem;
  region: HttpTypes.StoreRegion;
  cart: HttpTypes.StoreCart;
}

const CartItem = ({ item, cart }: CartItemProps) => {
  const updateLineItem = useUpdateLineItem();
  const deleteLineItem = useDeleteLineItem();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity === 0) {
      deleteLineItem.mutate(item.id);
    } else {
      updateLineItem.mutate({
        lineId: item.id,
        quantity: newQuantity,
      });
    }
  };

  const productImage =
    item.variant?.product?.thumbnail ||
    item.variant?.product?.images?.[0]?.url ||
    item.thumbnail;

  return (
    <div className="flex items-center gap-6 py-4">
      <div className="flex-shrink-0">
        {productImage ? (
          <img
            src={productImage}
            alt={item.title}
            className="w-20 h-20 object-cover rounded bg-ui-bg-subtle"
          />
        ) : (
          <div className="w-20 h-20 bg-ui-bg-subtle rounded flex items-center justify-center">
            <span className="text-xs text-ui-fg-muted">No image</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-ui-fg-base">{item.title}</h3>
        {item.variant?.title && item.variant.title !== "Default Variant" && (
          <p className="text-sm text-ui-fg-muted mt-1">{item.variant.title}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center border border-ui-border-base rounded">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={updateLineItem.isPending || deleteLineItem.isPending}
            className="w-8 h-8 flex items-center justify-center hover:bg-ui-bg-subtle disabled:opacity-50 transition-colors"
          >
            −
          </button>
          <span className="w-12 text-center text-sm font-medium">
            {item.quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={updateLineItem.isPending}
            className="w-8 h-8 flex items-center justify-center hover:bg-ui-bg-subtle disabled:opacity-50 transition-colors"
          >
            +
          </button>
        </div>

        <div className="text-right min-w-[80px]">
          <LineItemPrice
            item={item}
            currencyCode={cart.currency_code}
            style="tight"
          />
        </div>

        <button
          onClick={() => deleteLineItem.mutate(item.id)}
          disabled={deleteLineItem.isPending}
          className="text-ui-fg-muted hover:text-ui-fg-base text-sm underline disabled:opacity-50 transition-colors"
        >
          {deleteLineItem.isPending ? "Removing..." : "Remove"}
        </button>
      </div>
    </div>
  );
};

export default CartItem;
