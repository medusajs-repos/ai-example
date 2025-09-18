import { sdk } from "@/lib/config";

export const listCartPaymentMethods = async (regionId: string) => {
  const { payment_providers } = await sdk.store.payment.listPaymentProviders({
    region_id: regionId,
  });

  return payment_providers;
};
