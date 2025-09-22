import {
  loginCustomer,
  logoutCustomer,
  registerCustomer,
  retrieveCustomer,
  updateCustomer,
} from "@/lib/data/customer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";

export const useCustomer = (fields?: string) => {
  return useQuery({
    queryKey: queryKeys.customer.current(),
    queryFn: () => retrieveCustomer({ fields }),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.customer.all });
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerCustomer,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customer.current() });
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customer.current() });
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customer.current() });
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) => {
      // TODO: This would need to be implemented based on your backend's password change endpoint
      throw new Error("Password change is currently not available. Please contact customer service.");
    },
  });
};
