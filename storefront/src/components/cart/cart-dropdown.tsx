import {
  useCart,
  useDeleteLineItem,
  useUpdateLineItem,
} from "@/lib/hooks/dynamic/use-cart";
import { getCountryCodeFromPath } from "@/lib/utils/regions";
import { MinusMini, PlusMini, ShoppingCart, Trash } from "@medusajs/icons";
import { HttpTypes } from "@medusajs/types";
import { Button, IconButton, toast } from "@medusajs/ui";
import { Link, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { NavbarLink } from "@/components/layout/navbar-link";
import { Price } from "@/components/common/price";
import { Thumbnail } from "../common/thumbnail";

const CartDropdown = () => {
  const { data: cart } = useCart();
  const location = useLocation();
  const countryCode = getCountryCodeFromPath(location.pathname);
  const baseHref = countryCode ? `/${countryCode}` : "";

  const itemCount =
    cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <div className="relative group">
      <NavbarLink
        to={`${baseHref}/cart`}
      >
        Cart ({itemCount})
      </NavbarLink>

      <div className="absolute top-full right-0 z-50 pt-2 group-hover:block hidden">
        <div className="bg-white shadow-elevation-flyout rounded-rounded border border-ui-border-base w-[420px] max-h-[402px] overflow-hidden">
          {(!cart || itemCount === 0) && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="text-ui-fg-subtle mb-4">
                <ShoppingCart />
              </div>
              <span className="txt-smallall-regular text-ui-fg-subtle">
                Your cart is empty
              </span>
              <div className="mt-4">
                <Link to={`${baseHref}/store` as any}>
                  <Button variant="secondary" size="base">
                    Explore products
                  </Button>
                </Link>
              </div>
            </div> 
          )}
          {cart && itemCount > 0 && (
            <>
              <div className="max-h-[250px] overflow-y-auto p-4 space-y-3">
                {cart.items?.map((item) => (
                  <CartItem key={item.id} item={item} cart={cart} />
                ))}
              </div>

              <div className="p-4 border-t border-ui-border-base">
                <div className="flex items-center justify-between mb-4">
                  <span className="txt-medium-regular text-ui-fg-subtle">Subtotal</span>
                  <Price
                    price={cart.item_subtotal}
                    currencyCode={cart.currency_code}
                    textClassName="txt-medium"
                  />
                </div>

                <Link to={`${baseHref}/cart` as any}>
                  <Button className="w-full" size="base">
                    Go to cart
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
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
  const updateLineItemMutation = useUpdateLineItem();
  const deleteLineItemMutation = useDeleteLineItem();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || isUpdating) return;

    setIsUpdating(true);
    updateLineItemMutation.mutateAsync({
      line_id: item.id,
      quantity: newQuantity,
    }, {
      onSuccess: () => {
        toast.success("Quantity updated");
      },
      onError: () => {
        toast.error("Failed to update quantity");
      },
      onSettled: () => {
        setIsUpdating(false);
      },
    });
  };

  const handleDelete = async () => {
    if (isUpdating) return;

    setIsUpdating(true);
    deleteLineItemMutation.mutateAsync({ line_id: item.id }, {
      onSuccess: () => {
        toast.success("Item deleted");
      },
      onError: () => {
        toast.error("Failed to delete item");
      },
      onSettled: () => {
        setIsUpdating(false);
      },
    });
  };

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
          <IconButton
            onClick={handleDelete}
            disabled={isUpdating}
            className="text-ui-fg-subtle hover:text-ui-fg-base transition-colors p-1 ml-2"
            variant="transparent"
          >
            <Trash />
          </IconButton>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-x-2">
            <IconButton
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={isUpdating || item.quantity <= 1}
              variant="transparent"
            >
              <MinusMini />
            </IconButton>
            <span className="txt-smallall-regular text-ui-fg-base min-w-[1.5rem] text-center">
              {item.quantity}
            </span>
            <IconButton
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={isUpdating}
              variant="transparent"
            >
              <PlusMini />
            </IconButton>
          </div>
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

export default CartDropdown;
