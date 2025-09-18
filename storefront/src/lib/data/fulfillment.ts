import { sdk } from "@/lib/config";
import { HttpTypes } from "@medusajs/types";

export const calculatePriceForShippingOption = async (
  optionId: string,
  cartId: string,
  data?: Record<string, unknown>
): Promise<HttpTypes.StoreCartShippingOption | null> => {
  const body: { cart_id: string; data?: Record<string, unknown> } = {
    cart_id: cartId,
  };

  if (data) {
    body.data = data;
  }

  try {
    const { shipping_option } =
      await sdk.store.fulfillment.calculateShippingOptionPrice(optionId, body);
    return shipping_option;
  } catch (error) {
    console.error("Failed to calculate shipping option price:", error);
    return null;
  }
};
