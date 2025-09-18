import {
  loginCustomer,
  logoutCustomer,
  registerCustomer,
  retrieveCustomer,
  updateCustomer,
} from "@/lib/data/customer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCustomer = () => {
  return useQuery({
    queryKey: ["customer"],
    queryFn: retrieveCustomer,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["customer"] });
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerCustomer,
    onSuccess: (data) => {
      queryClient.setQueryData(["customer"], data.customer);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutCustomer,
    onSuccess: () => {
      queryClient.setQueryData(["customer"], null);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCustomer,
    onSuccess: (customer) => {
      queryClient.setQueryData(["customer"], customer);
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) => {
      // Note: This would need to be implemented based on your backend's password change endpoint
      // For now, returning a mock implementation
      throw new Error("Password change is currently not available. Please contact customer service.");
    },
  });
};
