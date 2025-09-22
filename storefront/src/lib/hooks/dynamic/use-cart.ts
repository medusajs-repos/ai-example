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
    onSuccess: (cart) => {
      queryClient.setQueryData(queryKeys.cart.current(), cart);
    },
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToCart,
    onSuccess: (updatedCart) => {
      // Update the cache with the fresh data from the server
      queryClient.setQueryData(queryKeys.cart.current(), updatedCart);
    },
  });
};

export const useUpdateLineItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateLineItem,
    onSuccess: (cart) => {
      // Update the cache with the fresh data from the server
      queryClient.setQueryData(queryKeys.cart.current(), cart);
    },
  });
};

export const useDeleteLineItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLineItem,
    onSuccess: async () => {
      // invalidate to ensure fresh data on next fetch
      await queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
};

export const useSetAddresses = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => setAddresses({ prev_state: null, form_data: formData }),
    onSuccess: (cart) => {
      // Update the cache with the fresh data from the server
      queryClient.setQueryData(queryKeys.cart.current(), cart);
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

      // Force refetch the cart query to ensure UI updates immediately
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: queryKeys.cart.all });
      }, 100);

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
      queryClient.setQueryData(queryKeys.cart.current(), cart);
    },
  });
};

export const useRemovePromoCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removePromoCode,
    onSuccess: (cart) => {
      // Update the cache with the fresh data from the server
      queryClient.setQueryData(queryKeys.cart.current(), cart);
    },
  });
};
