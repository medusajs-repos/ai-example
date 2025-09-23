import {
  addToCart,
  applyPromoCode,
  clearAllCartCache,
  clearAllStorageData,
  completeCart,
  createCart,
  deleteLineItem,
  removePromoCode,
  retrieveCart,
  setAddresses,
  updateLineItem,
} from "@/lib/data/cart";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import {
  addItemOptimistically,
  createOptimisticCartItem,
  getCurrentCart,
  rollbackOptimisticCart,
  updateLineItemOptimistically,
  removeLineItemOptimistically,
} from "@/lib/utils/cart/optimistic-cart";
import { HttpTypes } from "@medusajs/types";

export const useCart = ({ fields }: { fields?: string } = {}) => {
  return useQuery({
    queryKey: queryKeys.cart.current(),
    queryFn: () => retrieveCart({ fields }),
    staleTime: 0
  });
};

export const useCreateCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.current() });
    },
  });
};

// Enhanced version that accepts product and variant data for better optimistic updates
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToCart,
    onMutate: async (variables: {
      variant_id: string;
      quantity: number;
      country_code: string;
      product?: HttpTypes.StoreProduct;
      variant?: HttpTypes.StoreProductVariant;
    }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.current() });

      // Snapshot the previous value
      const previousCart = getCurrentCart(queryClient);

      // If we have a cart and product/variant data, we can add optimistically
      if (previousCart && variables.product && variables.variant) {
        const optimisticItem = createOptimisticCartItem(
          variables.variant,
          variables.product,
          variables.quantity
        );

        addItemOptimistically(queryClient, optimisticItem);
      }

      // Return a context object with the snapshotted value
      return { previousCart };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousCart) {
        rollbackOptimisticCart(queryClient, context.previousCart);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.current() });
    },
  });
};

export const useUpdateLineItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateLineItem,
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.current() });

      // Snapshot the previous value
      const previousCart = getCurrentCart(queryClient);

      // Update optimistically
      if (previousCart) {
        updateLineItemOptimistically(queryClient, variables.line_id, variables.quantity);
      }

      // Return a context object with the snapshotted value
      return { previousCart };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousCart) {
        rollbackOptimisticCart(queryClient, context.previousCart);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.current() });
    },
  });
};

export const useDeleteLineItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLineItem,
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.current() });

      // Snapshot the previous value
      const previousCart = getCurrentCart(queryClient);

      // Remove optimistically
      if (previousCart) {
        removeLineItemOptimistically(queryClient, variables.line_id);
      }

      // Return a context object with the snapshotted value
      return { previousCart };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousCart) {
        rollbackOptimisticCart(queryClient, context.previousCart);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.current() });
    },
  });
};

export const useSetAddresses = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => setAddresses({ prev_state: null, form_data: formData }),
    onSuccess: (cart) => {
      // Update the cache with the fresh data from the server
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.current() });
    },
  });
};

export const useCompleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeCart,
    onSuccess: async (order, variables, context: { regionId: string }) => {
      // Clear all cart-related cache after successful order completion
      clearAllCartCache({ query_client: queryClient, cart_id: context?.regionId });

      // Clear all storage data (cookies, localStorage, sessionStorage)
      clearAllStorageData();
      await queryClient.refetchQueries({ queryKey: queryKeys.cart.all });

      return order;
    },
  });
};

export const useApplyPromoCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: applyPromoCode,
    onSuccess: (cart) => {
      // Update the cache with the fresh data from the server
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.current() });
    },
  });
};

export const useRemovePromoCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removePromoCode,
    onSuccess: (cart) => {
      // Update the cache with the fresh data from the server
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.current() });
    },
  });
};
