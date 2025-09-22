import { sdk } from "@/lib/sdk";
import { setShippingMethod } from "@/lib/data/cart";
import { getCartId } from "@/lib/utils/cookies";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";

export const useShippingOptions = ({
  cart_id,
  fields,
}: {
  cart_id?: string;
  fields?: string;
} = {}) => {
  return useQuery({
    queryKey: queryKeys.shipping.options(cart_id || ""),
    queryFn: async () => {
      const id = cart_id || getCartId();
      if (!id) {
        throw new Error("No cart ID found");
      }

      const { shipping_options } = await sdk.store.fulfillment.listCartOptions({
        cart_id: id,
        fields: fields
      });
      return shipping_options;
    },
    enabled: !!cart_id || !!getCartId(),
    staleTime: 0
  });
};

export const useSetShippingMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setShippingMethod,
    onSuccess: async (cart) => {
      // Update the cart cache
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.current() });
      queryClient.invalidateQueries({ queryKey: queryKeys.shipping.options(cart.id) });
    },
  });
};
