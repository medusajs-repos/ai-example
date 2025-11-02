import CartDeleteItem from "@/components/cart/cart-delete-item";
import CartItemQuantitySelector from "@/components/cart/cart-item-quantity-selector";
import LineItemPrice from "@/components/cart/line-item-price";
import { Price } from "@/components/common/price";
import { Thumbnail } from "@/components/common/thumbnail";
import { HttpTypes } from "@medusajs/types";
import { clsx } from "clsx";

/**
 * AI AGENT USAGE GUIDE:
 *
 * WHEN TO USE:
 * - Use for displaying cart items in the storefront
 * - Cart pages: show full cart item details with controls
 * - Cart dropdowns: display compact cart item information
 * - Checkout pages: show cart items in checkout summary
 * - Mobile cart views: compact cart item display
 *
 * ECOMMERCE CONTEXT:
 * - Essential for cart management and user experience
 * - Critical for checkout flow and order processing
 * - Important for inventory tracking and quantity management
 * - Required for price calculation and totals
 * - Important for cart abandonment recovery
 *
 * DISPLAY TYPES:
 * - "default": Full cart item with image, title, variant, quantity controls, price, delete
 * - "compact": Condensed view for dropdowns and mobile
 * - "display": Read-only view for order confirmations and history
 *
 * KEY FEATURES:
 * - Product thumbnail display
 * - Product title and variant information
 * - Quantity selector with increment/decrement
 * - Price display with currency formatting
 * - Delete/remove item functionality
 * - Responsive design for different screen sizes
 *
 * COMMON PATTERNS:
 * - Shopping cart page items
 * - Cart dropdown items
 * - Checkout summary items
 *
 * EXAMPLES:
 * - <CartLineItem item={item} cart={cart} />
 * - <CartLineItem item={item} cart={cart} type="compact" />
 * - <CartLineItem item={item} cart={cart} type="display" />
 */

interface CartLineItemProps {
  item: HttpTypes.StoreCartLineItem;
  cart: HttpTypes.StoreCart;
  type?: "default" | "compact" | "display";
  fields?: string;
  className?: string;
}

const CartLineItem = ({
  item,
  cart,
  type = "default",
  fields,
  className,
}: CartLineItemProps) => {
  if (type === "compact") {
    return (
      <CompactCartLineItem
        item={item}
        cart={cart}
        fields={fields}
        className={className}
      />
    );
  }

  if (type === "display") {
    return (
      <DisplayCartLineItem item={item} cart={cart} className={className} />
    );
  }

  return (
    <div className="flex items-center gap-6 py-4">
      <div className="flex-shrink-0">
        <Thumbnail
          thumbnail={item.thumbnail}
          alt={item.product_title || item.title}
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-y-1">
        <span className="text-primary-text text-base font-medium-plus">
          {item.product_title}
        </span>
        {item.variant_title && item.variant_title !== "Default Variant" && (
          <span className="text-secondary-text text-sm">
            {item.variant_title}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <CartItemQuantitySelector item={item} fields={fields} />

        <div className="text-right">
          <LineItemPrice item={item} currencyCode={cart.currency_code} />
        </div>

        <CartDeleteItem item={item} fields={fields} />
      </div>
    </div>
  );
};

const CompactCartLineItem = ({ item, cart, fields }: CartLineItemProps) => {
  return (
    <div className="flex items-start gap-x-4" data-testid="cart-item">
      <Thumbnail
        thumbnail={item.thumbnail}
        alt={item.product_title || item.title}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="text-base font-medium line-clamp-1 text-primary-text">
              {item.product_title}
            </h4>
            <div className="text-sm text-secondary-text">
              {item.variant_title &&
                item.variant_title !== "Default Variant" && (
                  <span>{item.variant_title}</span>
                )}
            </div>
          </div>
          <CartDeleteItem item={item} fields={fields} />
        </div>

        <div className="flex items-center justify-between mt-2">
          <CartItemQuantitySelector item={item} fields={fields} />
          <Price
            price={item.total || 0}
            currencyCode={cart.currency_code}
            textSize="small"
          />
        </div>
      </div>
    </div>
  );
};

const DisplayCartLineItem = ({ item, cart, className }: CartLineItemProps) => {
  return (
    <div
      className={clsx(
        "flex items-center gap-4 py-3 border-b border-secondary-border last:border-b-0",
        className
      )}
    >
      <Thumbnail
        thumbnail={item.thumbnail}
        alt={item.product_title || item.title}
        className="w-16 h-16"
      />
      <div className="flex-1">
        <p className="text-base font-medium-plus text-primary-text">
          {item.product_title}
        </p>
        {item.variant_title && item.variant_title !== "Default Variant" && (
          <p className="text-sm text-secondary-text">{item.variant_title}</p>
        )}
        <p className="text-sm text-secondary-text">Quantity: {item.quantity}</p>
      </div>
      <div className="text-right">
        <Price
          price={item.total}
          currencyCode={cart.currency_code}
          textWeight="plus"
        />
      </div>
    </div>
  );
};

export default CartLineItem;
