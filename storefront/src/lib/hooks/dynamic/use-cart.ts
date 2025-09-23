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
    queryKey: queryKeys.cart.current(fields),
    queryFn: () => retrieveCart({ fields }),
    staleTime: 0
  });
};

export const useCreateCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: queryKeys.cart.predicate });
    },
  });
};

// Enhanced version that accepts product and variant data for better optimistic updates
export const useAddToCart = ({ fields }: { fields?: string } = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables) => addToCart({ ...variables, fields }),
    onMutate: async (variables: {
      variant_id: string;
      quantity: number;
      country_code: string;
      product?: HttpTypes.StoreProduct;
      variant?: HttpTypes.StoreProductVariant;
    }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ predicate: queryKeys.cart.predicate });

      // Snapshot the previous value
      const previousCart = getCurrentCart(queryClient, fields);

      // If we have a cart and product/variant data, we can add optimistically
      if (previousCart && variables.product && variables.variant) {
        const optimisticItem = createOptimisticCartItem(
          variables.variant,
          variables.product,
          variables.quantity
        );

        addItemOptimistically(queryClient, optimisticItem, fields);
      }

      // Return a context object with the snapshotted value
      return { previousCart };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousCart) {
        rollbackOptimisticCart(queryClient, context.previousCart, fields);
      }
    },
    onSettled: (data) => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ predicate: 
        (query) => queryKeys.cart.predicate(query, fields && data ? [fields] : undefined)
      });
      if (data) {
        queryClient.setQueryData(queryKeys.cart.current(fields), data);
      }
    },
  });
};

export const useUpdateLineItem = ({ fields }: { fields?: string } = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: {
      line_id: string;
      quantity: number;
    }) => updateLineItem({ ...variables, fields }),
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ 
        predicate: (query) => queryKeys.cart.predicate(query, fields ? [fields] : undefined)
      });

      // Snapshot the previous value
      const previousCart = getCurrentCart(queryClient, fields);

      // Update optimistically
      if (previousCart) {
        updateLineItemOptimistically(queryClient, variables.line_id, variables.quantity, fields);
      }

      // Return a context object with the snapshotted value
      return { previousCart };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousCart) {
        rollbackOptimisticCart(queryClient, context.previousCart, fields);
      }
    },
    onSettled: (data) => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ predicate: 
        (query) => queryKeys.cart.predicate(query, fields && data ? [fields] : undefined)
      });
      if (data) {
        queryClient.setQueryData(queryKeys.cart.current(fields), data);
      }
    },
  });
};

export const useDeleteLineItem = ({ fields }: { fields?: string } = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: {
      line_id: string;
    }) => deleteLineItem({ ...variables, fields }),
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ predicate: 
        (query) => queryKeys.cart.predicate(query, fields ? [fields] : undefined)
      });

      // Snapshot the previous value
      const previousCart = getCurrentCart(queryClient, fields);

      // Remove optimistically
      if (previousCart) {
        removeLineItemOptimistically(queryClient, variables.line_id, fields);
      }

      // Return a context object with the snapshotted value
      return { previousCart };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousCart) {
        rollbackOptimisticCart(queryClient, context.previousCart, fields);
      }
    },
    onSettled: (data) => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ predicate: 
        (query) => queryKeys.cart.predicate(query, fields && data ? [fields] : undefined)
      });
      if (data) {
        queryClient.setQueryData(queryKeys.cart.current(fields), data);
      }
    },
  });
};

export const useSetAddresses = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => setAddresses({ prev_state: null, form_data: formData }),
    onSuccess: (cart) => {
      // Update the cache with the fresh data from the server
      queryClient.invalidateQueries({ predicate: queryKeys.cart.predicate });
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
      await queryClient.refetchQueries({ predicate: queryKeys.cart.predicate });

      return order;
    },
  });
};

export const useApplyPromoCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: applyPromoCode,
    onSuccess: () => {
      // Update the cache with the fresh data from the server
      queryClient.invalidateQueries({ predicate: queryKeys.cart.predicate });
    },
  });
};

export const useRemovePromoCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removePromoCode,
    onSuccess: () => {
      // Update the cache with the fresh data from the server
      queryClient.invalidateQueries({ predicate: queryKeys.cart.predicate });
    },
  });
};
