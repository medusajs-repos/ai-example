import {
  useCart,
  useDeleteLineItem,
  useUpdateLineItem,
} from "@lib/hooks/useCart";
import { getCountryCodeFromPath } from "@lib/util/regions";
import { Minus, Plus, Trash } from "@medusajs/icons";
import { HttpTypes } from "@medusajs/types";
import { Button } from "@medusajs/ui";
import { Link, useLocation } from "@tanstack/react-router";
import { useState } from "react";

const CartDropdown = () => {
  const { data: cart } = useCart();
  const location = useLocation();
  const countryCode = getCountryCodeFromPath(location.pathname);
  const baseHref = countryCode ? `/${countryCode}` : "";

  const itemCount =
    cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  if (!cart || itemCount === 0) {
    return (
      <div className="bg-white shadow-elevation-flyout rounded-rounded border border-ui-border-base w-[420px] p-6">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="text-ui-fg-subtle mb-4">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293a1 1 0 00.293 1.707H19M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6m-8 0V9a2 2 0 012-2h4a2 2 0 012 2v4" />
            </svg>
          </div>
          <span className="text-small-regular text-ui-fg-subtle">
            Your cart is empty
          </span>
          <div className="mt-4">
            <Link to={`${baseHref}/store`}>
              <Button variant="secondary" size="base">
                Explore products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-elevation-flyout rounded-rounded border border-ui-border-base w-[420px] max-h-[402px] overflow-hidden">
      <div className="p-4 border-b border-ui-border-base">
        <div className="flex items-center justify-between">
          <h3 className="text-large-semi">Cart ({itemCount})</h3>
          <Link
            to={`${baseHref}/cart`}
            className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover text-small-regular"
          >
            Edit cart
          </Link>
        </div>
      </div>

      <div className="max-h-[250px] overflow-y-auto p-4 space-y-3">
        {cart.items?.map((item) => (
          <CartItem key={item.id} item={item} cart={cart} />
        ))}
      </div>

      <div className="p-4 border-t border-ui-border-base">
        <div className="flex items-center justify-between mb-4">
          <span className="text-base-regular text-ui-fg-subtle">Subtotal</span>
          <span className="text-base-semi">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: cart.currency_code,
            }).format(cart.item_subtotal)}
          </span>
        </div>

        <Link to={`${baseHref}/cart`}>
          <Button className="w-full" size="base">
            Go to cart
          </Button>
        </Link>
      </div>
    </div>
  );
};

const CartItem = ({
  item,
  cart,
}: {
  item: HttpTypes.StoreCartLineItem;
  cart: HttpTypes.StoreCart;
}) => {
  const imageUrl = item.variant?.product?.thumbnail || item.product?.thumbnail;
  const updateLineItem = useUpdateLineItem();
  const deleteLineItem = useDeleteLineItem();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || isUpdating) return;

    setIsUpdating(true);
    try {
      await updateLineItem.mutateAsync({
        lineId: item.id,
        quantity: newQuantity,
      });
    } catch (error) {
      console.error("Failed to update quantity:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      await deleteLineItem.mutateAsync(item.id);
    } catch (error) {
      console.error("Failed to delete item:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-start gap-x-4" data-testid="cart-item">
      <div className="w-16 h-16 bg-ui-bg-subtle rounded-rounded overflow-hidden flex-shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.product?.title || "Product"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ui-fg-subtle text-xs">
            No image
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="text-base-semi line-clamp-1">
              {item.product?.title}
            </h4>
            <div className="text-small-regular text-ui-fg-subtle">
              {item.variant?.title &&
                item.variant.title !== "Default Title" && (
                  <span>{item.variant.title}</span>
                )}
            </div>
          </div>
          <button
            onClick={handleDelete}
            disabled={isUpdating}
            className="text-ui-fg-subtle hover:text-ui-fg-base transition-colors p-1 ml-2"
            data-testid="cart-item-remove-button"
          >
            <Trash />
          </button>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-x-2">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={isUpdating || item.quantity <= 1}
              className="w-6 h-6 rounded-rounded border border-ui-border-base flex items-center justify-center text-ui-fg-subtle hover:text-ui-fg-base hover:bg-ui-bg-subtle-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="cart-item-reduce-button"
            >
              <Minus />
            </button>
            <span className="text-small-regular text-ui-fg-base min-w-[1.5rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={isUpdating}
              className="w-6 h-6 rounded-rounded border border-ui-border-base flex items-center justify-center text-ui-fg-subtle hover:text-ui-fg-base hover:bg-ui-bg-subtle-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="cart-item-increase-button"
            >
              <Plus />
            </button>
          </div>
          <span className="text-small-semi">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: cart.currency_code,
            }).format(item.total || 0)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartDropdown;
