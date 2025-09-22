import { sdk } from "@/lib/sdk";

export const listCartPaymentMethods = async ({
  region_id,
  fields,
}: {
  region_id: string;
  fields?: string;
}) => {
  const { payment_providers } = await sdk.store.payment.listPaymentProviders({
    region_id,
    fields
  });

  return payment_providers;
};
