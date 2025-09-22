import { sdk } from "@/lib/sdk";
import { getRegion } from "@/lib/data/regions";
import { getCartId, removeCartId, setCartId } from "@/lib/utils/cookies";
import { HttpTypes } from "@medusajs/types";
import { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { sendPostRequest } from "./custom";
import { sendDeleteRequest } from "./custom";

export const retrieveCart = async ({
  cart_id,
  fields,
}: {
  cart_id?: string;
  fields?: string;
}): Promise<HttpTypes.StoreCart | null> => {
  const id = cart_id || getCartId();

  if (!id) {
    return null;
  }

  const { cart } = await sdk.store.cart.retrieve(id, {
    fields:
      fields || "*items, *region, *items.product, *items.variant, *items.thumbnail, *items.metadata, +items.total, *promotions, +shipping_methods.name",
  });

  return cart;
};

export const getOrSetCart = async ({
  country_code,
  fields,
}: {
  country_code: string;
  fields?: string;
}): Promise<HttpTypes.StoreCart> => {
  const region = await getRegion({ country_code });

  if (!region) {
    throw new Error(`Region not found for country code: ${country_code}`);
  }

  let cart = await retrieveCart({ fields });

  if (!cart) {
    // Create new cart
    const cartResp = await sdk.store.cart.create({ region_id: region.id });
    cart = cartResp.cart;
    setCartId(cart.id);
  }

  // Update cart region if different
  if (cart && cart.region_id !== region.id) {
    await sdk.store.cart.update(cart.id, { region_id: region.id });
  }

  return cart;
};

export const createCart = async ({
  region_id,
}: {
  region_id: string;
}): Promise<HttpTypes.StoreCart> => {
  const { cart } = await sdk.store.cart.create({ region_id });
  setCartId(cart.id);
  return cart;
};

export const addToCart = async ({
  variant_id,
  quantity,
  country_code,
}: {
  variant_id: string;
  quantity: number;
  country_code: string;
}): Promise<HttpTypes.StoreCart> => {
  if (!variant_id) {
    throw new Error("Missing variant ID when adding to cart");
  }

  const cart = await getOrSetCart({ country_code });

  if (!cart) {
    throw new Error("Error retrieving or creating cart");
  }

  const response = await sdk.store.cart.createLineItem(
    cart.id,
    {
      variant_id,
      quantity,
    },
  );

  return response.cart;
};

export const updateLineItem = async ({
  line_id,
  quantity,
}: {
  line_id: string;
  quantity: number;
}): Promise<HttpTypes.StoreCart> => {
  const cartId = getCartId();

  if (!cartId) {
    throw new Error("No cart found");
  }

  const { cart } = await sdk.store.cart.updateLineItem(
    cartId,
    line_id,
    { quantity },
  );
  return cart;
};

export const deleteLineItem = async ({
  line_id,
}: {
  line_id: string;
}): Promise<void> => {
  const cartId = getCartId();

  if (!cartId) {
    throw new Error("No cart found");
  }

  await sdk.store.cart.deleteLineItem(cartId, line_id);
};

export const setAddresses = async ({
  prev_state,
  form_data,
}: {
  prev_state: any;
  form_data: FormData;
}): Promise<HttpTypes.StoreCart> => {
  const cartId = getCartId();

  if (!cartId) {
    throw new Error("No cart found");
  }

  const data = Object.fromEntries(form_data.entries());

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

  const { cart } = await sdk.store.cart.update(
    cartId,
    {
      shipping_address: shippingAddress,
      billing_address: billingAddress,
      email,
    },
  );
  return cart;
};

export const setShippingMethod = async ({
  shipping_option_id,
}: {
  shipping_option_id: string;
}): Promise<HttpTypes.StoreCart> => {
  const cartId = getCartId();

  if (!cartId) {
    throw new Error("No cart found");
  }

  const { cart } = await sdk.store.cart.addShippingMethod(
    cartId,
    { option_id: shipping_option_id },
  );
  return cart;
};

export const initiatePaymentSession = async ({
  provider_id,
}: {
  provider_id: string;
}): Promise<HttpTypes.StorePaymentCollection> => {
  const cartId = getCartId();

  if (!cartId) {
    throw new Error("No cart found");
  }

  // First retrieve the cart to pass to the payment API
  const cart = await retrieveCart({ cart_id: cartId });
  if (!cart) {
    throw new Error("Cart not found");
  }

  const { payment_collection } = await sdk.store.payment.initiatePaymentSession(
    cart,
    { provider_id },
  );
  return payment_collection
};

export const setPaymentMethod = async ({
  provider_id,
}: {
  provider_id: string;
}): Promise<HttpTypes.StorePaymentCollection> => {
  const cartId = getCartId();

  if (!cartId) {
    throw new Error("No cart found");
  }

  // First retrieve the cart to pass to the payment API
  const cart = await retrieveCart({ cart_id: cartId });
  if (!cart) {
    throw new Error("Cart not found");
  }

  const { payment_collection } = await sdk.store.payment.initiatePaymentSession(
    cart,
    { provider_id },
  );
  return payment_collection;
};

export const completeCart = async (): Promise<HttpTypes.StoreOrder> => {
  const cartId = getCartId();

  if (!cartId) {
    throw new Error("No cart found");
  }

  const cartRes = await sdk.store.cart.complete(cartId, {});

  if (cartRes.type !== "order") {
    throw new Error("Order creation failed");
  }

  // Clear the cart from storage after successful completion
  removeCartId();
  return cartRes.order;
};

export const clearAllCartCache = ({
  query_client,
  cart_id,
  region_id,
}: {
  query_client: QueryClient;
  cart_id: string;
  region_id?: string;
}) => {
  // Immediately set cart data to null to clear the UI
  query_client.setQueryData(queryKeys.cart.current(), null);

  // Remove all cart-related queries from cache
  query_client.removeQueries({ queryKey: queryKeys.cart.current() });

  // Clear payment methods cache
  if (region_id) {
    query_client.removeQueries({ queryKey: queryKeys.payments.sessions(region_id) });
  }
  query_client.removeQueries({ queryKey: queryKeys.payments.sessions() });

  // Clear shipping options cache
  query_client.removeQueries({ queryKey: queryKeys.shipping.options(cart_id, region_id) });

  // Clear any other cart-related caches
  query_client.removeQueries({
    predicate: (query) => {
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
  query_client.invalidateQueries({ queryKey: queryKeys.cart.current() });
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

export const applyPromoCode = async ({
  code,
}: {
  code: string;
}): Promise<HttpTypes.StoreCart> => {
  const cartId = getCartId();

  if (!cartId) {
    throw new Error("No cart found");
  }

  const { cart } = await sendPostRequest<{ cart: HttpTypes.StoreCart }>(
    `/store/carts/${cartId}/promotions`, 
    {
      body: {
        promo_codes: [code],
      },
    }
  )

  return cart;
};

export const removePromoCode = async ({
  code,
}: {
  code: string;
}): Promise<HttpTypes.StoreCart> => {
  const cartId = getCartId();

  if (!cartId) {
    throw new Error("No cart found");
  }

  const { cart } = await sendDeleteRequest<
    { cart: HttpTypes.StoreCart }
  >(`/store/carts/${cartId}/promotions`, {
    body: {
      promo_codes: [code],
    },
  });

  return cart;
};
