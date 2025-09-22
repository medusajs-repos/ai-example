import { sdk } from "@/lib/sdk";
import { HttpTypes } from "@medusajs/types";

export const calculatePriceForShippingOption = async ({
  option_id,
  cart_id,
  data,
}: {
  option_id: string;
  cart_id: string;
  data?: Record<string, unknown>;
}): Promise<HttpTypes.StoreCartShippingOption> => {
  const body: { cart_id: string; data?: Record<string, unknown> } = {
    cart_id,
  };

  if (data) {
    body.data = data;
  }

  const { shipping_option } =
    await sdk.store.fulfillment.calculate(option_id, body);
  return shipping_option;
};
