import {
  addToCart,
  applyPromoCode,
  clearAllCartCache,
  clearAllStorageData,
  completeCart,
  createCart,
  deleteLineItem,
  getOrSetCart,
  removePromoCode,
  retrieveCart,
  setAddresses,
  updateLineItem,
} from "@/lib/data/cart";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCart = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: () => retrieveCart(),
  });
};

export const useCreateCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCart,
    onSuccess: (cart) => {
      queryClient.setQueryData(["cart"], cart);
    },
  });
};

export const useGetOrSetCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: getOrSetCart,
    onSuccess: (cart) => {
      queryClient.setQueryData(["cart"], cart);
    },
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToCart,
    onSuccess: (updatedCart) => {
      // Update the cache with the fresh data from the server
      queryClient.setQueryData(["cart"], updatedCart);
    },
  });
};

export const useUpdateLineItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateLineItem,
    onSuccess: (cart) => {
      // Update the cache with the fresh data from the server
      queryClient.setQueryData(["cart"], cart);
    },
  });
};

export const useDeleteLineItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLineItem,
    onSuccess: async () => {
      // invalidate to ensure fresh data on next fetch
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useSetAddresses = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => setAddresses(null, formData),
    onSuccess: (cart) => {
      // Update the cache with the fresh data from the server
      queryClient.setQueryData(["cart"], cart);
    },
  });
};

export const useCompleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeCart,
    onSuccess: async (order, variables, context: any) => {
      // Clear all cart-related cache after successful order completion
      clearAllCartCache(queryClient, context?.regionId);

      // Clear all storage data (cookies, localStorage, sessionStorage)
      clearAllStorageData();

      // Force refetch the cart query to ensure UI updates immediately
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ["cart"] });
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
      queryClient.setQueryData(["cart"], cart);
    },
  });
};

export const useRemovePromoCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removePromoCode,
    onSuccess: (cart) => {
      // Update the cache with the fresh data from the server
      queryClient.setQueryData(["cart"], cart);
    },
  });
};
