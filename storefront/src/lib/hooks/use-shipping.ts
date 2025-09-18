import { sdk } from "@/lib/config";
import { setShippingMethod } from "@/lib/data/cart";
import { getCartId } from "@/lib/utils/cookies";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useShippingOptions = (cartId?: string) => {
  return useQuery({
    queryKey: ["shipping-options", cartId],
    queryFn: async () => {
      const id = cartId || getCartId();
      if (!id) {
        throw new Error("No cart ID found");
      }

      const { shipping_options } = await sdk.store.fulfillment.listCartOptions({
        cart_id: id,
      });
      return shipping_options;
    },
    enabled: !!cartId || !!getCartId(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useSetShippingMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setShippingMethod,
    onSuccess: async (cart) => {
      // Update the cart cache
      if (cart) {
        queryClient.setQueryData(["cart"], cart);
      }

      // Invalidate shipping options as they may change
      await queryClient.invalidateQueries({ queryKey: ["shipping-options"] });
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
