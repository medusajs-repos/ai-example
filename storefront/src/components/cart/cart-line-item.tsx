import { HttpTypes } from "@medusajs/types";
import LineItemPrice from "@/components/cart/line-item-price";
import { clx, Text } from "@medusajs/ui";
import { Price } from "@/components/common/price";
import { Thumbnail } from "@/components/common/thumbnail";
import CartItemQuantitySelector from "./cart-item-quantity-selector";
import CartDeleteItem from "./cart-delete-item";

interface CartLineItemProps {
  item: HttpTypes.StoreCartLineItem;
  cart: HttpTypes.StoreCart;
  type?: "default" | "compact" | "display"
}

const CartLineItem = ({ item, cart, type = "default" }: CartLineItemProps) => {
  if (type === "compact") {
    return <CompactCartLineItem item={item} cart={cart} />;
  }

  if (type === "display") {
    return <DisplayCartLineItem item={item} cart={cart} />;
  }

  return (
    <div className="flex items-center gap-6 py-4">
      <div className="flex-shrink-0">
        <Thumbnail thumbnail={item.thumbnail} alt={item.title} />
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-y-1">
        <span className={clx(
          "text-ui-fg-base",
          "txt-medium-plus",
        )}>{item.title}</span>
        {item.variant?.title && item.variant.title !== "Default Variant" && (
          <span className={clx(
            "text-ui-fg-muted txt-small",
          )}>{item.variant.title}</span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <CartItemQuantitySelector 
          item={item}
          type={type}
        />

        <div className="text-right">
          <LineItemPrice
            item={item}
            currencyCode={cart.currency_code}
          />
        </div>

        <CartDeleteItem
          item={item}
          type={type}
        />
      </div>
    </div>
  );
};

const CompactCartLineItem = ({ item, cart }: CartLineItemProps) => {
  return (
    <div className="flex items-start gap-x-4" data-testid="cart-item">
      <Thumbnail thumbnail={item.thumbnail} alt={item.title} />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="txt-medium-semi line-clamp-1">
              {item.product?.title}
            </h4>
            <div className="txt-smallall-regular text-ui-fg-subtle">
              {item.variant?.title &&
                item.variant.title !== "Default Title" && (
                  <span>{item.variant.title}</span>
                )}
            </div>
          </div>
          <CartDeleteItem
            item={item}
            type="compact"
          />
        </div>

        <div className="flex items-center justify-between mt-2">
          <CartItemQuantitySelector
            item={item}
            type="compact"
          />
          <Price
            price={item.total}
            currencyCode={cart.currency_code}
            textClassName="txt-small"
          />
        </div>
      </div>
    </div>
  );
};

const DisplayCartLineItem = ({ item, cart }: CartLineItemProps) => {
  return (
    <div key={item.id} className="flex items-center gap-4 py-3 border-b border-ui-border-base last:border-b-0">
      <Thumbnail thumbnail={item.thumbnail} alt={item.title} className="w-16 h-16" />
      <div className="flex-1">
        <Text className="txt-medium-plus text-ui-fg-base">{item.title}</Text>
        {item.variant && item.variant.title !== "Default" && (
          <Text className="txt-small text-ui-fg-subtle">
            {item.variant.title}
          </Text>
        )}
        <Text className="txt-small text-ui-fg-subtle">
          Quantity: {item.quantity}
        </Text>
      </div>
      <div className="text-right">
        <Price
          price={item.total}
          currencyCode={cart.currency_code}
          textClassName="txt-medium-plus"
        />
      </div>
    </div>
  );
};

export default CartLineItem;
