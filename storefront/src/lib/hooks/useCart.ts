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
} from "@lib/data/cart";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCart = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: () => retrieveCart(),
    staleTime: 1000 * 60 * 5, // 5 minutes
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
    onSuccess: async (updatedCart) => {
      // Update the cache immediately with the returned cart data
      if (updatedCart) {
        queryClient.setQueryData(["cart"], updatedCart);
      }

      // Also invalidate to ensure fresh data on next fetch
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      console.error("Add to cart mutation error:", error);
    },
  });
};

export const useUpdateLineItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateLineItem,
    onSuccess: async (cart) => {
      // Update the cache immediately with the returned cart data
      if (cart) {
        queryClient.setQueryData(["cart"], cart);
      }

      // Also invalidate to ensure fresh data on next fetch
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      console.error("Update item mutation error:", error);
    },
  });
};

export const useDeleteLineItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLineItem,
    onSuccess: async (cart) => {
      // Update the cache immediately with the returned cart data
      if (cart) {
        queryClient.setQueryData(["cart"], cart);
      }

      // Also invalidate to ensure fresh data on next fetch
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      console.error("Delete item mutation error:", error);
    },
  });
};

export const useSetAddresses = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => setAddresses(null, formData),
    onSuccess: async (cart) => {
      // Update the cache immediately with the returned cart data
      if (cart) {
        queryClient.setQueryData(["cart"], cart);
      }

      // Also invalidate to ensure fresh data on next fetch
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      console.error("Set addresses mutation error:", error);
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
    onError: (error) => {
      console.error("Complete order error:", error);
    },
  });
};

export const useApplyPromoCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: applyPromoCode,
    onSuccess: async (cart) => {
      // Update the cache immediately with the returned cart data
      if (cart) {
        queryClient.setQueryData(["cart"], cart);
      }

      // Also invalidate to ensure fresh data on next fetch
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      console.error("Apply promo code mutation error:", error);
    },
  });
};

export const useRemovePromoCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removePromoCode,
    onSuccess: async (cart) => {
      // Update the cache immediately with the returned cart data
      if (cart) {
        queryClient.setQueryData(["cart"], cart);
      }

      // Also invalidate to ensure fresh data on next fetch
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      console.error("Remove promo code mutation error:", error);
    },
  });
};
