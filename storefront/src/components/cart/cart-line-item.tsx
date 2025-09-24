import { HttpTypes } from "@medusajs/types"
import LineItemPrice from "@/components/cart/line-item-price"
import { clx, Text } from "@medusajs/ui"
import { Price } from "@/components/common/price"
import { Thumbnail } from "@/components/common/thumbnail"
import CartItemQuantitySelector from "@/components/cart/cart-item-quantity-selector"
import CartDeleteItem from "@/components/cart/cart-delete-item"

interface CartLineItemProps {
  item: HttpTypes.StoreCartLineItem;
  cart: HttpTypes.StoreCart;
  type?: "default" | "compact" | "display"
  fields?: string
}

const CartLineItem = ({ item, cart, type = "default", fields }: CartLineItemProps) => {
  if (type === "compact") {
    return <CompactCartLineItem item={item} cart={cart} fields={fields} />
  }

  if (type === "display") {
    return <DisplayCartLineItem item={item} cart={cart} />
  }

  return (
    <div className="flex items-center gap-6 py-4">
      <div className="flex-shrink-0">
        <Thumbnail thumbnail={item.thumbnail} alt={item.product_title || item.title} />
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-y-1">
        <span className={clx(
          "text-primary-text",
          "txt-medium-plus",
        )}>{item.product_title}</span>
        {item.variant_title && item.variant_title !== "Default Variant" && (
          <span className={clx(
            "text-secondary-text txt-small",
          )}>{item.variant_title}</span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <CartItemQuantitySelector 
          item={item}
          type={type}
          fields={fields}
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
          fields={fields}
        />
      </div>
    </div>
  )
}

const CompactCartLineItem = ({ item, cart, fields }: CartLineItemProps) => {
  return (
    <div className="flex items-start gap-x-4" data-testid="cart-item">
      <Thumbnail thumbnail={item.thumbnail} alt={item.product_title || item.title} />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="txt-medium line-clamp-1 text-primary-text">
              {item.product_title}
            </h4>
            <div className="txt-small text-secondary-text">
              {item.variant_title &&
                item.variant_title !== "Default Variant" && (
                  <span>{item.variant_title}</span>
                )}
            </div>
          </div>
          <CartDeleteItem
            item={item}
            type="compact"
            fields={fields}
          />
        </div>

        <div className="flex items-center justify-between mt-2">
          <CartItemQuantitySelector
            item={item}
            type="compact"
            fields={fields}
          />
          <Price
            price={item.total}
            currencyCode={cart.currency_code}
            textSize="small"
          />
        </div>
      </div>
    </div>
  )
}

const DisplayCartLineItem = ({ item, cart }: CartLineItemProps) => {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-secondary-border last:border-b-0">
      <Thumbnail thumbnail={item.thumbnail} alt={item.product_title || item.title} className="w-16 h-16" />
      <div className="flex-1">
        <Text className="txt-medium-plus text-primary-text">{item.product_title}</Text>
        {item.variant_title && item.variant_title !== "Default Variant" && (
          <Text className="txt-small text-secondary-text">
            {item.variant_title}
          </Text>
        )}
        <Text className="txt-small text-secondary-text">
          Quantity: {item.quantity}
        </Text>
      </div>
      <div className="text-right">
        <Price
          price={item.total}
          currencyCode={cart.currency_code}
          textWeight="plus"
        />
      </div>
    </div>
  )
}

export default CartLineItem
