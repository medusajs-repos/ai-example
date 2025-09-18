import { sdk } from "@/lib/config";
import { getRegion } from "@/lib/data/regions";
import { getCartId, removeCartId, setCartId } from "@/lib/utils/cookies";
import { HttpTypes } from "@medusajs/types";

export const retrieveCart = async (
  cartId?: string
): Promise<HttpTypes.StoreCart | null> => {
  const id = cartId || getCartId();

  if (!id) {
    return null;
  }

  try {
    const { cart } = await sdk.store.cart.retrieve(id, {
      fields:
        "*items, *region, *items.product, *items.variant, *items.thumbnail, *items.metadata, +items.total, *promotions, +shipping_methods.name",
    });

    console.log(cart)

    return cart;
  } catch (error) {
    if (!cartId) {
      removeCartId();
    }

    return null;
  }
};

export const getOrSetCart = async (
  countryCode: string
): Promise<HttpTypes.StoreCart> => {
  const region = await getRegion(countryCode);

  if (!region) {
    throw new Error(`Region not found for country code: ${countryCode}`);
  }

  let cart = await retrieveCart();

  if (!cart) {
    // Create new cart
    const cartResp = await sdk.store.cart.create({ region_id: region.id }, {});
    cart = cartResp.cart;
    setCartId(cart.id);
  }

  // Update cart region if different
  if (cart && cart.region_id !== region.id) {
    await sdk.store.cart.update(cart.id, { region_id: region.id }, {});
  }

  return cart;
};

export const createCart = async (
  regionId: string
): Promise<HttpTypes.StoreCart> => {
  try {
    const { cart } = await sdk.store.cart.create({ region_id: regionId }, {});
    setCartId(cart.id);
    return cart;
  } catch (error) {
    throw error;
  }
};

export const addToCart = async ({
  variantId,
  quantity,
  countryCode,
}: {
  variantId: string;
  quantity: number;
  countryCode: string;
}): Promise<HttpTypes.StoreCart> => {
  if (!variantId) {
    throw new Error("Missing variant ID when adding to cart");
  }

  const cart = await getOrSetCart(countryCode);

  if (!cart) {
    throw new Error("Error retrieving or creating cart");
  }

  const response = await sdk.store.cart.createLineItem(
    cart.id,
    {
      variant_id: variantId,
      quantity,
    },
    {}
  );

  return response.cart;
};

export const updateLineItem = async ({
  lineId,
  quantity,
}: {
  lineId: string;
  quantity: number;
}): Promise<HttpTypes.StoreCart> => {
  const cartId = getCartId();

  if (!cartId) {
    throw new Error("No cart found");
  }

  const { cart } = await sdk.store.cart.updateLineItem(
    cartId,
    lineId,
    { quantity },
    {}
  );
  return cart;
};

export const deleteLineItem = async (lineId: string): Promise<void> => {
  const cartId = getCartId();

  if (!cartId) {
    throw new Error("No cart found");
  }

  await sdk.store.cart.deleteLineItem(cartId, lineId);
};

export const setAddresses = async (
  prevState: any,
  formData: FormData
): Promise<HttpTypes.StoreCart | null> => {
  const cartId = getCartId();

  if (!cartId) {
    throw new Error("No cart found");
  }

  const data = Object.fromEntries(formData.entries());

  const shippingAddress = {
    first_name: data["shipping_address.first_name"] as string,
    last_name: data["shipping_address.last_name"] as string,
    address_1: data["shipping_address.address_1"] as string,
    address_2: (data["shipping_address.address_2"] as string) || "",
    company: (data["shipping_address.company"] as string) || "",
    postal_code: data["shipping_address.postal_code"] as string,
    city: data["shipping_address.city"] as string,
    country_code: data["shipping_address.country_code"] as string,
    province: (data["shipping_address.province"] as string) || "",
    phone: (data["shipping_address.phone"] as string) || "",
  };

  const billingAddress =
    data["same_as_billing"] === "on"
      ? shippingAddress
      : {
          first_name: data["billing_address.first_name"] as string,
          last_name: data["billing_address.last_name"] as string,
          address_1: data["billing_address.address_1"] as string,
          address_2: (data["billing_address.address_2"] as string) || "",
          company: (data["billing_address.company"] as string) || "",
          postal_code: data["billing_address.postal_code"] as string,
          city: data["billing_address.city"] as string,
          country_code: data["billing_address.country_code"] as string,
          province: (data["billing_address.province"] as string) || "",
          phone: (data["billing_address.phone"] as string) || "",
        };

  const email = data.email as string;

  console.log({
    shipping_address: shippingAddress,
    billing_address: billingAddress,
    email,
  },)

  try {
    const { cart } = await sdk.store.cart.update(
      cartId,
      {
        shipping_address: shippingAddress,
        billing_address: billingAddress,
        email,
      },
      {}
    );
    return cart;
  } catch (error) {
    console.error("Failed to set addresses:", error);
    throw error;
  }
};

export const setShippingMethod = async (
  shippingOptionId: string
): Promise<HttpTypes.StoreCart> => {
  const cartId = getCartId();

  if (!cartId) {
    throw new Error("No cart found");
  }

  try {
    const { cart } = await sdk.store.cart.addShippingMethod(
      cartId,
      { option_id: shippingOptionId },
      {}
    );
    return cart;
  } catch (error) {
    console.error("Failed to set shipping method:", error);
    throw error;
  }
};

export const initiatePaymentSession = async (
  providerId: string
): Promise<any> => {
  const cartId = getCartId();

  if (!cartId) {
    throw new Error("No cart found");
  }

  // First retrieve the cart to pass to the payment API
  const cart = await retrieveCart(cartId);
  if (!cart) {
    throw new Error("Cart not found");
  }

  try {
    const response = await sdk.store.payment.initiatePaymentSession(
      cart,
      { provider_id: providerId },
      {}
    );
    return response;
  } catch (error) {
    console.error("Failed to initiate payment session:", error);
    throw error;
  }
};

export const setPaymentMethod = async (providerId: string): Promise<any> => {
  const cartId = getCartId();

  if (!cartId) {
    throw new Error("No cart found");
  }

  // First retrieve the cart to pass to the payment API
  const cart = await retrieveCart(cartId);
  if (!cart) {
    throw new Error("Cart not found");
  }

  try {
    const response = await sdk.store.payment.initiatePaymentSession(
      cart,
      { provider_id: providerId },
      {}
    );
    return response;
  } catch (error) {
    console.error("Failed to set payment method:", error);
    throw error;
  }
};

export const completeCart = async (): Promise<HttpTypes.StoreOrder> => {
  const cartId = getCartId();

  if (!cartId) {
    throw new Error("No cart found");
  }

  try {
    const cartRes = await sdk.store.cart.complete(cartId, {});

    if (cartRes?.type === "order") {
      // Clear the cart from storage after successful completion
      removeCartId();
      return cartRes.order;
    }

    // If not an order, something went wrong
    throw new Error("Order creation failed");
  } catch (error) {
    console.error("Failed to complete cart:", error);
    throw error;
  }
};

export const clearAllCartCache = (queryClient: any, regionId?: string) => {
  // Immediately set cart data to null to clear the UI
  queryClient.setQueryData(["cart"], null);

  // Remove all cart-related queries from cache
  queryClient.removeQueries({ queryKey: ["cart"] });

  // Clear payment methods cache
  if (regionId) {
    queryClient.removeQueries({ queryKey: ["payment-methods", regionId] });
  }
  queryClient.removeQueries({ queryKey: ["payment-methods"] });

  // Clear shipping options cache
  queryClient.removeQueries({ queryKey: ["shipping-options"] });

  // Clear any other cart-related caches
  queryClient.removeQueries({
    predicate: (query: { queryKey: string[] }) => {
      const queryKey = query.queryKey;
      return (
        queryKey &&
        (queryKey.includes("cart") ||
          queryKey.includes("payment") ||
          queryKey.includes("shipping") ||
          queryKey.includes("checkout"))
      );
    },
  });

  // Invalidate cart queries to trigger a fresh fetch with no cart ID
  queryClient.invalidateQueries({ queryKey: ["cart"] });
};

export const clearAllStorageData = () => {
  // Clear all cart-related cookies
  removeCartId();

  // Clear all cart-related localStorage items
  if (typeof localStorage !== "undefined") {
    const keysToRemove = [];

    // Collect all cart-related localStorage keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key &&
        (key.includes("cart") ||
          key.includes("checkout") ||
          key.includes("payment") ||
          key.includes("shipping") ||
          key.startsWith("medusa_cart") ||
          key.startsWith("_medusa_cart"))
      ) {
        keysToRemove.push(key);
      }
    }

    // Remove collected keys
    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });
  }

  // Clear all cart-related sessionStorage items
  if (typeof sessionStorage !== "undefined") {
    const keysToRemove = [];

    // Collect all cart-related sessionStorage keys
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (
        key &&
        (key.includes("cart") ||
          key.includes("checkout") ||
          key.includes("payment") ||
          key.includes("shipping") ||
          key.startsWith("medusa_cart") ||
          key.startsWith("_medusa_cart"))
      ) {
        keysToRemove.push(key);
      }
    }

    // Remove collected keys
    keysToRemove.forEach((key) => {
      sessionStorage.removeItem(key);
    });
  }
};

export const applyPromoCode = async (code: string): Promise<HttpTypes.StoreCart> => {
  const cartId = getCartId();

  if (!cartId) {
    throw new Error("No cart found");
  }

  try {
    const { cart } = await sdk.client.fetch<{ cart: HttpTypes.StoreCart }>(`/store/carts/${cartId}/promotions`, {
      method: "POST",
      body: {
        promo_codes: [code],
      },
    });

    return cart;
  } catch (error) {
    console.error("Failed to apply promo code:", error);
    throw error;
  }
};

export const removePromoCode = async (code: string): Promise<HttpTypes.StoreCart> => {
  const cartId = getCartId();

  if (!cartId) {
    throw new Error("No cart found");
  }

  try {
    const { cart } = await sdk.client.fetch<{ cart: HttpTypes.StoreCart }>(`/store/carts/${cartId}/promotions`, {
      method: "DELETE",
      body: {
        promo_codes: [code],
      },
    });

    return cart;
  } catch (error) {
    console.error("Failed to remove promo code:", error);
    throw error;
  }
};
